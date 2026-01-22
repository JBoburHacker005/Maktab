// ============================================
// ZAKOVAT YANGILIGINI API ORQALI QO'SHISH
// ============================================
// Bu kodni browser console'da ishga tushiring:
// 1. Saytga kiring (localhost yoki production)
// 2. Admin panelga kirib, F12 > Console'ga o'ting
// 3. Quyidagi kodni yopishtiring va Enter bosing
// ============================================

(async function() {
  console.log('🚀 ZAKOVAT yangiligini qo\'shish boshlandi...\n');
  
  // API base URL
  const API_BASE_URL = window.location.origin;
  
  // Token olish
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    console.error('❌ Admin token topilmadi!');
    console.log('💡 Iltimos, avval admin panelga kiring va qayta urinib ko\'ring.');
    return;
  }
  
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
    published: true
  };
  
  try {
    console.log('📤 Yangilikni API orqali qo\'shish...');
    console.log('Sarlavha:', newsData.title_uz);
    console.log('Kategoriya:', newsData.category);
    console.log('Rasm:', newsData.image_url);
    console.log('');
    
    // API so'rov yuborish
    const response = await fetch(`${API_BASE_URL}/api/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newsData)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Yangilik muvaffaqiyatli qo\'shildi!');
      console.log('ID:', result.data?.id);
      console.log('Sarlavha:', newsData.title_uz);
      console.log('Kategoriya:', newsData.category);
      console.log('Published:', newsData.published);
      console.log('\n🎉 Yangilik saytda ko\'rinadi!');
      console.log('💡 Sahifani yangilash uchun F5 ni bosing');
      
      // News sahifasini yangilash
      setTimeout(() => {
        if (window.location.pathname === '/news' || window.location.pathname.includes('/news')) {
          window.location.reload();
        }
      }, 1000);
    } else {
      console.error('❌ Xatolik:', result.message || 'Noma\'lum xatolik');
      console.error('Tafsilotlar:', result);
      
      if (result.message?.includes('token') || result.message?.includes('auth')) {
        console.log('\n💡 Yechim:');
        console.log('1. Admin panelga qayta kiring');
        console.log('2. Token yangilanishi mumkin');
        console.log('3. Qayta urinib ko\'ring');
      }
    }
    
  } catch (error) {
    console.error('❌ Xatolik:', error);
    console.error('Stack:', error.stack);
    console.log('\n💡 Yechim:');
    console.log('1. Internet aloqasini tekshiring');
    console.log('2. Backend server ishlayotganini tekshiring');
    console.log('3. API URL to\'g\'ri ekanligini tekshiring');
  }
})();

