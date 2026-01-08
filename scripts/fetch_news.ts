import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables manually (since we're using tsx)
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
  }
}

loadEnv();

// Helper to extract data using Regex to avoid external dependencies like cheerio
const CHANNEL_URL = 'https://t.me/s/T2022PIMA';
const START_DATE = new Date('2025-08-25T00:00:00+05:00'); // User specified date

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase environment variables are missing!');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

// Initialize Supabase client with service role key (for admin operations)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface NewsItem {
  id: string;
  date: string; // ISO string
  text: string;
  image: string | null;
  link: string;
}

async function fetchUrl(url: string): Promise<string> {
  console.log(`Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.text();
}

function parseHtml(html: string): { items: NewsItem[], nextUrl: string | null } {
  const items: NewsItem[] = [];
  
  // Regex to find message wraps
  // This is a bit brittle but should work for Telegram's predictable structure
  const messageRegex = /<div class="tgme_widget_message_wrap js-widget_message_wrap.*?>(.*?)<\/div>\s*<\/div>\s*<\/div>/gs;
  
  // We split by "tgme_widget_message_wrap" to handle multiple messages
  // Better approach: Split the HTML into message blocks
  const contentStart = html.indexOf('<div class="tgme_channel_history js-message_history">');
  if (contentStart === -1) return { items: [], nextUrl: null };
  
  const historyHtml = html.substring(contentStart);
  const messageBlocks = historyHtml.split('class="tgme_widget_message_wrap');
  
  for (const block of messageBlocks) {
    if (!block.includes('js-widget_message_wrap')) continue;
    
    // Extract ID
    const idMatch = block.match(/data-post="T2022PIMA\/(\d+)"/);
    const id = idMatch ? idMatch[1] : '';
    
    // Extract Date using <time>
    const timeMatch = block.match(/datetime="([^"]+)"/);
    const dateStr = timeMatch ? timeMatch[1] : null;
    
    // Extract Text
    const textMatch = block.match(/<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/);
    let text = textMatch ? textMatch[1] : '';
    
    // Clean text: remove tags, fix entities
    text = text.replace(/<br\s*\/?>/gi, '\n')
               .replace(/<[^>]+>/g, '') // Remove other tags
               .replace(/&quot;/g, '"')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .trim();

    // Extract Image
    // Check for photo wrap
    const photoMatch = block.match(/class="tgme_widget_message_photo_wrap[^"]*"[^>]*style="background-image:url\('([^']+)'\)"/);
    let image = photoMatch ? photoMatch[1] : null;
    
    // Sometimes images are in other formats, but this is the main one for previews
    
    if (dateStr && text) {
       items.push({
         id,
         date: dateStr,
         text,
         image,
         link: `https://t.me/T2022PIMA/${id}`
       });
    }
  }

  // Find "previous" link (which is actually "before" for scrolling up/back in time)
  // Link looks like: <a class="tme_messages_more" href="/s/T2022PIMA?before=8193" ...>
  const nextMatch = html.match(/<a class="tme_messages_more" href="\/s\/T2022PIMA\?before=(\d+)"/);
  const nextUrl = nextMatch ? `${CHANNEL_URL}?before=${nextMatch[1]}` : null;

  return { items, nextUrl };
}

async function main() {
  let currentUrl: string | null = CHANNEL_URL;
  const allNews: NewsItem[] = [];
  let keepFetching = true;

  while (currentUrl && keepFetching) {
    try {
      const html = await fetchUrl(currentUrl);
      const { items, nextUrl } = parseHtml(html);
      
      if (items.length === 0) {
          console.log("No items found on page.");
          break;
      }

      for (const item of items) {
        const itemDate = new Date(item.date);
        if (itemDate >= START_DATE) {
          allNews.push(item);
        } else {
          // If we found a post older than start date, we can stop?
          // Note: Telegram preview pages are ordered? Usually newest at bottom of the chunk, but when we go "before", we go back in time.
          // The page shows a chunk of messages.
          // If the NEWEST message on the page is older than START_DATE, we can stop definitely.
          // If the OLDEST message on the page is older, we take the ones that are newer and stop.
        }
      }
      
      // Check date of the last item (which is the oldest in this batch usually? No, Telegram web preview shows oldest at top? Let's verify sort)
      // Usually "before=X" gives messages strictly before X. The displayed messages are X-1, X-2... down to X-20.
      // So the list `items` extracted in document order:
      // In the HTML, they are usually chronological (oldest top, newest bottom).
      
      // Let's sort items by date just to be sure
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Descending
      
      const oldestInBatch = items[items.length - 1];
      const newestInBatch = items[0];
      
      console.log(`Batch: ${newestInBatch.date} to ${oldestInBatch.date}. Collected ${items.length} items.`);

      if (new Date(oldestInBatch.date) < START_DATE) {
        console.log("Reached date limit.");
        keepFetching = false;
      }
      
      currentUrl = nextUrl;
      
      // Safety break
      if (allNews.length > 500) {
          console.log("Safety limit reached (500 items).");
          keepFetching = false;
      }

    } catch (e) {
      console.error(e);
      break;
    }
  }

  // Filter again to be precise
  const finalNews = allNews.filter(n => new Date(n.date) >= START_DATE);
  
  // Dedup by ID
  const uniqueNews = Array.from(new Map(finalNews.map(item => [item.id, item])).values());
  
  // Sort by Date Descending
  uniqueNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`\n✅ Total collected: ${uniqueNews.length} news items`);
  
  // Save to JSON file
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', 'news_data.json'), 
    JSON.stringify(uniqueNews, null, 2)
  );
  console.log('📄 Saved to scripts/news_data.json\n');

  // Insert to Supabase
  await insertToSupabase(uniqueNews);
}

async function insertToSupabase(newsItems: NewsItem[]) {
  console.log('📤 Inserting news to Supabase...\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const item of newsItems) {
    try {
      // Extract title from text (first line or first 100 characters)
      const textLines = item.text.split('\n').filter(line => line.trim());
      const title = textLines[0]?.trim().substring(0, 100) || item.text.substring(0, 100);
      const content = item.text;

      // Check if news already exists (by checking if link exists in content or by date)
      const { data: existing } = await supabase
        .from('news')
        .select('id')
        .eq('title_uz', title)
        .limit(1)
        .maybeSingle();

      if (existing) {
        console.log(`⏭️  Skipping (already exists): ${title.substring(0, 50)}...`);
        skipCount++;
        continue;
      }

      // Determine category based on content
      const category = determineCategory(item.text);

      // Insert news
      const { error } = await supabase.from('news').insert({
        title_uz: title,
        title_ru: title, // Same for now, can be translated later
        title_en: title, // Same for now, can be translated later
        content_uz: content,
        content_ru: content, // Same for now, can be translated later
        content_en: content, // Same for now, can be translated later
        category: category,
        image_url: item.image,
        published: true,
        created_at: item.date,
      });

      if (error) {
        console.error(`❌ Error inserting: ${title.substring(0, 50)}...`);
        console.error(`   ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ Inserted: ${title.substring(0, 50)}...`);
        successCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error: any) {
      console.error(`❌ Error processing item: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully inserted: ${successCount}`);
  console.log(`   ⏭️  Skipped (duplicates): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total processed: ${newsItems.length}\n`);
}

function determineCategory(text: string): string {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('olimpiada') || textLower.includes('olimpiya') || 
      textLower.includes('musobaqa') || textLower.includes('tanlov')) {
    return 'Awards';
  }
  if (textLower.includes('sport') || textLower.includes('futbol') || 
      textLower.includes('basketbol') || textLower.includes('jismoniy')) {
    return 'Sports';
  }
  if (textLower.includes('tadbir') || textLower.includes('bayram') || 
      textLower.includes('marosim') || textLower.includes('tantanali')) {
    return 'Events';
  }
  if (textLower.includes('fan') || textLower.includes('dars') || 
      textLower.includes('ta\'lim') || textLower.includes('bilim')) {
    return 'Academic';
  }
  
  return 'general';
}

main().catch(console.error);
