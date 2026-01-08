// ============================================
// MAKTAB RASMLARINI GALEREYAGA QO'SHISH
// ============================================
// Bu kodni saytning browser console'ida ishga tushiring:
// 1. Saytga kiring (localhost yoki production)
// 2. F12 > Console'ga o'ting
// 3. Quyidagi kodni yopishtiring va Enter bosing
// ============================================

(async function() {
  console.log('🚀 Maktab rasmlarini galereyaga qo\'shish boshlandi...\n');
  
  // Supabase client'ni topish
  let supabase;
  
  try {
    // Saytda mavjud supabase client'ni olish
    if (window.__SUPABASE__) {
      supabase = window.__SUPABASE__;
    } else {
      // Environment variables'dan yaratish
      const SUPABASE_URL = import.meta?.env?.VITE_SUPABASE_URL || 
                          window.__ENV__?.VITE_SUPABASE_URL ||
                          prompt('Supabase URL ni kiriting:');
      
      const SUPABASE_KEY = import.meta?.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 
                          window.__ENV__?.VITE_SUPABASE_PUBLISHABLE_KEY ||
                          prompt('Supabase Anon Key ni kiriting:');
      
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('❌ Supabase URL va Key kerak!');
        return;
      }
      
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (error) {
    console.error('❌ Supabase client yaratishda xatolik:', error);
    return;
  }
  
  // Maktab papkasidagi barcha rasmlar
  const galleryImages = [
    { file: 'photo_2025-09-18_15-45-12.jpg', date: '2025-09-18', category: 'general' },
    { file: 'photo_2025-09-20_13-06-31.jpg', date: '2025-09-20', category: 'general' },
    { file: 'photo_2025-09-26_18-21-12.jpg', date: '2025-09-26', category: 'general' },
    { file: 'photo_2025-09-30_12-55-30.jpg', date: '2025-09-30', category: 'general' },
    { file: 'photo_2025-11-01_11-11-05.jpg', date: '2025-11-01', category: 'general' },
    { file: 'photo_2025-11-04_13-31-24.jpg', date: '2025-11-04', category: 'general' },
    { file: 'photo_2025-11-11_13-27-53.jpg', date: '2025-11-11', category: 'general' },
    { file: 'photo_2025-11-14_14-59-35.jpg', date: '2025-11-14', category: 'general' },
    { file: 'photo_2025-11-16_09-31-26.jpg', date: '2025-11-16', category: 'general' },
    { file: 'photo_2025-11-17_13-10-10.jpg', date: '2025-11-17', category: 'general' },
    { file: 'photo_2025-11-21_16-54-16.jpg', date: '2025-11-21', category: 'general' },
    { file: 'photo_2025-11-22_10-49-37.jpg', date: '2025-11-22', category: 'general' },
    { file: 'photo_2025-11-24_19-09-20.jpg', date: '2025-11-24', category: 'general' },
    { file: 'photo_2025-12-02_11-20-51.jpg', date: '2025-12-02', category: 'general' },
    { file: 'photo_2025-12-02_14-11-31.jpg', date: '2025-12-02', category: 'general' },
    { file: 'photo_2025-12-05_13-50-20.jpg', date: '2025-12-05', category: 'general' },
    { file: 'photo_2025-12-10_16-46-30.jpg', date: '2025-12-10', category: 'general' },
    { file: 'photo_2025-12-13_12-14-40.jpg', date: '2025-12-13', category: 'general' },
    { file: 'photo_2025-12-16_14-39-57.jpg', date: '2025-12-16', category: 'general' },
    { file: 'photo_2025-12-18_10-13-20.jpg', date: '2025-12-18', category: 'general' },
    { file: 'rasm.png', date: '2025-01-01', category: 'general' },
    { file: 'rasm4.png', date: '2025-01-01', category: 'general' },
    { file: 'rasm5.png', date: '2025-01-01', category: 'general' },
    { file: 'yutuq 2.png', date: '2025-01-01', category: 'Awards' },
  ];
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  console.log(`📸 Jami ${galleryImages.length} ta rasm qo'shilmoqda...\n`);
  
  for (let i = 0; i < galleryImages.length; i++) {
    const image = galleryImages[i];
    try {
      const imageUrl = `/maktab/${image.file}`;
      const title = image.file.replace(/\.(jpg|png)$/i, '').replace(/_/g, ' ').replace(/photo /g, '');
      
      console.log(`[${i + 1}/${galleryImages.length}] ${image.file}...`);
      
      // Check if image already exists
      const { data: existing } = await supabase
        .from('gallery')
        .select('id')
        .eq('image_url', imageUrl)
        .limit(1)
        .maybeSingle();
      
      if (existing) {
        console.log(`  ⏭️  O'tkazib yuborildi (mavjud)`);
        skipCount++;
        continue;
      }
      
      // Insert image
      const { error } = await supabase.from('gallery').insert({
        title_uz: title,
        title_ru: title,
        title_en: title,
        image_url: imageUrl,
        category: image.category,
        published: true,
        created_at: new Date(`${image.date}T12:00:00+05:00`).toISOString(),
      });
      
      if (error) {
        console.error(`  ❌ Xatolik: ${error.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Qo'shildi`);
        successCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`  ❌ Xatolik: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log('\n📊 Natija:');
  console.log(`   ✅ Muvaffaqiyatli qo'shildi: ${successCount}`);
  console.log(`   ⏭️  O'tkazib yuborildi: ${skipCount}`);
  console.log(`   ❌ Xatolar: ${errorCount}`);
  console.log(`   📝 Jami: ${galleryImages.length}\n`);
  
  if (successCount > 0) {
    console.log('🎉 Rasmlar galereyaga qo\'shildi! Sahifani yangilash uchun F5 ni bosing.');
  }
})();

