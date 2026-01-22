// ============================================
// ZAKOVAT YANGILIGINI BROWSER CONSOLE'DA QO'SHISH
// ============================================
// QO'LLASH:
// 1. Saytga kiring (http://localhost:5173 yoki production URL)
// 2. Admin panelga kiring va F12 bosing
// 3. Console tab'ga o'ting
// 4. Quyidagi kodni nusxalab yopishtiring va Enter bosing
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
    console.log('   Admin panel: ' + window.location.origin + '/admin');
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
    console.log('API URL:', API_BASE_URL + '/api/news');
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
      console.log('\n🎉 Yangilik News.tsx sahifasida ko\'rinadi!');
      console.log('💡 Sahifani yangilash uchun F5 ni bosing');
      
      // News sahifasini yangilash
      setTimeout(() => {
        if (window.location.pathname === '/news' || window.location.pathname.includes('/news')) {
          console.log('🔄 News sahifasini yangilayapman...');
          window.location.reload();
        } else {
          console.log('💡 /news sahifasiga o\'ting va yangilang');
        }
      }, 1000);
    } else {
      console.error('❌ Xatolik:', result.message || 'Noma\'lum xatolik');
      console.error('Status:', response.status);
      console.error('Tafsilotlar:', result);
      
      if (result.message?.includes('token') || result.message?.includes('auth') || response.status === 401) {
        console.log('\n💡 Yechim:');
        console.log('1. Admin panelga qayta kiring: ' + window.location.origin + '/admin');
        console.log('2. Token yangilanishi mumkin');
        console.log('3. Qayta urinib ko\'ring');
      } else if (response.status === 404) {
        console.log('\n💡 Yechim:');
        console.log('1. Backend server ishlayotganini tekshiring');
        console.log('2. API endpoint to\'g\'ri ekanligini tekshiring');
      }
    }
    
  } catch (error) {
    console.error('❌ Xatolik:', error);
    console.error('Stack:', error.stack);
    console.log('\n💡 Yechim:');
    console.log('1. Internet aloqasini tekshiring');
    console.log('2. Backend server ishlayotganini tekshiring');
    console.log('3. API URL to\'g\'ri ekanligini tekshiring');
    console.log('4. CORS sozlamalarini tekshiring');
  }
})();

