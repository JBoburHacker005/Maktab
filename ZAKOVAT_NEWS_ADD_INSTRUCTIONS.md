# ZAKOVAT Yangiligini Qo'shish

ZAKOVAT yangiligi tayyorlandi va rasm `public/zakovat.png` papkasiga ko'chirildi.

## Qo'shish usullari:

### 1-usul: Supabase SQL Editor orqali (Eng oson)

1. Supabase Dashboard'ga kiring
2. SQL Editor'ga o'ting
3. `scripts/add_zakovat_news.sql` faylini oching
4. SQL kodni nusxalab, SQL Editor'ga yopishtiring
5. "Run" tugmasini bosing

### 2-usul: Admin Panel orqali

1. Saytga kiring va admin panelga kirish
2. `/admin/news` sahifasiga o'ting
3. "Yangilik qo'shish" tugmasini bosing
4. Quyidagi ma'lumotlarni kiriting:

**Sarlavha (UZ):**
```
⚡️ "ZAKOVAT" intellektual oʻyini
```

**Sarlavha (RU):**
```
⚡️ Интеллектуальная игра "ЗАКОВАТ"
```

**Sarlavha (EN):**
```
⚡️ "ZAKOVAT" Intellectual Game
```

**Matn (UZ):**
```
⚡️ Ixtisoslashtirilgan taʼlim muassasalari agentligi tizimidagi Tuproqqalʼa tuman ixtisoslashtirilgan maktabida oʻqituvchilar ishtirokida oʻtkazilgan "ZAKOVAT" intellektual oʻyinidan lavhalar.

✨ Pedagoglar 4 kishilik 4 ta jamoaga boʻlingan holda ishtirok etishdi. Natijalar yakuniga koʻra INTELLEKT jamoasi gʻoliblikni qoʻlga kiritdi.

🎯Intellekt jamoasi tarkibi:

1. Bekturdiyev Gʻayrat (rus tili fani)

2. Radjapova Munisa (biologiya fani)

3. Saparova Saboxat (psixolog)

4. Axmedova Shoira (ingliz tili fani)
```

**Matn (RU):**
```
⚡️ Кадры интеллектуальной игры "ЗАКОВАТ", проведенной среди учителей специализированной школы Тупроққалъа района в системе Агентства специализированных образовательных учреждений.

✨ Педагоги участвовали, разделившись на 4 команды по 4 человека. По итогам результатов команда ИНТЕЛЛЕКТ завоевала победу.

🎯 Состав команды Интеллект:

1. Бектурдиев Гайрат (русский язык)

2. Раджапова Муниса (биология)

3. Сапарова Сабохат (психолог)

4. Ахмедова Шойра (английский язык)
```

**Matn (EN):**
```
⚡️ Scenes from the "ZAKOVAT" intellectual game held among teachers at the Tuproqqal'a District Specialized School in the system of the Agency for Specialized Educational Institutions.

✨ Teachers participated by dividing into 4 teams of 4 people each. According to the final results, the INTELLEKT team won the victory.

🎯 Intellekt team composition:

1. Bekturdiyev Gʻayrat (Russian language)

2. Radjapova Munisa (Biology)

3. Saparova Saboxat (Psychologist)

4. Axmedova Shoira (English language)
```

**Kategoriya:** `Events`

**Rasm URL:** `/zakovat.png`

5. "Saqlash" tugmasini bosing

### 3-usul: Node.js skript orqali

Agar Node.js o'rnatilgan bo'lsa:

```bash
node scripts/add_zakovat_news.js
```

Yoki:

```bash
npm run add-zakovat
```

## Eslatma

Rasm allaqachon `public/zakovat.png` papkasiga ko'chirilgan. Agar rasm ko'rinmasa, saytni yangilang (F5) yoki cache'ni tozalang.

