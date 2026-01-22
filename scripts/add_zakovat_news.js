// ZAKOVAT yangiligini qo'shish
// Bu kodni Node.js bilan ishga tushiring: node scripts/add_zakovat_news.js

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    });
  }
}

loadEnv();

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Supabase URL is missing!');
  console.error('Please set VITE_SUPABASE_URL or SUPABASE_URL in .env file');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase key is missing!');
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Yangilik ma'lumotlari
const newsData = {
  title_uz: '⚡️ "ZAKOVAT" intellektual oʻyini',
  title_ru: '⚡️ Интеллектуальная игра "ЗАКОВАТ"',
  title_en: '⚡️ "ZAKOVAT" Intellectual Game',
  content_uz: `⚡️ Ixtisoslashtirilgan taʼlim muassasalari agentligi tizimidagi Tuproqqalʼa tuman ixtisoslashtirilgan maktabida oʻqituvchilar ishtirokida oʻtkazilgan "ZAKOVAT" intellektual oʻyinidan lavhalar.

✨ Pedagoglar 4 kishilik 4 ta jamoaga boʻlingan holda ishtirok etishdi. Natijalar yakuniga koʻra INTELLEKT jamoasi gʻoliblikni qoʻlga kiritdi.

🎯Intellekt jamoasi tarkibi:

1. Bekturdiyev Gʻayrat (rus tili fani)

2. Radjapova Munisa (biologiya fani)

3. Saparova Saboxat (psixolog)

4. Axmedova Shoira (ingliz tili fani)`,
  content_ru: `⚡️ Кадры интеллектуальной игры "ЗАКОВАТ", проведенной среди учителей специализированной школы Тупроққалъа района в системе Агентства специализированных образовательных учреждений.

✨ Педагоги участвовали, разделившись на 4 команды по 4 человека. По итогам результатов команда ИНТЕЛЛЕКТ завоевала победу.

🎯 Состав команды Интеллект:

1. Бектурдиев Гайрат (русский язык)

2. Раджапова Муниса (биология)

3. Сапарова Сабохат (психолог)

4. Ахмедова Шойра (английский язык)`,
  content_en: `⚡️ Scenes from the "ZAKOVAT" intellectual game held among teachers at the Tuproqqal'a District Specialized School in the system of the Agency for Specialized Educational Institutions.

✨ Teachers participated by dividing into 4 teams of 4 people each. According to the final results, the INTELLEKT team won the victory.

🎯 Intellekt team composition:

1. Bekturdiyev Gʻayrat (Russian language)

2. Radjapova Munisa (Biology)

3. Saparova Saboxat (Psychologist)

4. Axmedova Shoira (English language)`,
  category: 'Events',
  image_url: '/zakovat.png',
  published: true,
  created_at: new Date().toISOString(),
};

async function addNews() {
  try {
    console.log('📤 Adding ZAKOVAT news to Supabase...\n');
    console.log('Title:', newsData.title_uz);
    console.log('Category:', newsData.category);
    console.log('Image:', newsData.image_url);
    console.log('');
    
    // Check if news already exists
    const { data: existing, error: checkError } = await supabase
      .from('news')
      .select('id')
      .eq('title_uz', newsData.title_uz)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error('⚠️ Error checking existing news:', checkError.message);
    }

    if (existing) {
      console.log('⏭️  News already exists in database!');
      console.log(`   Title: ${newsData.title_uz}`);
      console.log(`   ID: ${existing.id}`);
      return;
    }

    // Insert news
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select();

    if (error) {
      console.error('❌ Error inserting news:');
      console.error(`   ${error.message}`);
      console.error(`   Details:`, error);
      process.exit(1);
    }

    console.log('✅ News successfully added to Supabase!');
    console.log(`   Title: ${newsData.title_uz}`);
    console.log(`   Category: ${newsData.category}`);
    console.log(`   Published: ${newsData.published ? 'Yes' : 'No'}`);
    console.log(`   ID: ${data?.[0]?.id || 'N/A'}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

addNews();

