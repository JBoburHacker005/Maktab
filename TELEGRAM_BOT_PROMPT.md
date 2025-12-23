# 🤖 Telegram Bot - Aiogram 3.22 Integratsiyasi

## 📋 Umumiy Maqsad

Mavjud Express.js server.ts dagi Telegram bot funksiyalarini **Aiogram 3.22** framework'iga to'liq migratsiya qilish va sayt bilan to'liq integratsiya qilish. Bot va veb-sayt o'rtasida real-time, ikki tomonlama ma'lumotlar almashinuvi bo'lishi kerak.

---

## 🎯 Asosiy Talablar

### 1. **Framework va Texnologiyalar**
- ✅ **Aiogram 3.22** - asosiy framework
- ✅ **Python 3.10+** - dasturlash tili
- ✅ **Supabase Python Client** - database integratsiyasi
- ✅ **Async/Await** - asinxron operatsiyalar
- ✅ **FSM (Finite State Machine)** - foydalanuvchi holatlarini boshqarish

### 2. **Integratsiya Talablari**
- ✅ Bot va sayt **to'liq integratsiya** qilingan bo'lishi kerak
- ✅ Bot orqali qo'shilgan ma'lumotlar **darhol** saytda ko'rinishi kerak
- ✅ Saytda qo'shilgan ma'lumotlar (ixtiyoriy) bot orqali ko'rsatilishi mumkin
- ✅ **Real-time** ma'lumotlar almashinuvi

### 3. **Funksional Talablar**

#### 3.1. Yangiliklar Qo'shish
- Foydalanuvchi rasm + matn yuborsa:
  - Rasm va matn **alohida yangilik sahifasi** sifatida yaratilishi kerak
  - Avtomatik **sana** (hozirgi sana) qo'shilishi kerak
  - **Published status** = `true` bo'lishi kerak
  - **Ko'p tillilik**: Agar matn bir tilda bo'lsa, barcha tillarga (uz, en, ru) bir xil matn sifatida saqlanishi kerak
  - **URL slug** avtomatik yaratilishi kerak (title asosida)
  - Saytning `/news` bo'limida **alohida sahifa** sifatida ko'rinishi kerak

#### 3.2. Tadbirlar Qo'shish
- Foydalanuvchi rasm + matn + sana yuborsa:
  - **Event date** majburiy maydon
  - **Location** (ixtiyoriy) qo'shish imkoniyati
  - Barcha ma'lumotlar **alohida tadbir sahifasi** sifatida yaratilishi kerak
  - Saytning `/events` bo'limida ko'rinishi kerak

#### 3.3. Galereyaga Rasm Qo'shish
- Foydalanuvchi rasm yuborsa:
  - Rasm **galereya jadvaliga** qo'shilishi kerak
  - **Caption** (ixtiyoriy) qo'shish imkoniyati
  - Saytning `/gallery` bo'limida ko'rinishi kerak

#### 3.4. Ko'p Tillilik (3 til)
- **O'zbek (uz)**, **Ingliz (en)**, **Rus (ru)**
- Foydalanuvchi tilni tanlaydi
- Bot barcha xabarlarni tanlangan tilda ko'rsatadi
- Ma'lumotlar saqlanganda barcha tillarga saqlanishi kerak

#### 3.5. Foydalanuvchi Preferences
- **Til** - saqlanadi va keyingi sessiyalarda eslab qolinadi
- **Current panel** - foydalanuvchi qaysi bo'limda ekanligi
- **User state** - FSM orqali boshqariladi

---

## 🏗️ Arxitektura va Struktura

### 1. **Loyiha Strukturasi**

```
telegram-bot/
├── bot/
│   ├── __init__.py
│   ├── main.py                 # Bot entry point
│   ├── config.py              # Konfiguratsiya (env variables)
│   │
│   ├── handlers/              # Message handlers
│   │   ├── __init__.py
│   │   ├── start.py           # /start command handler
│   │   ├── news.py            # Yangiliklar handler
│   │   ├── events.py          # Tadbirlar handler
│   │   ├── gallery.py         # Galereya handler
│   │   └── language.py        # Til o'zgartirish handler
│   │
│   ├── keyboards/             # Inline va Reply keyboardlar
│   │   ├── __init__.py
│   │   ├── main_menu.py       # Asosiy menu
│   │   ├── language_menu.py  # Til tanlash menu
│   │   └── cancel_menu.py     # Bekor qilish tugmasi
│   │
│   ├── states/               # FSM States
│   │   ├── __init__.py
│   │   ├── news_state.py      # Yangiliklar holati
│   │   ├── events_state.py    # Tadbirlar holati
│   │   └── gallery_state.py   # Galereya holati
│   │
│   ├── services/              # Business logic
│   │   ├── __init__.py
│   │   ├── database.py        # Supabase integratsiyasi
│   │   ├── news_service.py    # Yangiliklar servisi
│   │   ├── events_service.py  # Tadbirlar servisi
│   │   ├── gallery_service.py # Galereya servisi
│   │   └── user_service.py    # Foydalanuvchi servisi
│   │
│   ├── utils/                 # Utility funksiyalar
│   │   ├── __init__.py
│   │   ├── text_utils.py      # Matn formatlash
│   │   ├── image_utils.py     # Rasm ishlash
│   │   └── slug_utils.py      # URL slug yaratish
│   │
│   └── middlewares/           # Middleware'lar
│       ├── __init__.py
│       ├── language_middleware.py  # Til middleware
│       └── user_middleware.py       # Foydalanuvchi middleware
│
├── .env.example               # Environment variables misoli
├── .gitignore
├── requirements.txt            # Python dependencies
├── README.md
└── docker-compose.yml          # (ixtiyoriy) Docker setup
```

### 2. **FSM States Strukturasi**

```python
# Yangiliklar uchun states
class NewsStates(StatesGroup):
    waiting_for_text = State()      # Matn kutilyapti
    waiting_for_image = State()    # Rasm kutilyapti (ixtiyoriy)
    confirming = State()           # Tasdiqlash

# Tadbirlar uchun states
class EventsStates(StatesGroup):
    waiting_for_text = State()      # Matn kutilyapti
    waiting_for_date = State()      # Sana kutilyapti
    waiting_for_location = State()  # Joylashuv (ixtiyoriy)
    waiting_for_image = State()     # Rasm (ixtiyoriy)
    confirming = State()            # Tasdiqlash

# Galereya uchun states
class GalleryStates(StatesGroup):
    waiting_for_image = State()    # Rasm kutilyapti
    waiting_for_caption = State()  # Caption (ixtiyoriy)
    confirming = State()           # Tasdiqlash
```

---

## 🔄 Ishlash Algoritmi

### 1. **Yangiliklar Qo'shish Algoritmi**

```
1. Foydalanuvchi "Yangiliklar" → "Qo'shish" ni tanlaydi
2. Bot: "Yangilik matnini yuboring:" deydi
3. Foydalanuvchi matn yuboradi
4. Bot: "Rasm yuboring (ixtiyoriy) yoki 'O'tkazib yuborish' tugmasini bosing"
5. Foydalanuvchi:
   a) Rasm yuborsa → Bot rasmni oladi
   b) "O'tkazib yuborish" bosilsa → Rasm bo'lmagan yangilik
6. Bot: "Tasdiqlash" tugmasi bilan preview ko'rsatadi
7. Foydalanuvchi tasdiqlaydi
8. Bot Supabase'ga saqlaydi:
   - title_uz, title_en, title_ru (matnning birinchi qismi yoki to'liq matn)
   - content_uz, content_en, content_ru (to'liq matn)
   - image_url (agar rasm bo'lsa)
   - published = true
   - created_at = hozirgi sana
   - slug = avtomatik yaratilgan (title asosida)
9. Bot: "✅ Yangilik muvaffaqiyatli qo'shildi!" deydi
10. Saytning /news bo'limida darhol ko'rinadi
```

### 2. **Tadbirlar Qo'shish Algoritmi**

```
1. Foydalanuvchi "Tadbirlar" → "Qo'shish" ni tanlaydi
2. Bot: "Tadbir matnini yuboring:" deydi
3. Foydalanuvchi matn yuboradi
4. Bot: "Tadbir sanasini yuboring (YYYY-MM-DD formatida):" deydi
5. Foydalanuvchi sana yuboradi (validation)
6. Bot: "Joylashuv (ixtiyoriy) yoki 'O'tkazib yuborish':" deydi
7. Foydalanuvchi joylashuv yuboradi yoki o'tkazib yuboradi
8. Bot: "Rasm yuboring (ixtiyoriy):" deydi
9. Foydalanuvchi rasm yuboradi yoki o'tkazib yuboradi
10. Bot preview ko'rsatadi va tasdiqlaydi
11. Supabase'ga saqlanadi
12. Saytning /events bo'limida ko'rinadi
```

### 3. **Galereyaga Rasm Qo'shish Algoritmi**

```
1. Foydalanuvchi "Galereya" → "Qo'shish" ni tanlaydi
2. Bot: "Rasm yuboring:" deydi
3. Foydalanuvchi rasm yuboradi
4. Bot: "Rasm uchun izoh (caption) yuboring (ixtiyoriy):" deydi
5. Foydalanuvchi caption yuboradi yoki "O'tkazib yuborish" bosadi
6. Bot tasdiqlaydi
7. Supabase'ga saqlanadi
8. Saytning /gallery bo'limida ko'rinadi
```

---

## 🔌 Supabase Integratsiyasi

### 1. **Database Jadval Strukturasi**

Loyihada quyidagi jadvallar mavjud:
- `news` - Yangiliklar
- `events` - Tadbirlar
- `gallery` - Galereya
- `telegram_user_preferences` - Foydalanuvchi sozlamalari

### 2. **Ma'lumotlar Saqlash Logikasi**

#### Yangiliklar uchun:
```python
{
    "title_uz": "Matnning birinchi qismi yoki to'liq matn",
    "title_en": "Same as title_uz",
    "title_ru": "Same as title_uz",
    "content_uz": "To'liq matn",
    "content_en": "Same as content_uz",
    "content_ru": "Same as content_uz",
    "image_url": "Telegram file URL yoki None",
    "published": True,
    "created_at": "2024-01-01T12:00:00Z",
    "slug": "avtomatik-yaratilgan-slug"  # title asosida
}
```

#### Tadbirlar uchun:
```python
{
    "title_uz": "Tadbir sarlavhasi",
    "title_en": "Same",
    "title_ru": "Same",
    "description_uz": "Tavsif",
    "description_en": "Same",
    "description_ru": "Same",
    "event_date": "2024-12-25T10:00:00Z",
    "location": "Joylashuv yoki None",
    "image_url": "URL yoki None",
    "published": True
}
```

#### Galereya uchun:
```python
{
    "title_uz": "Caption yoki bo'sh",
    "title_en": "Same",
    "title_ru": "Same",
    "image_url": "Telegram file URL",
    "published": True
}
```

### 3. **Telegram File URL Olish**

Telegram'dan rasm yuklab olish:
1. `file_id` ni olish
2. `getFile` API orqali `file_path` olish
3. `https://api.telegram.org/file/bot<token>/<file_path>` URL yaratish
4. Bu URL ni Supabase'ga saqlash

**Yoki** (yaxshiroq variant):
1. Rasmni yuklab olish
2. Supabase Storage'ga yuklash
3. Public URL olish
4. Bu URL ni saqlash

---

## 🌐 Ko'p Tillilik (i18n)

### 1. **Til Fayllari Strukturasi**

```
bot/
└── locales/
    ├── uz.json
    ├── en.json
    └── ru.json
```

### 2. **Til Fayllari Misoli**

```json
// uz.json
{
    "welcome": "Xush kelibsiz!",
    "select_language": "Tilni tanlang:",
    "main_menu": "Asosiy menu",
    "add_news": "Yangilik qo'shish",
    "add_event": "Tadbir qo'shish",
    "add_gallery": "Rasm qo'shish",
    "enter_text": "Matnni yuboring:",
    "enter_date": "Sanani yuboring (YYYY-MM-DD):",
    "success": "Muvaffaqiyatli qo'shildi!",
    "cancel": "Bekor qilish"
}
```

### 3. **Til O'zgartirish**

- Foydalanuvchi tilni tanlaganda `telegram_user_preferences` jadvaliga saqlanadi
- Keyingi sessiyalarda avtomatik yuklanadi
- Barcha xabarlar tanlangan tilda ko'rsatiladi

---

## 🎨 User Experience (UX)

### 1. **Keyboard Layout**

```
Asosiy Menu:
┌─────────────┬─────────────┐
│ 📰 Yangiliklar │ 📅 Tadbirlar │
├─────────────┼─────────────┤
│ 🖼 Galereya    │ 🌐 Til       │
└─────────────┴─────────────┘

Til Tanlash:
┌─────────┬─────────┐
│ 🇺🇿 O'zbek │ 🇬🇧 English │
├─────────┴─────────┤
│ 🇷🇺 Русский      │
└───────────────────┘

Bekor qilish:
┌───────────────────┐
│ ❌ Bekor qilish   │
└───────────────────┘
```

### 2. **Xabar Formatlari**

- **Preview** - tasdiqlashdan oldin ko'rsatish
- **Success** - muvaffaqiyatli qo'shilganda
- **Error** - xatolik yuz berganda
- **Loading** - ma'lumotlar yuklanayotganda

### 3. **Validation**

- **Sana format** - YYYY-MM-DD tekshiruvi
- **Matn uzunligi** - minimal va maksimal uzunlik
- **Rasm formati** - faqat rasm fayllari
- **Majburiy maydonlar** - to'ldirilishi shart

---

## 🔒 Xavfsizlik

### 1. **Access Control**

- Hozirgi versiyada barcha foydalanuvchilar foydalanishi mumkin
- Kelajakda admin tekshiruvi qo'shish mumkin

### 2. **Data Validation**

- Barcha kiruvchi ma'lumotlar tekshirilishi kerak
- SQL injection oldini olish
- XSS hujumlaridan himoya

### 3. **Error Handling**

- Barcha xatoliklar catch qilinishi kerak
- Foydalanuvchiga tushunarli xabar berilishi kerak
- Logging - barcha xatoliklar log qilinishi kerak

---

## 📦 Dependencies

### requirements.txt

```
aiogram==3.22.0
aiogram-dialog==23.0.0  # (ixtiyoriy) Dialog framework
supabase==2.0.0
python-dotenv==1.0.0
aiohttp==3.9.0
Pillow==10.0.0  # Rasm ishlash uchun
python-slugify==8.0.0  # URL slug yaratish
```

---

## 🚀 Deployment

### 1. **Environment Variables**

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Bot Settings
BOT_ADMIN_IDS=123456789,987654321  # (ixtiyoriy) Admin IDlar
```

### 2. **Deployment Platforms**

- **Railway** - recommended
- **Heroku** - alternative
- **VPS** - self-hosted
- **Docker** - containerized

### 3. **Running Bot**

```bash
# Development
python -m bot.main

# Production (with systemd)
# systemd service file yaratish kerak
```

---

## ✅ Bajarilishi Kerak Bo'lgan Ishlar Ro'yxati

### Phase 1: Asosiy Struktura
- [ ] Loyiha strukturasi yaratish
- [ ] requirements.txt yaratish
- [ ] .env.example yaratish
- [ ] Config fayl yaratish
- [ ] Supabase client integratsiyasi

### Phase 2: Asosiy Funksiyalar
- [ ] /start command handler
- [ ] Til tanlash funksiyasi
- [ ] Asosiy menu keyboard
- [ ] FSM states yaratish
- [ ] User preferences saqlash

### Phase 3: Yangiliklar
- [ ] Yangiliklar qo'shish handler
- [ ] Matn qabul qilish
- [ ] Rasm qabul qilish (ixtiyoriy)
- [ ] Preview ko'rsatish
- [ ] Supabase'ga saqlash
- [ ] Slug yaratish
- [ ] Validation

### Phase 4: Tadbirlar
- [ ] Tadbirlar qo'shish handler
- [ ] Matn qabul qilish
- [ ] Sana qabul qilish va validation
- [ ] Joylashuv qabul qilish (ixtiyoriy)
- [ ] Rasm qabul qilish (ixtiyoriy)
- [ ] Supabase'ga saqlash

### Phase 5: Galereya
- [ ] Galereya qo'shish handler
- [ ] Rasm qabul qilish
- [ ] Caption qabul qilish (ixtiyoriy)
- [ ] Supabase'ga saqlash

### Phase 6: Ko'p Tillilik
- [ ] Til fayllari yaratish (uz, en, ru)
- [ ] Til middleware yaratish
- [ ] Barcha xabarlarni translate qilish
- [ ] Til o'zgartirish funksiyasi

### Phase 7: UX va Validation
- [ ] Keyboard'lar yaratish
- [ ] Preview funksiyasi
- [ ] Error handling
- [ ] Success messages
- [ ] Loading indicators

### Phase 8: Testing va Deployment
- [ ] Unit testlar
- [ ] Integration testlar
- [ ] Deployment sozlash
- [ ] Documentation

---

## 🎯 Qo'shimcha Talablar

### 1. **Real-time Integratsiyasi**

Bot orqali qo'shilgan ma'lumotlar **darhol** saytda ko'rinishi kerak. Buning uchun:
- Supabase real-time subscriptions (ixtiyoriy)
- Yoki oddiy polling (sayt React Query bilan avtomatik yangilanadi)

### 2. **Image Optimization**

- Rasm hajmini optimallashtirish
- Thumbnail yaratish
- Format konvertatsiyasi (JPEG, WebP)

### 3. **Notification System**

- Yangilik qo'shilganda adminlarga bildirishnoma (ixtiyoriy)
- Xatolik yuz berganda adminlarga xabar (ixtiyoriy)

### 4. **Analytics**

- Qo'shilgan yangiliklar soni
- Foydalanuvchilar statistikasi
- Faollik ko'rsatkichlari

---

## 📝 Kod Sifat Standartlari

### 1. **Code Style**
- **PEP 8** - Python kod stiliga rioya qilish
- **Type hints** - barcha funksiyalarda type annotation
- **Docstrings** - barcha funksiyalar va klasslar uchun

### 2. **Error Handling**
- Try-except bloklarida barcha xatoliklar catch qilinishi
- Tushunarli error messages
- Logging - barcha xatoliklar log qilinishi

### 3. **Code Organization**
- Har bir modul o'z vazifasini bajarishi
- DRY prinsipi - kod takrorlanmasligi
- SOLID prinsiplariga rioya qilish

---

## 🔍 Testing Strategiyasi

### 1. **Unit Tests**
- Har bir service funksiyasi uchun
- Har bir utility funksiyasi uchun

### 2. **Integration Tests**
- Supabase integratsiyasi
- Telegram API integratsiyasi
- End-to-end testlar

### 3. **Manual Testing**
- Barcha funksiyalarni qo'lda tekshirish
- Turli xil scenario'larni test qilish

---

## 📚 Documentation

### 1. **README.md**
- Loyiha haqida umumiy ma'lumot
- O'rnatish ko'rsatmalari
- Environment variables
- Ishlatish misollari

### 2. **Code Comments**
- Murakkab logikalar uchun izohlar
- API endpoints uchun docstrings
- Configuration parametrlar uchun izohlar

---

## 🎓 Xulosa

Bu prompt **to'liq va batafsil** reja bo'lib, Aiogram 3.22 da Telegram bot yaratish uchun barcha zarur ma'lumotlarni o'z ichiga oladi. Har bir bo'lim aniq va tushunarli tarzda yozilgan, barcha talablar va xususiyatlar batafsil tushuntirilgan.

**Asosiy maqsad**: Bot va sayt o'rtasida **to'liq integratsiya**, **real-time** ma'lumotlar almashinuvi va **sifatli user experience**.

---

## ⚠️ Muhim Eslatmalar

1. **Supabase Service Role Key** - faqat backend'da ishlatilishi kerak, hech qachon frontend'ga o'tkazilmasligi kerak
2. **Telegram Bot Token** - xavfsiz saqlanishi kerak, .env faylida
3. **Error Handling** - barcha xatoliklar to'g'ri handle qilinishi kerak
4. **Validation** - barcha kiruvchi ma'lumotlar tekshirilishi kerak
5. **Testing** - production'ga chiqarishdan oldin to'liq test qilinishi kerak

---

**Yaratilgan sana**: 2024-12-17  
**Versiya**: 1.0  
**Muallif**: AI Assistant  
**Loyiha**: Maktab Telegram Bot

