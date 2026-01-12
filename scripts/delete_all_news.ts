
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables manually
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; // Fallback if service role is missing, but RLS might block

if (!SUPABASE_URL) {
  console.error('❌ Supabase URL is missing!');
  process.exit(1);
}

// Prefer Service Role Key for deletion to bypass RLS
const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY;

if (!key) {
  console.error('❌ Supabase Key is missing!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, key);

async function deleteAllNews() {
  console.log('🗑️  Deleting all news...');

  // delete() requires a filter. neq('id', 0) matches everything usually if ids are ints, 
  // but if ids are UUIDs, we can use simple logic.
  // Or we can just use a condition that is always true.
  // Supabase (PostgREST) requires a WHERE clause for delete.
  
  // Let's checks what records exist first
  const { count, error: countError } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error('❌ Error checking count:', countError.message);
    return;
  }
  
  console.log(`Found ${count} news items.`);
  
  if (count === 0) {
    console.log('✅ No news to delete.');
    return;
  }

  // Delete all rows where id is not null (which is all rows)
  const { error } = await supabase
    .from('news')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Assuming UUIDs, checking for non-empty

  // Better approach for all rows: 
  // .gt('created_at', '1970-01-01')
  
  const { error: deleteError } = await supabase
    .from('news')
    .delete()
    .gt('id', '00000000-0000-0000-0000-000000000000'); // This counts on UUID sorting or similar. 
    // Actually, just delete where id IS NOT NULL isn't directly supported by syntax sugar easily without a value.
    // Use a filter that matches everything.
    
   // Another way: Fetch all IDs and delete them.
   
   const { data: allNews, error: fetchError } = await supabase
    .from('news')
    .select('id');
    
   if (fetchError) {
       console.error("❌ Error fetching IDs:", fetchError);
       return;
   }
   
   if (!allNews || allNews.length === 0) {
       console.log("✅ No news found to delete.");
       return;
   }
   
   const ids = allNews.map(n => n.id);
   console.log(`Deleting ${ids.length} items...`);
   
   const { error: batchDeleteError } = await supabase
    .from('news')
    .delete()
    .in('id', ids);

  if (batchDeleteError) {
    console.error('❌ Error deleting news:', batchDeleteError.message);
  } else {
    console.log('✅ All news deleted successfully!');
  }
}

deleteAllNews().catch(console.error);
