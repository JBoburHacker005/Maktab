import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'uz' | 'ru';

interface Translations {
  [key: string]: {
    en: string;
    uz: string;
    ru: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: 'Home', uz: 'Bosh sahifa', ru: 'Главная' },
  about: { en: 'About Us', uz: 'Biz haqimizda', ru: 'О нас' },
  departments: { en: 'Departments', uz: "Bo'limlar", ru: 'Отделения' },
  news: { en: 'News', uz: 'Yangiliklar', ru: 'Новости' },
  events: { en: 'Events', uz: 'Tadbirlar', ru: 'Мероприятия' },
  gallery: { en: 'Gallery', uz: 'Galereya', ru: 'Галерея' },
  teachers: { en: 'Teachers', uz: "O'qituvchilar", ru: 'Учителя' },
  contact: { en: 'Contact', uz: 'Aloqa', ru: 'Контакты' },
  
  // Hero Section
  heroTitle: { en: 'Shaping Tomorrow\'s Leaders', uz: 'Ertangi yetakchilarni shakllantirish', ru: 'Формируем лидеров завтрашнего дня' },
  heroSubtitle: { en: 'Excellence in Education Since 1990', uz: '1990 yildan beri ta\'limda mukammallik', ru: 'Совершенство в образовании с 1990 года' },
  heroDescription: { en: "Tuproqqal'a tuman Ixtisoslashtirilgan maktabi provides world-class education with modern facilities, experienced teachers, and a commitment to nurturing each student's potential.", uz: "Tuproqqal'a tuman Ixtisoslashtirilgan maktabi zamonaviy inshootlar, tajribali o'qituvchilar va har bir o'quvchining salohiyatini rivojlantirishga sodiqlik bilan jahon darajasidagi ta'limni taqdim etadi.", ru: "Tuproqqal'a tuman Ixtisoslashtirilган maktabi предоставляет образование мирового класса с современными условиями, опытными преподавателями и стремлением раскрыть потенциал каждого ученика." },
  getStarted: { en: 'Get Started', uz: 'Boshlash', ru: 'Начать' },
  learnMore: { en: 'Learn More', uz: "Ko'proq o'rganish", ru: 'Узнать больше' },
  applyNow: { en: 'Apply Now', uz: 'Hozir ariza bering', ru: 'Подать заявку' },
  
  // Stats
  students: { en: 'Students', uz: "O'quvchilar", ru: 'Студенты' },
  teachersCount: { en: 'Teachers', uz: "O'qituvchilar", ru: 'Учителя' },
  yearsExp: { en: 'Years of Experience', uz: 'Yillik tajriba', ru: 'Лет опыта' },
  awards: { en: 'Awards Won', uz: 'Mukofotlar', ru: 'Награды' },
  
  // Features
  whyChooseUs: { en: 'Why Choose Us', uz: 'Nega bizni tanlash kerak', ru: 'Почему выбирают нас' },
  modernFacilities: { en: 'Modern Facilities', uz: 'Zamonaviy inshootlar', ru: 'Современные условия' },
  modernFacilitiesDesc: { en: 'State-of-the-art classrooms, labs, and sports facilities for holistic development.', uz: "Har tomonlama rivojlanish uchun zamonaviy sinfxonalar, laboratoriyalar va sport inshootlari.", ru: 'Современные классы, лаборатории и спортивные сооружения для всестороннего развития.' },
  expertTeachers: { en: 'Expert Teachers', uz: "Mutaxassis o'qituvchilar", ru: 'Опытные учителя' },
  expertTeachersDesc: { en: 'Dedicated educators with advanced degrees and years of teaching experience.', uz: "Ilg'or darajalar va ko'p yillik o'qitish tajribasiga ega fidoyi pedagoglar.", ru: 'Преданные педагоги с учёными степенями и многолетним опытом преподавания.' },
  globalCurriculum: { en: 'Global Curriculum', uz: "Xalqaro o'quv dasturi", ru: 'Международная программа' },
  globalCurriculumDesc: { en: 'Internationally recognized curriculum preparing students for global opportunities.', uz: "O'quvchilarni global imkoniyatlarga tayyorlaydigan xalqaro tan olingan o'quv dasturi.", ru: 'Международно признанная программа, готовящая студентов к глобальным возможностям.' },
  innovationLab: { en: 'Innovation Lab', uz: 'Innovatsiya laboratoriyasi', ru: 'Лаборатория инноваций' },
  innovationLabDesc: { en: 'Cutting-edge technology labs where students explore robotics, AI, and creative design.', uz: "O'quvchilar robototexnika, sun'iy intellekt va ijodiy dizaynni o'rganadigan zamonaviy texnologiya laboratoriyalari.", ru: 'Современные технологические лаборатории, где студенты изучают робототехнику, ИИ и креативный дизайн.' },
  safeEnvironment: { en: 'Safe Environment', uz: 'Xavfsiz muhit', ru: 'Безопасная среда' },
  safeEnvironmentDesc: { en: 'A secure, nurturing campus with 24/7 security and caring staff members.', uz: "24/7 xavfsizlik va g'amxo'r xodimlar bilan xavfsiz, parvarish qiluvchi kampus.", ru: 'Безопасный, заботливый кампус с круглосуточной охраной и внимательным персоналом.' },
  holisticGrowth: { en: 'Holistic Growth', uz: "Har tomonlama o'sish", ru: 'Всестороннее развитие' },
  holisticGrowthDesc: { en: 'Balanced focus on academics, arts, sports, and personal development.', uz: "Akademik, san'at, sport va shaxsiy rivojlanishga muvozanatli e'tibor.", ru: 'Сбалансированный фокус на учёбе, искусстве, спорте и личностном развитии.' },
  excellenceInEveryAspect: { en: 'Excellence in Every Aspect', uz: 'Har sohada mukammallik', ru: 'Совершенство во всём' },
  discoverWhatMakes: { en: "Discover what makes Tuproqqal'a tuman Ixtisoslashtirilgan maktabi the perfect choice for your child's educational journey.", uz: "Tuproqqal'a tuman Ixtisoslashtirilgan maktabi farzandingizning ta'lim sayohati uchun nima uchun eng yaxshi tanlov ekanligini bilib oling.", ru: "Узнайте, почему Tuproqqal'a tuman Ixtisoslashtirilgan maktabi — идеальный выбор для образовательного пути вашего ребёнка." },
  ctaTitle: { en: 'Ready to Join Our Community?', uz: 'Jamiyatimizga qo‘shilishga tayyormisiz?', ru: 'Готовы присоединиться к нашему сообществу?' },
  ctaDescription: { en: "Take the first step towards an exceptional education. Apply now and become part of the Tuproqqal'a tuman Ixtisoslashtirilgan maktabi family.", uz: "Ajoyib ta'lim sari birinchi qadamni qo'ying. Hozir ariza bering va Tuproqqal'a tuman Ixtisoslashtirilgan maktabi oilasining bir qismiga aylaning.", ru: 'Сделайте первый шаг к отличному образованию. Подайте заявку сейчас и станьте частью семьи Tuproqqal\'a tuman Ixtisoslashtirilgan maktabi.' },
  
  // About
  ourMission: { en: 'Our Mission', uz: 'Bizning vazifamiz', ru: 'Наша миссия' },
  ourVision: { en: 'Our Vision', uz: 'Bizning vizyonimiz', ru: 'Наше видение' },
  ourHistory: { en: 'Our History', uz: 'Bizning tarixmiz', ru: 'Наша история' },
  missionText: { en: 'To provide an inclusive, stimulating learning environment that empowers students to reach their full potential and become responsible global citizens.', uz: "O'quvchilarga o'z salohiyatlarini to'liq ro'yobga chiqarish va mas'uliyatli global fuqarolarga aylanishlarini ta'minlaydigan inklyuziv, rag'batlantiruvchi ta'lim muhitini taqdim etish.", ru: 'Обеспечить инклюзивную, стимулирующую учебную среду, которая позволяет учащимся полностью раскрыть свой потенциал и стать ответственными гражданами мира.' },
  ourAchievements: { en: 'Our Achievements', uz: 'Bizning yutuqlarimiz', ru: 'Наши достижения' },
  leadershipTitle: { en: 'Our Proud Students', uz: 'Biz faxirlanadigan o\'quvchilar', ru: 'Наши гордые ученики' },
  leadershipSubtitle: { en: 'Meet our outstanding students who have achieved great success.', uz: "Katta muvaffaqiyatlarga erishgan o'quvchilarimiz bilan tanishing.", ru: 'Познакомьтесь с нашими выдающимися учениками, достигшими больших успехов.' },
  visionText: { en: 'To be recognized as a leading educational institution that nurtures innovation, critical thinking, and lifelong learning.', uz: "Innovatsiyalarni, tanqidiy fikrlashni va umrbod ta'limni rivojlantiradigan yetakchi ta'lim muassasasi sifatida tan olinish.", ru: 'Быть признанным ведущим образовательным учреждением, развивающим инновации, критическое мышление и непрерывное обучение.' },
  buildingFuturesSince: { en: 'Building Futures Since 2022', uz: '2022 yildan beri kelajakni quramiz', ru: 'Строим будущее с 2022 года' },
  aboutHeroDescription: { en: "For over 4 years, Tuproqqal'a tuman Ixtisoslashtirilgan maktabi has been a beacon of educational excellence, nurturing young minds and preparing them for the challenges of tomorrow.", uz: "4 yildan ortiq davomida Tuproqqal'a tuman Ixtisoslashtirilgan maktabi ta'lim mukammalligining yorqin yulduziga aylandi, yosh aqllarni tarbiyaladi va ularni ertangi qiyinchiliklarga tayyorladi.", ru: "Более 4 лет Tuproqqal'a tuman Ixtisoslashtirilган maktabi является маяком образовательного совершенства, воспитывая молодые умы и готовя их к вызовам завтрашнего дня." },
  aboutEstablishment: { en: "Tuproqqal'a tuman ixtisoslashtirilgan maktabi was established in accordance with Decree No. 106 of the President of the Republic of Uzbekistan dated October 21, 2022, and operates within the system of the Agency for Specialized Educational Institutions.", uz: "Tuproqqal'a tuman ixtisoslashtirilgan maktabi O'zbekiston Respublikasi Prezidentining 2022 yil 21 oktyabrdagi 106-sonli farmoni asosida tashkil etilgan va Ixtisoslashtirilgan ta'lim muassasalari agentligi tizimida faoliyat yuritadi.", ru: "Tuproqqal'a tuman ixtisoslashtirilган maktabi была создана в соответствии с Указом Президента Республики Узбекистан № 106 от 21 октября 2022 года и действует в системе Агентства специализированных образовательных учреждений." },
  spiritualEducationalSports: { en: 'Spiritual, Educational, and Sports Activities', uz: "Ma'naviy, ta'limiy va sport tadbirlari", ru: 'Духовные, образовательные и спортивные мероприятия' },
  spiritualEducationalSportsDesc: { en: 'Great attention is paid to the physical and moral development of students at the school. Winners of national and international competitions in sports such as karate and Turon martial arts are being trained. In addition, festive events, contests, and military-sports competitions are regularly organized.', uz: "Maktabda o'quvchilarning jismoniy va axloqiy rivojlanishiga katta e'tibor qaratiladi. Karate va Turon jang san'ati kabi sportlarda milliy va xalqaro musobaqalar g'oliblari tayyorlanmoqda. Bundan tashqari, bayram tadbirlari, tanlovlar va harbiy-sport musobaqalari muntazam tashkil etiladi.", ru: 'Большое внимание уделяется физическому и нравственному развитию учащихся школы. Готовятся победители национальных и международных соревнований по таким видам спорта, как каратэ и боевые искусства Турон. Кроме того, регулярно проводятся праздничные мероприятия, конкурсы и военно-спортивные соревнования.' },
  psychologicalSupport: { en: 'Psychological Support', uz: 'Psixologik yordam', ru: 'Психологическая поддержка' },
  psychologicalSupportDesc: { en: 'Throughout the academic year, the school psychologist conducts more than 45 psychological training sessions aimed at developing students\' teamwork, leadership, and social adaptation skills.', uz: "O'quv yili davomida maktab psixologi o'quvchilarning jamoaviy ishlash, yetakchilik va ijtimoiy moslashuv ko'nikmalarini rivojlantirishga qaratilgan 45 dan ortiq psixologik trening o'tkazadi.", ru: 'В течение учебного года школьный психолог проводит более 45 психологических тренингов, направленных на развитие навыков командной работы, лидерства и социальной адаптации учащихся.' },
  qualityOfEducation: { en: 'Quality of Education and Achievements', uz: "Ta'lim sifati va yutuqlar", ru: 'Качество образования и достижения' },
  qualityOfEducationDesc: { en: 'Highly qualified teachers holding national and international certifications work at the school. Our students actively and successfully participate in regional, national, and international academic olympiads, competitions, and sports events, consistently achieving prize-winning places.', uz: "Maktabda milliy va xalqaro sertifikatlarga ega yuqori malakali o'qituvchilar ishlaydi. O'quvchilarimiz mintaqaviy, milliy va xalqaro akademik olimpiadalar, tanlovlar va sport tadbirlarida faol va muvaffaqiyatli qatnashib, doimo sovrinli o'rinlarni egallaydilar.", ru: 'В школе работают высококвалифицированные учителя с национальными и международными сертификатами. Наши ученики активно и успешно участвуют в региональных, национальных и международных академических олимпиадах, конкурсах и спортивных мероприятиях, неизменно занимая призовые места.' },
  winnersOfOlympiads: { en: 'Winners of regional and national olympiads', uz: 'Mintaqaviy va milliy olimpiadalar g\'oliblari', ru: 'Победители региональных и национальных олимпиад' },
  inMathematicsAndOther: { en: 'in mathematics and other subjects', uz: 'matematika va boshqa fanlardan', ru: 'по математике и другим предметам' },
  studentsHoldingCertificates: { en: 'Students holding certificates', uz: 'Sertifikatlarga ega o\'quvchilar', ru: 'Студенты с сертификатами' },
  ieltsCefrCertificates: { en: 'IELTS, CEFR, and national certificates', uz: 'IELTS, CEFR va milliy sertifikatlar', ru: 'Сертификаты IELTS, CEFR и национальные' },
  universityAdmission100: { en: '100% University Admission', uz: '100% universitetga qabul', ru: '100% поступление в университет' },
  universityAdmissionDesc: { en: 'In the 2024/2025 academic year, 100% of graduates were admitted to higher education institutions', uz: "2024/2025 o'quv yilida bitiruvchilarning 100% oliy ta'lim muassasalariga qabul qilindi", ru: 'В 2024/2025 учебном году 100% выпускников были приняты в высшие учебные заведения' },
  clubsAndDevelopment: { en: 'Clubs and Development', uz: 'Toʻgaraklar va rivojlanish', ru: 'Кружки и развитие' },
  clubsAndDevelopmentDesc: { en: 'At the school, the following clubs operate with the aim of developing students\' interests and talents:', uz: "Maktabda o'quvchilarning qiziqishlari va iste'dodlarini rivojlantirish maqsadida quyidagi to'garaklar faoliyat yuritadi:", ru: 'В школе действуют следующие кружки с целью развития интересов и талантов учащихся:' },
  computerLiteracy: { en: 'Computer Literacy', uz: 'Kompyuter savodxonligi', ru: 'Компьютерная грамотность' },
  biology: { en: 'Biology', uz: 'Biologiya', ru: 'Биология' },
  zakovatClub: { en: 'Zakovat (Intellectual Club)', uz: 'Zakovat (Intellektual klub)', ru: 'Заковат (Интеллектуальный клуб)' },
  youngChemists: { en: 'Young Chemists', uz: 'Yosh kimyogarlar', ru: 'Юные химики' },
  youngPhysicists: { en: 'Young Physicists', uz: 'Yosh fiziklar', ru: 'Юные физики' },
  mathematicians: { en: 'Mathematicians', uz: 'Matematiklar', ru: 'Математики' },
  teacherQualificationCategories: { en: 'Teacher Qualification Categories', uz: "O'qituvchilar malaka toifalari", ru: 'Квалификационные категории учителей' },
  teacherQualificationDesc: { en: 'In the 2024–2025 academic year, an analysis was conducted of the professional qualification categories of teachers working at the Tuproqqal\'a District Specialized School. These indicators demonstrate the high level of teachers\' qualifications and the quality of education.', uz: "2024–2025 o'quv yilida Tuproqqal'a tuman Ixtisoslashtirilgan maktabida ishlayotgan o'qituvchilarning kasbiy malaka toifalari tahlil qilindi. Bu ko'rsatkichlar o'qituvchilarning yuqori malaka darajasi va ta'lim sifatini namoyish etadi.", ru: 'В 2024–2025 учебном году был проведён анализ профессиональных квалификационных категорий учителей, работающих в специализированной школе Tuproqqal\'a района. Эти показатели демонстрируют высокий уровень квалификации учителей и качество образования.' },
  
  // Contact
  getInTouch: { en: 'Get In Touch', uz: 'Bog\'lanish', ru: 'Связаться' },
  contactHeroDescription: { en: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.", uz: "Savollaringiz bormi? Biz sizni eshitishni istaymiz. Xabar yuboring va imkon qadar tez javob beramiz.", ru: 'Есть вопросы? Мы будем рады вам ответить. Отправьте сообщение, и мы ответим как можно скорее.' },
  sendMessage: { en: 'Send Message', uz: 'Xabar yuborish', ru: 'Отправить' },
  yourName: { en: 'Your Name', uz: 'Ismingiz', ru: 'Ваше имя' },
  yourEmail: { en: 'Your Email', uz: 'Elektron pochtangiz', ru: 'Ваш email' },
  subject: { en: 'Subject', uz: 'Mavzu', ru: 'Тема' },
  message: { en: 'Message', uz: 'Xabar', ru: 'Сообщение' },
  address: { en: 'Address', uz: 'Manzil', ru: 'Адрес' },
  phone: { en: 'Phone', uz: 'Telefon', ru: 'Телефон' },
  email: { en: 'Email', uz: 'Elektron pochta', ru: 'Email' },
  workingHours: { en: 'Working Hours', uz: 'Ish vaqti', ru: 'Часы работы' },
  workingHoursLine1: { en: 'Mon - Fri: 8:00 AM - 5:00 PM', uz: 'Dush - Jum: 08:00 - 17:00', ru: 'Пн - Пт: 08:00 - 17:00' },
  workingHoursLine2: { en: 'Sat: 9:00 AM - 1:00 PM', uz: 'Shanba: 09:00 - 13:00', ru: 'Сб: 09:00 - 13:00' },
  
  // Footer
  quickLinks: { en: 'Quick Links', uz: 'Tezkor havolalar', ru: 'Быстрые ссылки' },
  contactInfo: { en: 'Contact Info', uz: 'Aloqa ma\'lumotlari', ru: 'Контактная информация' },
  newsletter: { en: 'Newsletter', uz: 'Axborotnoma', ru: 'Рассылка' },
  subscribe: { en: 'Subscribe', uz: 'Obuna bo\'lish', ru: 'Подписаться' },
  allRightsReserved: { en: 'All rights reserved', uz: 'Barcha huquqlar himoyalangan', ru: 'Все права защищены' },
  
  // Departments
  mathematics: { en: 'Mathematics', uz: 'Matematika', ru: 'Математика' },
  science: { en: 'Science', uz: 'Fan', ru: 'Наука' },
  languages: { en: 'Languages', uz: 'Tillar', ru: 'Языки' },
  arts: { en: 'Arts', uz: 'San\'at', ru: 'Искусство' },
  sports: { en: 'Sports', uz: 'Sport', ru: 'Спорт' },
  technology: { en: 'Technology', uz: 'Texnologiya', ru: 'Технологии' },
  
  // Search
  search: { en: 'Search...', uz: 'Qidirish...', ru: 'Поиск...' },

  // Page headings
  photoGallery: { en: 'Photo Gallery', uz: 'Foto galereya', ru: 'Фотогалерея' },
  photoGalleryDesc: { en: "Take a visual tour of our campus, facilities, and the vibrant life at Tuproqqal'a tuman Ixtisoslashtirilgan maktabi.", uz: "Kampusimiz, inshootlarimiz va Tuproqqal'a tuman Ixtisoslashtirilgan maktabidagi hayot bilan tanishing.", ru: "Совершите визуальную экскурсию по нашему кампусу, объектам и яркой жизни в Tuproqqal'a tuman Ixtisoslashtirilган maktabi." },
  latestNewsUpdates: { en: 'Latest News & Updates', uz: 'So\'nggi yangiliklar', ru: 'Последние новости' },
  latestNewsDesc: { en: "Stay informed about the latest happenings, achievements, and announcements from Tuproqqal'a tuman Ixtisoslashtirilgan maktabi.", uz: "Tuproqqal'a tuman Ixtisoslashtirilgan maktabidagi so'nggi voqealar, yutuqlar va e'lonlardan xabardor bo'ling.", ru: "Будьте в курсе последних событий, достижений и объявлений Tuproqqal'a tuman Ixtisoslashtirilган maktabi." },
  upcomingEvents: { en: 'Upcoming Events', uz: 'Kelgusi tadbirlar', ru: 'Предстоящие мероприятия' },
  upcomingEventsDesc: { en: "Mark your calendar for exciting events, performances, and activities happening at Tuproqqal'a tuman Ixtisoslashtirilgan maktabi.", uz: "Tuproqqal'a tuman Ixtisoslashtirilgan maktabida bo'ladigan qiziqarli tadbirlar, chiqishlar va faoliyatlar uchun taqvimingizni belgilang.", ru: "Отметьте в календаре захватывающие события, выступления и мероприятия в Tuproqqal'a tuman Ixtisoslashtirilган maktabi." },
  meetOurTeachers: { en: 'Meet Our Teachers', uz: 'O\'qituvchilarimiz bilan tanishing', ru: 'Познакомьтесь с нашими учителями' },
  meetOurTeachersDesc: { en: "Our dedicated faculty members bring expertise, passion, and a commitment to nurturing every student's potential.", uz: "Fidoyi o'qituvchilarimiz tajriba, ehtiros va har bir o'quvchining salohiyatini rivojlantirish majburiyatini olib keladi.", ru: 'Наши преданные преподаватели приносят опыт, страсть и стремление развивать потенциал каждого ученика.' },
  leadership: { en: 'Leadership', uz: 'Rahbariyat', ru: 'Руководство' },
  teachersStaff: { en: 'Teachers', uz: 'O\'qituvchilar', ru: 'Учителя' },
  
  // Categories
  all: { en: 'All', uz: 'Hammasi', ru: 'Все' },
  academic: { en: 'Academic', uz: 'Akademik', ru: 'Академический' },
  cultural: { en: 'Cultural', uz: 'Madaniy', ru: 'Культурный' },
  meeting: { en: 'Meeting', uz: 'Yig\'ilish', ru: 'Собрание' },
  career: { en: 'Career', uz: 'Karyera', ru: 'Карьера' },
  
  // Common actions
  readMore: { en: 'Read More', uz: 'Batafsil', ru: 'Подробнее' },
  viewAll: { en: 'View All', uz: 'Hammasini ko\'rish', ru: 'Смотреть все' },
  close: { en: 'Close', uz: 'Yopish', ru: 'Закрыть' },
  
  // Admin panel
  adminDashboard: { en: 'Dashboard', uz: 'Boshqaruv paneli', ru: 'Панель управления' },
  adminNews: { en: 'News', uz: 'Yangiliklar', ru: 'Новости' },
  adminEvents: { en: 'Events', uz: 'Tadbirlar', ru: 'Мероприятия' },
  adminGallery: { en: 'Gallery', uz: 'Galereya', ru: 'Галерея' },
  adminTeachers: { en: 'Teachers', uz: 'O\'qituvchilar', ru: 'Учителя' },
  adminDepartments: { en: 'Departments', uz: 'Bo\'limlar', ru: 'Отделения' },
  add: { en: 'Add', uz: 'Qo\'shish', ru: 'Добавить' },
  edit: { en: 'Edit', uz: 'Tahrirlash', ru: 'Редактировать' },
  delete: { en: 'Delete', uz: 'O\'chirish', ru: 'Удалить' },
  save: { en: 'Save', uz: 'Saqlash', ru: 'Сохранить' },
  cancel: { en: 'Cancel', uz: 'Bekor qilish', ru: 'Отмена' },
  publish: { en: 'Publish', uz: 'Nashr qilish', ru: 'Опубликовать' },
  unpublish: { en: 'Unpublish', uz: 'Nashrdan olish', ru: 'Снять с публикации' },
  confirmDelete: { en: 'Are you sure you want to delete?', uz: 'O\'chirishni tasdiqlaysizmi?', ru: 'Вы уверены, что хотите удалить?' },
  cannotUndo: { en: 'This action cannot be undone.', uz: 'Bu amalni qaytarib bo\'lmaydi.', ru: 'Это действие нельзя отменить.' },
  success: { en: 'Success!', uz: 'Muvaffaqiyatli!', ru: 'Успешно!' },
  error: { en: 'Error', uz: 'Xatolik', ru: 'Ошибка' },
  deleted: { en: 'Deleted', uz: 'O\'chirildi', ru: 'Удалено' },
  updated: { en: 'Updated', uz: 'Yangilandi', ru: 'Обновлено' },
  added: { en: 'Added', uz: 'Qo\'shildi', ru: 'Добавлено' },
  
  // Form fields
  titleUz: { en: 'Title (UZ)', uz: 'Sarlavha (UZ)', ru: 'Заголовок (UZ)' },
  titleRu: { en: 'Title (RU)', uz: 'Sarlavha (RU)', ru: 'Заголовок (RU)' },
  titleEn: { en: 'Title (EN)', uz: 'Sarlavha (EN)', ru: 'Заголовок (EN)' },
  descriptionUz: { en: 'Description (UZ)', uz: 'Tavsif (UZ)', ru: 'Описание (UZ)' },
  descriptionRu: { en: 'Description (RU)', uz: 'Tavsif (RU)', ru: 'Описание (RU)' },
  descriptionEn: { en: 'Description (EN)', uz: 'Tavsif (EN)', ru: 'Описание (EN)' },
  nameUz: { en: 'Name (UZ)', uz: 'Nomi (UZ)', ru: 'Название (UZ)' },
  nameRu: { en: 'Name (RU)', uz: 'Nomi (RU)', ru: 'Название (RU)' },
  nameEn: { en: 'Name (EN)', uz: 'Nomi (EN)', ru: 'Название (EN)' },
  imageUrl: { en: 'Image URL', uz: 'Rasm URL', ru: 'URL изображения' },
  category: { en: 'Category', uz: 'Kategoriya', ru: 'Категория' },
  date: { en: 'Date', uz: 'Sana', ru: 'Дата' },
  location: { en: 'Location', uz: 'Joylashuv', ru: 'Место' },
  iconName: { en: 'Icon Name', uz: 'Icon nomi', ru: 'Название иконки' },
  
  // Subjects
  physicsSubject: { en: 'Physics', uz: 'Fizika', ru: 'Физика' },
  chemistrySubject: { en: 'Chemistry', uz: 'Kimyo', ru: 'Химия' },
  biologySubject: { en: 'Biology', uz: 'Biologiya', ru: 'Биология' },
  historySubject: { en: 'History', uz: 'Tarix', ru: 'История' },
  geographySubject: { en: 'Geography', uz: 'Geografiya', ru: 'География' },
  englishSubject: { en: 'English Literature', uz: 'Ingliz tili', ru: 'Английский язык' },
  russianSubject: { en: 'Russian Literature', uz: 'Rus tili', ru: 'Русский язык' },
  uzbekSubject: { en: 'Uzbek Literature', uz: 'O\'zbek tili', ru: 'Узбекский язык' },
  computerScienceSubject: { en: 'Computer Science', uz: 'Informatika', ru: 'Информатика' },
  physicalEducationSubject: { en: 'Physical Education', uz: 'Jismoniy tarbiya', ru: 'Физическая культура' },
  artSubject: { en: 'Art', uz: 'San\'at', ru: 'Искусство' },
  preMilitarySubject: { en: 'Pre-Military Training', uz: 'Chaqiruv oldi harbiy tayyorgarlik', ru: 'Начальная военная подготовка' },
  psychologistRole: { en: 'Psychologist', uz: 'Psixolog', ru: 'Психолог' },
  secretaryRole: { en: 'Secretary', uz: 'Kotiba', ru: 'Секретарь' },
  
  // Director roles
  directorRole: { en: 'Director', uz: 'Direktor', ru: 'Директор' },
  viceDirectorSpiritual: { en: 'Vice Director (Spiritual-Educational)', uz: "Direktor o'rinbosari (ma'naviy-ma'rifiy)", ru: 'Заместитель директора (духовно-просветительский)' },
  directorAdvisor: { en: 'Director Advisor', uz: 'Direktor maslahatchisi', ru: 'Советник директора' },
  viceDirectorAcademic: { en: 'Vice Director (Academic)', uz: "Direktor o'rinbosari (o'quv ishlari)", ru: 'Заместитель директора (учебная часть)' },
  
  // Footer
  footerDescription: { en: 'Empowering minds, shaping futures. We provide world-class education with a focus on innovation and excellence.', uz: 'Aqllarni kuchaytirish, kelajakni shakllantirish. Biz innovatsiya va mukammallikka e\'tibor qaratgan holda jahon darajasidagi ta\'limni taqdim etamiz.', ru: 'Расширяем возможности ума, формируем будущее. Мы предоставляем образование мирового класса с акцентом на инновации и совершенство.' },
  newsletterDescription: { en: 'Subscribe to our newsletter for updates and news.', uz: 'Yangiliklar va yangilanishlar uchun axborotnomamizga obuna bo\'ling.', ru: 'Подпишитесь на нашу рассылку, чтобы получать обновления и новости.' },
  privacyPolicy: { en: 'Privacy Policy', uz: 'Maxfiylik siyosati', ru: 'Политика конфиденциальности' },
  termsOfService: { en: 'Terms of Service', uz: 'Xizmat shartlari', ru: 'Условия использования' },
  creator: { en: 'Creator:', uz: 'Yaratuvchi:', ru: 'Создатель:' },
  
  // About page additional translations
  teacherCategoryAnalysis: { en: 'According to the analysis results:', uz: 'Tahlil natijalariga ko\'ra:', ru: 'Согласно результатам анализа:' },
  teacherCategorySpecialist: { en: 'teacher holds the Specialist category,', uz: 'o\'qituvchi Mutaxassis toifasiga ega,', ru: 'учитель имеет категорию Специалист,' },
  teacherCategorySecond: { en: 'teachers are in the Second category,', uz: 'o\'qituvchi Ikkinchi toifada,', ru: 'учителя во Второй категории,' },
  teacherCategoryFirst: { en: 'teachers are in the First category,', uz: 'o\'qituvchi Birinchi toifada,', ru: 'учителя в Первой категории,' },
  teacherCategoryHighest: { en: 'teachers hold the Highest category.', uz: 'o\'qituvchi Oliy toifaga ega.', ru: 'учителя имеют Высшую категорию.' },
  teacherCategoryConclusion: { en: 'These results clearly indicate that the school has a high proportion of experienced and highly qualified teachers. In particular, the large number of teachers with the highest qualification category significantly contributes to improving the effectiveness of the educational process and has a positive impact on students\' academic performance and achievements.', uz: 'Bu natijalar maktabda tajribali va yuqori malakali o\'qituvchilarning yuqori ulushiga ega ekanligini aniq ko\'rsatadi. Xususan, eng yuqori malaka toifasiga ega o\'qituvchilarning ko\'p soni ta\'lim jarayonining samaradorligini oshirishga sezilarli hissa qo\'shadi va o\'quvchilarning akademik ko\'rsatkichlari va yutuqlariga ijobiy ta\'sir ko\'rsatadi.', ru: 'Эти результаты ясно показывают, что в школе высокая доля опытных и высококвалифицированных учителей. В частности, большое количество учителей с высшей квалификационной категорией значительно способствует повышению эффективности образовательного процесса и положительно влияет на академические показатели и достижения учащихся.' },
  
  // Contact page
  messageSent: { en: 'Message Sent!', uz: 'Xabar yuborildi!', ru: 'Сообщение отправлено!' },
  messageSentDesc: { en: 'We\'ll get back to you as soon as possible.', uz: 'Imkon qadar tezroq javob beramiz.', ru: 'Мы ответим вам как можно скорее.' },
  sending: { en: 'Sending...', uz: 'Yuborilmoqda...', ru: 'Отправка...' },
  placeholderName: { en: 'John Doe', uz: 'Ism Familiya', ru: 'Имя Фамилия' },
  placeholderEmail: { en: 'john@example.com', uz: 'email@misol.uz', ru: 'email@example.com' },
  placeholderSubject: { en: 'How can we help?', uz: 'Qanday yordam bera olamiz?', ru: 'Чем мы можем помочь?' },
  placeholderMessage: { en: 'Your message here...', uz: 'Xabaringizni yozing...', ru: 'Ваше сообщение...' },
  
  // News page
  latestNewsTitle: { en: 'Latest News & Updates', uz: 'So\'nggi yangiliklar va yangilanishlar', ru: 'Последние новости и обновления' },
  latestNewsDesc: { en: 'Stay informed about the latest happenings, achievements, and announcements from Tuproqqal\'a tuman Ixtisoslashtirilgan maktabi.', uz: 'Tuproqqal\'a tuman Ixtisoslashtirilgan maktabidagi so\'nggi voqealar, yutuqlar va e\'lonlardan xabardor bo\'ling.', ru: 'Будьте в курсе последних событий, достижений и объявлений Tuproqqal\'a tuman Ixtisoslashtirilган maktabi.' },
  newsCategoryAcademic: { en: 'Academic', uz: 'Akademik', ru: 'Академический' },
  newsCategorySports: { en: 'Sports', uz: 'Sport', ru: 'Спорт' },
  newsCategoryEvents: { en: 'Events', uz: 'Tadbirlar', ru: 'Мероприятия' },
  newsCategoryAwards: { en: 'Awards', uz: 'Mukofotlar', ru: 'Награды' },
  
  // Events page
  upcomingEventsTitle: { en: 'Upcoming Events', uz: 'Kelgusi tadbirlar', ru: 'Предстоящие мероприятия' },
  upcomingEventsDesc: { en: 'Mark your calendar for exciting events, performances, and activities happening at Tuproqqal\'a tuman Ixtisoslashtirilgan maktabi.', uz: 'Tuproqqal\'a tuman Ixtisoslashtirilgan maktabida bo\'ladigan qiziqarli tadbirlar, chiqishlar va faoliyatlar uchun taqvimingizni belgilang.', ru: 'Отметьте в календаре захватывающие события, выступления и мероприятия в Tuproqqal\'a tuman Ixtisoslashtirilган maktabi.' },
  
  // Gallery page
  photoGalleryTitle: { en: 'Photo Gallery', uz: 'Foto galereya', ru: 'Фотогалерея' },
  photoGalleryDesc: { en: 'Take a visual tour of our campus, facilities, and the vibrant life at Tuproqqal\'a tuman Ixtisoslashtirilgan maktabi.', uz: 'Kampusimiz, inshootlarimiz va Tuproqqal\'a tuman Ixtisoslashtirilgan maktabidagi hayot bilan tanishing.', ru: 'Совершите визуальную экскурсию по нашему кампусу, объектам и яркой жизни в Tuproqqal\'a tuman Ixtisoslashtirilган maktabi.' },
  
  // Teachers page
  meetOurTeachersTitle: { en: 'Meet Our Teachers', uz: 'O\'qituvchilarimiz bilan tanishing', ru: 'Познакомьтесь с нашими учителями' },
  meetOurTeachersDesc: { en: 'Our dedicated faculty members bring expertise, passion, and a commitment to nurturing every student\'s potential.', uz: 'Fidoyi o\'qituvchilarimiz tajriba, ehtiros va har bir o\'quvchining salohiyatini rivojlantirish majburiyatini olib keladi.', ru: 'Наши преданные преподаватели приносят опыт, страсть и стремление развивать потенциал каждого ученика.' },
  leadershipTitle: { en: 'Leadership', uz: 'Rahbariyat', ru: 'Руководство' },
  teachersTitle: { en: 'Teachers', uz: 'O\'qituvchilar', ru: 'Учителя' },
  
  // Departments page
  academicExcellence: { en: 'Academic Excellence', uz: 'Akademik mukammallik', ru: 'Академическое совершенство' },
  academicExcellenceDesc: { en: 'Explore our diverse range of departments, each dedicated to providing exceptional education and fostering student success.', uz: 'Har biri ajoyib ta\'limni taqdim etish va o\'quvchilar muvaffaqiyatini rivojlantirishga bag\'ishlangan turli bo\'limlarimizni o\'rganing.', ru: 'Изучите наш разнообразный спектр отделений, каждое из которых посвящено предоставлению исключительного образования и развитию успеха студентов.' },
  music: { en: 'Music', uz: 'Musiqa', ru: 'Музыка' },
  researchLab: { en: 'Research Lab', uz: 'Tadqiqot laboratoriyasi', ru: 'Исследовательская лаборатория' },
  
  // School name (for navbar)
  schoolName: { en: 'Tuproqqal\'a tuman Ixtisoslashtirilgan maktabi', uz: 'Tuproqqal\'a tuman Ixtisoslashtirilgan maktabi', ru: 'Tuproqqal\'a tuman Ixtisoslashtirilган maktabi' },
  
  // About page - Additional hardcoded texts
  spiritualEducationalSportsTitle: { en: 'Spiritual, Educational, and Sports Activities', uz: 'Ma\'naviy, ta\'limiy va sport tadbirlari', ru: 'Духовные, образовательные и спортивные мероприятия' },
  psychologicalSupportTitle: { en: 'Psychological Support', uz: 'Psixologik yordam', ru: 'Психологическая поддержка' },
  qualityOfEducationTitle: { en: 'Quality of Education and Achievements', uz: 'Ta\'lim sifati va yutuqlar', ru: 'Качество образования и достижения' },
  clubsAndDevelopmentTitle: { en: 'Clubs and Development', uz: 'To\'garaklar va rivojlanish', ru: 'Кружки и развитие' },
  teacherQualificationCategoriesTitle: { en: 'Teacher Qualification Categories', uz: 'O\'qituvchilar malaka toifalari', ru: 'Квалификационные категории учителей' },
  teacherCategoryAnalysisTitle: { en: 'According to the analysis results:', uz: 'Tahlil natijalariga ko\'ra:', ru: 'Согласно результатам анализа:' },
  teacherCategorySpecialistText: { en: 'teacher holds the Specialist category,', uz: 'o\'qituvchi Mutaxassis toifasiga ega,', ru: 'учитель имеет категорию Специалист,' },
  teacherCategorySecondText: { en: 'teachers are in the Second category,', uz: 'o\'qituvchi Ikkinchi toifada,', ru: 'учителя во Второй категории,' },
  teacherCategoryFirstText: { en: 'teachers are in the First category,', uz: 'o\'qituvchi Birinchi toifada,', ru: 'учителя в Первой категории,' },
  teacherCategoryHighestText: { en: 'teachers hold the Highest category.', uz: 'o\'qituvchi Oliy toifaga ega.', ru: 'учителя имеют Высшую категорию.' },
  teacherCategoryConclusionText: { en: 'These results clearly indicate that the school has a high proportion of experienced and highly qualified teachers. In particular, the large number of teachers with the highest qualification category significantly contributes to improving the effectiveness of the educational process and has a positive impact on students\' academic performance and achievements.', uz: 'Bu natijalar maktabda tajribali va yuqori malakali o\'qituvchilarning yuqori ulushiga ega ekanligini aniq ko\'rsatadi. Xususan, eng yuqori malaka toifasiga ega o\'qituvchilarning ko\'p soni ta\'lim jarayonining samaradorligini oshirishga sezilarli hissa qo\'shadi va o\'quvchilarning akademik ko\'rsatkichlari va yutuqlariga ijobiy ta\'sir ko\'rsatadi.', ru: 'Эти результаты ясно показывают, что в школе высокая доля опытных и высококвалифицированных учителей. В частности, большое количество учителей с высшей квалификационной категорией значительно способствует повышению эффективности образовательного процесса и положительно влияет на академические показатели и достижения учащихся.' },
  chartTooltipLabel: { en: 'Count', uz: 'Soni', ru: 'Количество' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Load language from localStorage or default to 'uz'
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'en' || saved === 'uz' || saved === 'ru')) {
      return saved as Language;
    }
    return 'uz';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
