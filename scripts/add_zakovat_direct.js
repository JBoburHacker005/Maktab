// ============================================
// ZAKOVAT YANGILIGINI TO'G'RIDAN-TO'G'RI QO'SHISH
// ============================================
// Bu kodni Node.js bilan ishga tushiring:
// node scripts/add_zakovat_direct.js
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UUID generatsiya qilish
function generateId() {
  return crypto.randomUUID();
}

// News.json fayl yo'li
const NEWS_FILE = path.join(__dirname, '..', 'backend', 'data', 'news.json');

// Yangilik ma'lumotlari
const newNews = {
  id: generateId(),
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
  updated_at: new Date().toISOString()
};

try {
  console.log('📤 ZAKOVAT yangiligini qo\'shish...\n');
  
  // Mavjud yangiliklarni o'qish
  let news = [];
  if (fs.existsSync(NEWS_FILE)) {
    const fileContent = fs.readFileSync(NEWS_FILE, 'utf-8');
    news = JSON.parse(fileContent);
  }
  
  // Duplikatni tekshirish
  const existing = news.find(item => item.title_uz === newNews.title_uz);
  if (existing) {
    console.log('⚠️ Bu yangilik allaqachon mavjud!');
    console.log('ID:', existing.id);
    console.log('Sarlavha:', existing.title_uz);
    return;
  }
  
  // Yangi yangilikni boshiga qo'shish (eng yangi birinchi)
  news.unshift(newNews);
  
  // Faylga yozish
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 4), 'utf-8');
  
  console.log('✅ Yangilik muvaffaqiyatli qo\'shildi!');
  console.log('ID:', newNews.id);
  console.log('Sarlavha:', newNews.title_uz);
  console.log('Kategoriya:', newNews.category);
  console.log('Rasm:', newNews.image_url);
  console.log('Published:', newNews.published);
  console.log('\n🎉 Yangilik News.tsx sahifasida ko\'rinadi!');
  console.log('💡 Backend serverni qayta ishga tushiring (agar ishlayotgan bo\'lsa)');
  
} catch (error) {
  console.error('❌ Xatolik:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

