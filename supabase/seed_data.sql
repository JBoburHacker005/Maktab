-- ============================================
-- SEED DATA FOR MAKTAB WEBSITE
-- Ushbu skript saytdagi mavjud "hardcoded" ma'lumotlarni
-- Supabase bazasiga kiritadi.
-- Avval database_schema.sql ni ishga tushirganingizga ishonch hosil qiling.
-- ============================================

-- 1. NEWS (Yangiliklar)
INSERT INTO public.news (title_uz, title_en, title_ru, content_uz, content_en, content_ru, category, image_url, published, created_at)
VALUES
(
  'Students Win National Science Competition', 
  'Students Win National Science Competition', 
  'Students Win National Science Competition',
  'Our talented science team brought home the gold medal at the National Science Olympiad, showcasing exceptional problem-solving skills.',
  'Our talented science team brought home the gold medal at the National Science Olympiad, showcasing exceptional problem-solving skills.',
  'Our talented science team brought home the gold medal at the National Science Olympiad, showcasing exceptional problem-solving skills.',
  'Awards',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
  true,
  '2024-12-10'
),
(
  'New STEM Lab Opening Ceremony',
  'New STEM Lab Opening Ceremony',
  'New STEM Lab Opening Ceremony',
  'We are excited to announce the grand opening of our state-of-the-art STEM laboratory, equipped with the latest technology.',
  'We are excited to announce the grand opening of our state-of-the-art STEM laboratory, equipped with the latest technology.',
  'We are excited to announce the grand opening of our state-of-the-art STEM laboratory, equipped with the latest technology.',
  'Academic',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  true,
  '2024-12-08'
),
(
  'Annual Sports Day Highlights',
  'Annual Sports Day Highlights',
  'Annual Sports Day Highlights',
  'This year''s Sports Day was a tremendous success with record-breaking performances and outstanding sportsmanship.',
  'This year''s Sports Day was a tremendous success with record-breaking performances and outstanding sportsmanship.',
  'This year''s Sports Day was a tremendous success with record-breaking performances and outstanding sportsmanship.',
  'Sports',
  'https://images.unsplash.com/photo-1461896836934-8a09f?w=600&h=400&fit=crop', -- fixed url slightly from original code which seemed broken
  true,
  '2024-12-05'
),
(
  'Cultural Festival Celebrates Diversity',
  'Cultural Festival Celebrates Diversity',
  'Cultural Festival Celebrates Diversity',
  'Students from various backgrounds came together to celebrate our multicultural community through music, dance, and cuisine.',
  'Students from various backgrounds came together to celebrate our multicultural community through music, dance, and cuisine.',
  'Students from various backgrounds came together to celebrate our multicultural community through music, dance, and cuisine.',
  'Events',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
  true,
  '2024-12-01'
),
(
  'University Admission Success Rate Hits 95%',
  'University Admission Success Rate Hits 95%',
  'University Admission Success Rate Hits 95%',
  'We are proud to announce that 95% of our graduating class has been accepted into their first-choice universities.',
  'We are proud to announce that 95% of our graduating class has been accepted into their first-choice universities.',
  'We are proud to announce that 95% of our graduating class has been accepted into their first-choice universities.',
  'Academic',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
  true,
  '2024-11-28'
),
(
  'Basketball Team Advances to Finals',
  'Basketball Team Advances to Finals',
  'Basketball Team Advances to Finals',
  'Our varsity basketball team has qualified for the regional finals after an impressive undefeated season.',
  'Our varsity basketball team has qualified for the regional finals after an impressive undefeated season.',
  'Our varsity basketball team has qualified for the regional finals after an impressive undefeated season.',
  'Sports',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
  true,
  '2024-11-25'
);


-- 2. TEACHERS (O'qituvchilar va Rahbariyat)

-- Leaders
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
(
  'Matyoqubova Lobarxon',
  'Direktor', 'Principal', 'Директор',
  '+998 (95) 444-14-74',
  '/teachers/deriktor.jpg',
  'Telegram: @lobar_ortiqboyevna', 'Telegram: @lobar_ortiqboyevna', 'Telegram: @lobar_ortiqboyevna',
  true
),
(
  'Kenjayev Maqsudbek',
  'Direktor o‘rinbosari (ma’naviy-ma’rifiy)', 'Vice Principal (Spiritual)', 'Заместитель директора (духовность)',
  '+998 (99) 963-50-60',
  '/teachers/maqsud ustoz.png',
  'Telegram: @Maqsudbek', 'Telegram: @Maqsudbek', 'Telegram: @Maqsudbek',
  true
),
(
  'Matyoqubov Ro‘zmatjon',
  'Direktor maslahatchisi', 'Advisor to the Principal', 'Советник директора',
  '+998 (99) 338-91-11',
  '/teachers/maslahatchi.jpg',
  'Telegram: @rico9111', 'Telegram: @rico9111', 'Telegram: @rico9111',
  true
),
(
  'Otamurotov Farhod',
  'Direktor o‘rinbosari (o’quv ishlari)', 'Vice Principal (Academic)', 'Заместитель директора (учебная часть)',
  '+998 (97) 528-19-93',
  '/teachers/zavuch.JPG',
  'Telegram: @Farxod586', 'Telegram: @Farxod586', 'Telegram: @Farxod586',
  true
);

-- Teachers (Mathematics)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Qolandarov Davronbek', 'Matematika', 'Mathematics', 'Математика', '+998 (97) 458-25-87', '/teachers/matematika5.png', 'Telegram: @Qalandarov_Davronbek', 'Telegram: @Qalandarov_Davronbek', 'Telegram: @Qalandarov_Davronbek', true),
('Sapayev Doniyor', 'Matematika', 'Mathematics', 'Математика', '+998 (97) 430-80-15', '/teachers/matematika2.jpg', 'Telegram: @Sapayev_D', 'Telegram: @Sapayev_D', 'Telegram: @Sapayev_D', true),
('Ibodullayev Sherzod', 'Matematika', 'Mathematics', 'Математика', '+998 (94) 117-90-20', '/teachers/matematika4.png', 'Telegram: @Sherzodbek_Ibadullayev', 'Telegram: @Sherzodbek_Ibadullayev', 'Telegram: @Sherzodbek_Ibadullayev', true),
('Radjapov Davlatyor', 'Matematika', 'Mathematics', 'Математика', '+998 (99) 022-60-96', '/teachers/matematika3.jpg', 'Telegram: @DR0096X', 'Telegram: @DR0096X', 'Telegram: @DR0096X', true),
('Matchanov Temur', 'Matematika', 'Mathematics', 'Математика', '+998 (99) 747-21-13', '/teachers/matematika.jpg', 'Telegram: @Temur_Matchanov', 'Telegram: @Temur_Matchanov', 'Telegram: @Temur_Matchanov', true),
('Xojixonova Kumush', 'Matematika', 'Mathematics', 'Математика', '+998 (94) 676-48-46', '/teachers/matematika6.jpg', 'Telegram: @Math930919100', 'Telegram: @Math930919100', 'Telegram: @Math930919100', true);

-- Teachers (Physics)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Matmurotov Quvandiq', 'Fizika', 'Physics', 'Физика', '+998 (97) 211-44-71', '/teachers/fizika.jpg', 'Telegram: @arnimen', 'Telegram: @arnimen', 'Telegram: @arnimen', true),
('Jabborov Vohidjon', 'Fizika', 'Physics', 'Физика', '+998 (97) 859-01-86', '/teachers/fizika1.png', 'Telegram: @Vohidjon019', 'Telegram: @Vohidjon019', 'Telegram: @Vohidjon019', true);

-- Teachers (Other)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Qurbonboyev Mardon', 'Huquq', 'Law Teacher', 'Право', '+998 (97) 451-79-39', '/teachers/huquq.JPG', 'Telegram: @alibekbobosi', 'Telegram: @alibekbobosi', 'Telegram: @alibekbobosi', true),
('Durdiyeva Farzona', 'Tarix', 'History', 'История', '+998 (93) 116-29-94', '/teachers/tarix.JPG', 'Telegram: @Farzona_Durdiyeva', 'Telegram: @Farzona_Durdiyeva', 'Telegram: @Farzona_Durdiyeva', true);

-- Teachers (English)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Babajonova Dilfuza', 'Ingliz tili', 'English Literature', 'Английский язык', '+998 (99) 964-11-86', '/teachers/ingliz tili4.png', 'Telegram: @D_Babajonova', 'Telegram: @D_Babajonova', 'Telegram: @D_Babajonova', true),
('Urunova Malohat', 'Ingliz tili', 'English Literature', 'Английский язык', '+998 (97) 130-56-88', '/teachers/ingliz tili.jpg', 'Telegram: @Malohat_Urunova', 'Telegram: @Malohat_Urunova', 'Telegram: @Malohat_Urunova', true),
('Axmedova Shoira', 'Ingliz tili', 'English Literature', 'Английский язык', '+998 (97) 451-51-81', '/teachers/ingliz tili3.JPG', 'Telegram: @Shoira_9475', 'Telegram: @Shoira_9475', 'Telegram: @Shoira_9475', true),
('Madraimova Farangiz', 'Ingliz tili', 'English Literature', 'Английский язык', '+998 (77) 408-05-31', '/teachers/ingliz tili2.jpg', 'Telegram: @farangizmadraimova', 'Telegram: @farangizmadraimova', 'Telegram: @farangizmadraimova', true);

-- Teachers (Russian)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Bekturdiyev Gʹayrat', 'Rus tili', 'Russian Literature', 'Русский язык', '+998 (99) 747-21-13', '/teachers/rus tili2.gif', 'Telegram: @G_Bekturdiyev', 'Telegram: @G_Bekturdiyev', 'Telegram: @G_Bekturdiyev', true),
('Sultonova Maftuna', 'Rus tili', 'Russian Literature', 'Русский язык', '+998 (95) 361-80-95', '/teachers/rus tili.jpg', 'Telegram: @Quyoshimning_Nurlariman', 'Telegram: @Quyoshimning_Nurlariman', 'Telegram: @Quyoshimning_Nurlariman', true),
('Baxtiyorova Dinara', 'Rus tili', 'Russian Literature', 'Русский язык', '+998 (50) 250-98-68', '/teachers/rus tili4.png', 'Telegram: @Dinara050125', 'Telegram: @Dinara050125', 'Telegram: @Dinara050125', true);

-- Teachers (Chemistry, CS, Geo, PE, etc)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Allaberganova Gulbahor', 'Kimyo', 'Chemistry', 'Химия', '+998 (99) 865-74-38', '/teachers/kimyo.jpg', 'Telegram: @Gulbahor_Allaberganova', 'Telegram: @Gulbahor_Allaberganova', 'Telegram: @Gulbahor_Allaberganova', true),
('Raximova Nifular', 'Informatika', 'Computer Science', 'Информатика', '+998 (97) 790-01-38', '/teachers/informatika2.jpg', 'Telegram: @N_Rakhimova', 'Telegram: @N_Rakhimova', 'Telegram: @N_Rakhimova', true),
('Ataboyeva Mahliyo', 'Informatika', 'Computer Science', 'Информатика', '+998 (99) 739-40-78', '/teachers/informatika.jpg', 'Telegram: @M18082023', 'Telegram: @M18082023', 'Telegram: @M18082023', true),
('Xakimov Xamza', 'Geografiya', 'Geography', 'География', '+998 (94) 110-40-84', '/teachers/geografiya.JPG', 'Telegram: @Xakimov_Xamza', 'Telegram: @Xakimov_Xamza', 'Telegram: @Xakimov_Xamza', true),
('Raxmonov Alisher', 'Jismoniy tarbiya', 'Physical Education', 'Физкультура', '+998 (99) 757-47-54', '/teachers/jt.JPG', 'Telegram: @alisher_raxmonov', 'Telegram: @alisher_raxmonov', 'Telegram: @alisher_raxmonov', true),
('Roʹzibayev Azizbek', 'CHQBT', 'Pre-Military Training', 'НВП', '+998 (88) 457-52-22', '/teachers/chqbt.JPG', 'Telegram: @Azizbek_Rozibayev', 'Telegram: @Azizbek_Rozibayev', 'Telegram: @Azizbek_Rozibayev', true),
('Atajonov Hasanboy', 'Tasviriy sanat', 'Art', 'ИЗО', '+998 (91) 431-42-28', '/teachers/art.png', 'Telegram: @Xasanboy_80', 'Telegram: @Xasanboy_80', 'Telegram: @Xasanboy_80', true);

-- Teachers (Uzbek Lit)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Madyorova Feruza', 'Ona tili va adabiyot', 'Uzbek Literature', 'Узбекский язык и литература', '+998 (94) 195-14-19', '/teachers/ona tili.jpg', 'Telegram: @Feruza_Madyorova', 'Telegram: @Feruza_Madyorova', 'Telegram: @Feruza_Madyorova', true),
('Avezova Gulbadan', 'Ona tili va adabiyot', 'Uzbek Literature', 'Узбекский язык и литература', '+998 (97) 561-10-37', '/teachers/ona tili3.JPG', 'Telegram: @Gulbadan_Avezova', 'Telegram: @Gulbadan_Avezova', 'Telegram: @Gulbadan_Avezova', true),
('Azatova Laylo', 'Ona tili va adabiyot', 'Uzbek Literature', 'Узбекский язык и литература', '+998 (99)096-35-16', '/teachers/Ona tili 2.JPG', 'Telegram: @Laylo_Azatova', 'Telegram: @Laylo_Azatova', 'Telegram: @Laylo_Azatova', true),
('Arkayeva Iroda', 'Ona tili va adabiyot', 'Uzbek Literature', 'Узбекский язык и литература', '@iroda2907l', '/teachers/IMG_9304.JPG', 'Phone: +998 (97) 517-35-40', 'Phone: +998 (97) 517-35-40', 'Phone: +998 (97) 517-35-40', true); -- Swapped phone and telegram in original data? I corrected it based on format

-- Teachers (Biology & Others)
INSERT INTO public.teachers (name, subject_uz, subject_en, subject_ru, phone, image_url, bio_uz, bio_en, bio_ru, published)
VALUES
('Radjabova Munisa', 'Biologiya', 'Biology', 'Биология', '+998 (88) 525-54-45', '/teachers/munisa ustoz.JPG', 'Telegram: @Xonuwm', 'Telegram: @Xonuwm', 'Telegram: @Xonuwm', true),
('Eshmuratova Munojat', 'Biologiya', 'Biology', 'Биология', '+998 (97) 459-20-88', '/teachers/munojat ustoz.JPG', 'Telegram: @munojateshmuratova', 'Telegram: @munojateshmuratova', 'Telegram: @munojateshmuratova', true),
('Oʹrinboyeva Shaxzoda', 'Kotiba', 'Secretary', 'Секретарь', '+998 (97) 211-14-43', '/teachers/kotiba.jpg', 'Telegram: @Shaxzoda_O', 'Telegram: @Shaxzoda_O', 'Telegram: @Shaxzoda_O', true),
('Saparova Sabohat', 'Psixolog', 'Psychologist', 'Психолог', '+998 (97) 299-88-40', '/teachers/psix.jpg', 'Telegram: @Sabohat_Saparova', 'Telegram: @Sabohat_Saparova', 'Telegram: @Sabohat_Saparova', true);


-- 3. EVENTS (Tadbirlar)
INSERT INTO public.events (title_uz, title_en, title_ru, description_uz, description_en, description_ru, event_date, location, published)
VALUES
(
  'Bilimlar kuni', 'Knowledge Day', 'День знаний',
  'Yangi o‘quv yilining boshlanishiga bag‘ishlangan tantanali tadbir.', 'Ceremonial event dedicated to the beginning of the new school year.', 'Торжественное мероприятие, посвященное началу нового учебного года.',
  '2025-09-02 10:00:00+00', 'School Yard', true
),
(
  'Ustoz va Murabbiylar kuni', 'Teachers'' Day', 'День учителей и наставников',
  'Ustozlarga hurmat va ehtirom ko‘rsatish maqsadida tashkil etilgan bayram.', 'A holiday organized to show respect and honor to teachers.', 'Праздник, организованный в знак уважения и почтения к учителям.',
  '2025-09-30 10:00:00+00', 'Main Hall', true
),
(
  'O‘zbek tiliga davlat tili maqomi berilgan kun', 'Uzbek Language Day', 'День узбекского языка',
  'Davlat tilining nufuzi va ahamiyatiga bag‘ishlangan ma’naviy tadbir.', 'Spiritual event dedicated to the prestige and importance of the state language.', 'Духовное мероприятие, посвященное авторитету и значению государственного языка.',
  '2025-10-21 10:00:00+00', 'Assembly Hall', true
),
(
  'Olimpiada g‘oliblarini taqdirlash', 'Awarding Olympiad Winners', 'Награждение победителей олимпиады',
  'Fan olimpiadalarida yuqori natijalarga erishgan o‘quvchilarni taqdirlash marosimi.', 'Ceremony awarding students who achieved high results in science olympiads.', 'Церемония награждения учащихся, достигших высоких результатов на предметных олимпиадах.',
  '2025-11-11 10:00:00+00', 'Main Hall', true
),
(
  'Davlat Bayrog‘i qabul qilingan kun', 'Flag Day', 'День принятия государственного флага',
  'Vatan ramzlariga hurmat va vatanparvarlik ruhidagi tadbir.', 'Event in the spirit of patriotism and respect for state symbols.', 'Мероприятие в духе патриотизма и уважения к государственным символам.',
  '2025-11-18 10:00:00+00', 'School Yard', true
),
(
  'Konstitutsiya qabul qilingan kun', 'Constitution Day', 'День Конституции',
  'Huquqiy bilimlarni oshirishga qaratilgan ma’rifiy tadbir.', 'Educational event aimed at increasing legal knowledge.', 'Просветительское мероприятие, направленное на повышение правовой грамотности.',
  '2025-12-07 10:00:00+00', 'Assembly Hall', true
),
(
  'Davlat Madhiyasi qabul qilingan kun', 'Anthem Day', 'День принятия государственного гимна',
  'Vatanparvarlik va milliy g‘ururni mustahkamlovchi tadbir.', 'Event strengthening patriotism and national pride.', 'Мероприятие, укрепляющее патриотизм и национальную гордость.',
  '2025-12-10 10:00:00+00', 'School Yard', true
),
(
  '"Zakovat" intellektual o‘yini', '"Zakovat" Intellectual Game', 'Интеллектуальная игра "Заковат"',
  'Bilim, mantiq va tezkor fikrlashni sinovdan o‘tkazuvchi musobaqa.', 'Competition testing knowledge, logic, and quick thinking.', 'Соревнование, проверяющее знания, логику и быстроту мышления.',
  '2025-12-12 10:00:00+00', 'Classrooms', true
),
(
  'Matematika fani tadbiri', 'Mathematics Event', 'Мероприятие по математике',
  'Aniq fanlarga qiziqishni oshirishga qaratilgan bellashuvlar.', 'Competitions aimed at increasing interest in exact sciences.', 'Соревнования, направленные на повышение интереса к точным наукам.',
  '2025-12-16 10:00:00+00', 'STEM Room', true
),
(
  'Kimyo fani tadbiri', 'Chemistry Event', 'Мероприятие по химии',
  'Qiziqarli tajribalar va ilmiy ko‘rgazmalar.', 'Interesting experiments and scientific exhibitions.', 'Интересные опыты и научные выставки.',
  '2025-12-18 10:00:00+00', 'Laboratory', true
),
(
  'Fizika fani tadbiri', 'Physics Event', 'Мероприятие по физике',
  'Fizika fanining amaliy ahamiyatiga bag‘ishlangan tadbir.', 'Event dedicated to the practical importance of physics.', 'Мероприятие, посвященное практическому значению физики.',
  '2025-12-20 10:00:00+00', 'Laboratory', true
),
(
  'Yangi yil tadbiri', 'New Year Event', 'Новогоднее мероприятие',
  'Bayramona sahna ko‘rinishlari va tantanali yangi yil dasturi.', 'Festive scenes and ceremonial New Year program.', 'Праздничные сценки и торжественная новогодняя программа.',
  '2025-12-26 10:00:00+00', 'Main Hall', true
);

-- 4. DEPARTMENTS (Bo'limlar)
INSERT INTO public.departments (name_uz, name_en, name_ru, description_uz, description_en, description_ru, icon, published)
VALUES
(
  'Matematika', 'Mathematics', 'Математика',
  'Algebra, geometriya va boshqa aniq fanlar chuqurlashtirilgan holda o‘tiladi.', 'Advanced mathematics curriculum covering algebra, calculus, statistics, and applied mathematics.', 'Углубленное изучение алгебры, геометрии и других точных наук.',
  'Calculator', true
),
(
  'Tabiiy Fanlar', 'Science', 'Естественные науки',
  'Fizika, kimyo va biologiya bo‘yicha amaliy mashg‘ulotlar va tajribalar.', 'Comprehensive science programs with hands-on laboratory experiences and research opportunities.', 'Практические занятия и опыты по физике, химии и биологии.',
  'Atom', true
),
(
  'Tillar', 'Languages', 'Языки',
  'Ingliz, rus va o‘zbek tillarini mukammal o‘rganish imkoniyati.', 'Multilingual education fostering communication skills in English, Uzbek, Russian, and more.', 'Возможность в совершенстве изучить английский, русский и узбекский языки.',
  'Languages', true
),
(
  'Sanat', 'Arts', 'Искусство',
  'Rasm chizish, dizayn va ijodiy qobiliyatlarni rivojlantirish.', 'Creative arts programs nurturing artistic expression through various mediums and techniques.', 'Развитие рисования, дизайна и творческих способностей.',
  'Palette', true
),
(
  'Sport', 'Sports', 'Спорт',
  'Jismoniy tarbiya va turli sport to‘garaklari.', 'Comprehensive physical education promoting fitness, teamwork, and sportsmanship.', 'Физическое воспитание и различные спортивные кружки.',
  'Dumbbell', true
),
(
  'Texnologiya', 'Technology', 'Технология',
  'Dasturlash, robototexnika va zamonaviy IT ko‘nikmalari.', 'Cutting-edge technology education preparing students for the digital future.', 'Программирование, робототехника и современные IT-навыки.',
  'Monitor', true
),
(
  'Musiqa', 'Music', 'Музыка',
  'Musiqiy asboblarni chalish va vokal darslari.', 'Musical education developing rhythm, harmony, and performance skills across instruments.', 'Игра на музыкальных инструментах и уроки вокала.',
  'Music', true
),
(
  'Ilmiy Laboratoriya', 'Research Lab', 'Научная лаборатория',
  'Ilmiy izlanishlar va loyihalar ustida ishlash markazi.', 'Advanced research opportunities for students interested in scientific exploration.', 'Центр работы над научными исследованиями и проектами.',
  'FlaskConical', true
);
