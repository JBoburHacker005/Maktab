// ============================================
// YANGILIKNI QO'SHISH - BROWSER CONSOLE KODI
// ============================================
// Bu kodni saytning browser console'ida ishga tushiring:
// 1. Saytga kiring (localhost yoki production)
// 2. F12 > Console'ga o'ting
// 3. Quyidagi kodni yopishtiring va Enter bosing
// ============================================

(async function() {
  console.log('🚀 Yangilikni qo\'shish boshlandi...\n');
  
  // Supabase client'ni topish
  let supabase;
  
  // React DevTools orqali supabase client'ni olish
  try {
    // Vite dev server'da window.__SUPABASE__ mavjud bo'lishi mumkin
    if (window.__SUPABASE__) {
      supabase = window.__SUPABASE__;
      console.log('✅ Supabase client topildi (window.__SUPABASE__)');
    }
    // Yoki React component tree'dan olish
    else if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      // React DevTools hook orqali
      console.log('⚠️ React DevTools orqali topilmoqda...');
    }
    
    // Agar topilmasa, environment variables'dan yaratish
    if (!supabase) {
      // Vite environment variables
      const SUPABASE_URL = import.meta?.env?.VITE_SUPABASE_URL || 
                          window.__ENV__?.VITE_SUPABASE_URL ||
                          localStorage.getItem('SUPABASE_URL') ||
                          prompt('Supabase URL ni kiriting:');
      
      const SUPABASE_KEY = import.meta?.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 
                          window.__ENV__?.VITE_SUPABASE_PUBLISHABLE_KEY ||
                          localStorage.getItem('SUPABASE_KEY') ||
                          prompt('Supabase Anon Key ni kiriting:');
      
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('❌ Supabase URL va Key kerak!');
        console.log('📝 Iltimos, .env faylidan VITE_SUPABASE_URL va VITE_SUPABASE_PUBLISHABLE_KEY ni oling');
        return;
      }
      
      // Supabase client'ni CDN orqali yuklash
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('✅ Supabase client yaratildi');
    }
  } catch (error) {
    console.error('❌ Supabase client yaratishda xatolik:', error);
    console.log('\n📝 Qo\'lda kiriting:');
    console.log('1. Supabase Dashboard > Settings > API');
    console.log('2. Project URL va anon public key ni oling');
    console.log('3. Quyidagi kodni ishlating:\n');
    console.log(`
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    `);
    return;
  }
  
  // Yangilik ma'lumotlari
  const newsData = {
    title_uz: '2-sentabr — Yangi o\'quv yilining ilk qo\'ng\'irog\'i!',
    title_ru: '2 сентября — Первый звонок нового учебного года!',
    title_en: 'September 2 — First Bell of the New Academic Year!',
    content_uz: `📚✨ 2-sentabr — Yangi o'quv yilining ilk qo'ng'irog'i!

Bugun maktabimizda "Vatan uchun, millat uchun, xalq uchun" shiori ostida 5–11-sinflar o'quvchilari uchun tantanali "Birinchi qo'ng'iroq" tadbiri bo'lib o'tdi.

🎉 Tadbirda o'quvchilar, ustozlar va ota-onalar birgalikda yangi bilim yilini katta hayajon va quvonch bilan qarshi oldilar. Kuy-qo'shiqlar, she'rlar, dil so'zlari, ezgu tilaklar yangradi.

📖 "Birinchi qo'ng'iroq" nafaqat yangi dars yilining boshlanishi, balki o'quvchilarimizni bilim sari, yurt ravnaqi yo'lida intilish sari chorlovchi ramziy daqiqadir.

🌿 Tadbirda vatanparvarlik, millatga sadoqat, xalqimiz kelajagiga ishonch kabi g'oyalar tarannum etildi. Yangi o'quv yilida barcha o'quvchilarimizga mustahkam salomatlik, ilmga chanqoqlik va ulkan yutuqlar tilaymiz!`,
    content_ru: `📚✨ 2 сентября — Первый звонок нового учебного года!

Сегодня в нашей школе под девизом "За Родину, за нацию, за народ" состоялось торжественное мероприятие "Первый звонок" для учащихся 5–11 классов.

🎉 На мероприятии учащиеся, учителя и родители вместе встретили новый учебный год с большим волнением и радостью. Звучали песни, стихи, добрые слова и пожелания.

📖 "Первый звонок" — это не только начало нового учебного года, но и символический момент, призывающий наших учащихся стремиться к знаниям, к процветанию страны.

🌿 На мероприятии звучали идеи патриотизма, верности нации, веры в будущее нашего народа. В новом учебном году желаем всем нашим учащимся крепкого здоровья, жажды знаний и больших достижений!`,
    content_en: `📚✨ September 2 — First Bell of the New Academic Year!

Today at our school, under the motto "For the Homeland, for the Nation, for the People", a ceremonial "First Bell" event was held for students in grades 5–11.

🎉 At the event, students, teachers, and parents together welcomed the new academic year with great excitement and joy. Songs, poems, kind words, and wishes were heard.

📖 "First Bell" is not only the beginning of a new academic year, but also a symbolic moment calling our students to strive for knowledge and the prosperity of the country.

🌿 At the event, ideas of patriotism, loyalty to the nation, and faith in our people's future were expressed. In the new academic year, we wish all our students strong health, thirst for knowledge, and great achievements!`,
    category: 'Events',
    image_url: '/photo_2025-09-02_09-42-21.jpg',
    published: true,
    created_at: new Date('2025-09-02T10:00:00+05:00').toISOString(),
  };
  
  try {
    console.log('📤 Yangilikni qo\'shish...');
    console.log('Sarlavha:', newsData.title_uz);
    console.log('Kategoriya:', newsData.category);
    console.log('Rasm:', newsData.image_url);
    console.log('');
    
    // Duplikatni tekshirish
    const { data: existing } = await supabase
      .from('news')
      .select('id')
      .eq('title_uz', newsData.title_uz)
      .limit(1)
      .maybeSingle();
    
    if (existing) {
      console.log('⚠️ Bu yangilik allaqachon mavjud!');
      console.log('ID:', existing.id);
      return;
    }
    
    // Yangilikni qo'shish
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select();
    
    if (error) {
      console.error('❌ Xatolik:', error.message);
      console.error('Tafsilotlar:', error);
      
      // RLS policy xatosi bo'lsa
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('\n💡 Yechim:');
        console.log('1. Supabase Dashboard > Authentication > Policies');
        console.log('2. news jadvali uchun INSERT policy qo\'shing');
        console.log('3. Yoki service_role key bilan qo\'shing');
      }
      
      return;
    }
    
    console.log('✅ Yangilik muvaffaqiyatli qo\'shildi!');
    console.log('ID:', data[0]?.id);
    console.log('Sarlavha:', newsData.title_uz);
    console.log('Kategoriya:', newsData.category);
    console.log('Published:', newsData.published);
    console.log('\n🎉 Yangilik saytda ko\'rinadi!');
    
    // Sahifani yangilash
    setTimeout(() => {
      console.log('\n💡 Sahifani yangilash uchun F5 ni bosing');
    }, 1000);
    
  } catch (error) {
    console.error('❌ Xatolik:', error);
    console.error('Stack:', error.stack);
  }
})();

