// Bu kodni browser console'da ishga tushiring
// Saytga kiring va F12 > Console'ga yopishtiring

(async function() {
  // Supabase konfiguratsiyasi
  const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // O'zgartiring
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // O'zgartiring
  
  // Supabase client yaratish
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
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
    
    // Yangilikni qo'shish
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select();
    
    if (error) {
      console.error('❌ Xatolik:', error.message);
      return;
    }
    
    console.log('✅ Yangilik muvaffaqiyatli qo\'shildi!');
    console.log('ID:', data[0]?.id);
    console.log('Sarlavha:', newsData.title_uz);
    
  } catch (error) {
    console.error('❌ Xatolik:', error);
  }
})();

