# 🎯 MAKTAB ADMIN PANEL — TO'LIQ CRUD FUNKSIONALLIGI

## Claude Opus 4.6 uchun mukammal prompt

> **Maqsad:** Maktab loyihasining admin panelida News, Gallery, Events (va boshqa bo'limlar) uchun to'liq CRUD (Create, Read, Update, Delete) operatsiyalarini ishga tushirish — admin istalgan bo'limga yangi ma'lumot qo'sha olsin, tahrirlashi, o'chirishi va ko'rishi mumkin bo'lsin.

---

## 📋 TODO — Bajarilishi kerak bo'lgan ishlar

### 1. BACKEND (Express.js + JSON file storage)

- [ ] **1.1** `backend/models/db.js` — `readData`, `addItem`, `updateItem`, `deleteItem`, `findById`, `clearAll` metodlarini tekshir va har bir controller uchun to'g'ri ishlashiga ishonch hosil qil
- [ ] **1.2** `backend/controllers/newsController.js` — News uchun CRUD: `getAll`, `getById`, `create`, `update`, `remove`, `clearAll` — mavjud, lekin image upload integratsiyasini tekshir
- [ ] **1.3** `backend/controllers/eventsController.js` — Events uchun CRUD: `getAll`, `getById`, `create`, `update`, `remove`, `clearAll`
- [ ] **1.4** `backend/controllers/galleryController.js` — Gallery uchun CRUD: `getAll`, `getById`, `create`, `update`, `remove`, `clearAll` + bir nechta rasm yuklash imkoniyati
- [ ] **1.5** `backend/controllers/teachersController.js` — Teachers uchun CRUD
- [ ] **1.6** `backend/controllers/departmentsController.js` — Departments uchun CRUD
- [ ] **1.7** `backend/controllers/uploadController.js` — Rasmlarni serverga yuklash (multer yoki base64)
- [ ] **1.8** `backend/routes/` — Har bir controller uchun routelarni to'liq bo'lishiga ishonch hosil qil (GET, GET/:id, POST, PUT/:id, DELETE/:id, DELETE/)
- [ ] **1.9** `backend/middleware/` — Auth middleware JWT token bilan himoyalash

### 2. FRONTEND — Admin Panel Sahifalari (React + TypeScript + Shadcn/UI)

- [ ] **2.1** `src/lib/api.ts` — API client: har bir bo'lim uchun `getAll`, `getById`, `create`, `update`, `delete`, `clearAll` metodlarini yoz
- [ ] **2.2** `src/pages/admin/NewsAdmin.tsx` — Yangiliklar boshqaruvi:
  - [ ] Yangilik qo'shish formasi (title_uz, title_ru, title_en, content_uz, content_ru, content_en, category, image_url, published)
  - [ ] Yangiliklar ro'yxati (card ko'rinishida)
  - [ ] Tahrirlash (Dialog ichida forma, mavjud ma'lumotlar bilan to'ldirilgan)
  - [ ] O'chirish (AlertDialog bilan tasdiqlash)
  - [ ] Published toggle (Switch bilan)
  - [ ] Rasm yuklash integratsiyasi
- [ ] **2.3** `src/pages/admin/EventsAdmin.tsx` — Tadbirlar boshqaruvi:
  - [ ] Tadbir qo'shish formasi (title_uz/ru/en, description_uz/ru/en, location, event_date, event_time, image_url, category, published)
  - [ ] Tadbirlar ro'yxati
  - [ ] Tahrirlash va o'chirish
  - [ ] Sana va vaqt tanlash (date picker)
- [ ] **2.4** `src/pages/admin/GalleryAdmin.tsx` — Galereya boshqaruvi:
  - [ ] Rasm qo'shish formasi (title_uz/ru/en, image_url, category, published)
  - [ ] Rasmlar gridi
  - [ ] Bir nechta rasm bir vaqtda yuklash
  - [ ] Rasmlarni o'chirish
- [ ] **2.5** `src/pages/admin/TeachersAdmin.tsx` — O'qituvchilar boshqaruvi:
  - [ ] O'qituvchi qo'shish (name_uz/ru/en, position_uz/ru/en, subject, email, phone, image_url, published)
  - [ ] Ro'yxat va tahrirlash
- [ ] **2.6** `src/pages/admin/DepartmentsAdmin.tsx` — Bo'limlar boshqaruvi
- [ ] **2.7** `src/pages/admin/Dashboard.tsx` — Statistika: har bir bo'limda nechta element borligi

### 3. RASMLARNI YUKLASH TIZIMI

- [ ] **3.1** Backend: `POST /api/upload` — multer yoki base64 formatda rasmni qabul qilish
- [ ] **3.2** Rasmlarni `public/uploads/` papkasiga saqlash
- [ ] **3.3** Frontend: Rasm yuklash komponenti (drag & drop yoki file input)
- [ ] **3.4** Yuklangan rasmning URL'ini avtomatik formaga qo'yish

### 4. VALIDATSIYA VA XAVFSIZLIK

- [ ] **4.1** Backend: Har bir CRUD endpointda input validatsiyasi
- [ ] **4.2** Frontend: Forma validatsiyasi (required maydonlar)
- [ ] **4.3** JWT token bilan himoyalangan admin routelar
- [ ] **4.4** CORS sozlamalari to'g'ri bo'lishi

### 5. UI/UX YAXSHILASHLAR

- [ ] **5.1** Loading spinnerlar (Loader2 icon)
- [ ] **5.2** Toast xabarlari (muvaffaqiyat/xatolik)
- [ ] **5.3** Tasdiqlash dialoglari (o'chirishdan oldin)
- [ ] **5.4** Responsive dizayn (mobil qurilmalar uchun)
- [ ] **5.5** Ko'p tilli interfeys (O'zbek, Rus, Ingliz)

---

## 🔧 LOYIHA TEXNOLOGIYALARI VA TUZILISHI

### Tech Stack
```
Frontend:  React 18 + TypeScript + Vite 5
Styling:   TailwindCSS 3 + Shadcn/UI + Radix UI
State:     @tanstack/react-query v5
Routing:   react-router-dom v6
Icons:     lucide-react
Animation: framer-motion
Toasts:    sonner + Shadcn toast
Backend:   Express.js 4 (ESM modules)
Auth:      jsonwebtoken (JWT)
Storage:   JSON fayllar (backend/data/*.json)
Deploy:    Railway / Vercel
```

### Loyiha strukturasi
```
Maktab/
├── backend/
│   ├── server.js              # Express server (ESM, port from config)
│   ├── config/config.js       # Environment configuration
│   ├── controllers/
│   │   ├── newsController.js      # News CRUD
│   │   ├── eventsController.js    # Events CRUD
│   │   ├── galleryController.js   # Gallery CRUD
│   │   ├── teachersController.js  # Teachers CRUD
│   │   ├── departmentsController.js
│   │   ├── settingsController.js
│   │   ├── authController.js      # Login/logout
│   │   └── uploadController.js    # File upload
│   ├── routes/
│   │   ├── news.js, events.js, gallery.js, teachers.js
│   │   ├── departments.js, settings.js, auth.js, upload.js
│   ├── middleware/                 # Auth middleware
│   ├── models/db.js               # JSON file read/write helper
│   └── data/
│       ├── news.json              # Yangiliklar
│       ├── events.json            # Tadbirlar
│       ├── gallery.json           # Galereya rasmlari
│       ├── teachers.json          # O'qituvchilar
│       ├── departments.json       # Bo'limlar
│       ├── settings.json          # Sozlamalar
│       └── admins.json            # Admin foydalanuvchilar
├── src/
│   ├── pages/
│   │   ├── News.tsx, Events.tsx, Gallery.tsx, Teachers.tsx  # Public sahifalar
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── NewsAdmin.tsx
│   │       ├── EventsAdmin.tsx
│   │       ├── GalleryAdmin.tsx
│   │       ├── TeachersAdmin.tsx
│   │       ├── DepartmentsAdmin.tsx
│   │       ├── SettingsAdmin.tsx
│   │       ├── AddNewsButton.tsx
│   │       └── AddGalleryImages.tsx
│   ├── lib/api.ts                 # API client functions
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Auth state
│   │   └── LanguageContext.tsx     # i18n (uz/ru/en)
│   └── components/
│       ├── ui/                    # Shadcn UI components
│       └── admin/AdminLayout.tsx   # Admin layout wrapper
└── public/uploads/                 # Yuklangan rasmlar
```

---

## 📊 DATA MODELLARI (JSON Strukturalari)

### News (Yangiliklar)
```json
{
  "id": "uuid-string",
  "title_uz": "O'zbek tilidagi sarlavha",
  "title_ru": "Заголовок на русском",
  "title_en": "English title",
  "content_uz": "O'zbek tilidagi mazmun",
  "content_ru": "Содержание на русском",
  "content_en": "English content",
  "category": "Academic | Sports | Events | Awards | Chemistry",
  "image_url": "/maktab/rasm.jpg yoki /uploads/news_xxx.jpg",
  "published": true,
  "created_at": "2025-12-12T16:00:00.000Z",
  "updated_at": "2025-12-12T16:00:00.000Z"
}
```

### Events (Tadbirlar)
```json
{
  "id": "uuid-string",
  "title_uz": "...",
  "title_ru": "...",
  "title_en": "...",
  "description_uz": "...",
  "description_ru": "...",
  "description_en": "...",
  "location": "School Yard | Main Hall | Assembly Hall | Classrooms | STEM Room | Laboratory",
  "event_date": "2025-09-02",
  "event_time": "10:00 AM",
  "image_url": null,
  "category": "Cultural | Academic",
  "published": true,
  "created_at": "...",
  "updated_at": "..."
}
```

### Gallery (Galereya)
```json
{
  "id": "uuid-string",
  "title_uz": "...",
  "title_ru": "...",
  "title_en": "...",
  "image_url": "/png/a.png yoki /maktab/photo_xxx.jpg",
  "category": "general",
  "published": true,
  "created_at": "...",
  "updated_at": "..."
}
```

### Teachers (O'qituvchilar)
```json
{
  "id": "uuid-string",
  "name_uz": "...",
  "name_ru": "...",
  "name_en": "...",
  "position_uz": "...",
  "position_ru": "...",
  "position_en": "...",
  "subject": "...",
  "email": "...",
  "phone": "...",
  "image_url": "...",
  "published": true,
  "created_at": "...",
  "updated_at": "..."
}
```

---

## 🎯 ANIQ PROMPT — CLAUDE OPUS 4.6 UCHUN

```
Sen tajribali full-stack dasturchisan. Mening "Maktab" loyihamda admin panel mavjud.
Loyiha: React 18 + TypeScript + Vite + TailwindCSS + Shadcn/UI (frontend) va Express.js + JSON file storage (backend).

VAZIFA: Admin panelning har bir bo'limida (News, Gallery, Events, Teachers, Departments) to'liq
CRUD funksionalligini ishga tushir. Admin istalgan bo'limga yangi ma'lumot qo'sha olsin, 
tahrirlashi, o'chirishi va ko'rishi mumkin bo'lsin.

MUHIM SHARTLAR:

1. BACKEND (backend/ papkasi):
   - Har bir controller (newsController.js, eventsController.js, galleryController.js, 
     teachersController.js, departmentsController.js) da quyidagi metodlar bo'lsin:
     * getAll — barcha elementlarni olish (published filter bilan)
     * getById — bitta elementni ID bo'yicha olish
     * create — yangi element qo'shish (barcha 3 tilda: uz, ru, en)
     * update — elementni tahrirlash
     * remove — elementni o'chirish
     * clearAll — barcha elementlarni o'chirish
   - Har bir route faylida (routes/*.js) GET, GET/:id, POST, PUT/:id, DELETE/:id, DELETE/ endpointlari bo'lsin
   - Ma'lumotlar backend/data/*.json fayllarida saqlansin (db.js helper orqali)
   - Rasmlarni yuklash: POST /api/upload endpoint, rasmlar public/uploads/ ga saqlansin

2. FRONTEND (src/ papkasi):
   - src/lib/api.ts da har bir bo'lim uchun API client funksiyalari:
     * newsApi: { getAll, getById, create, update, delete, clearAll }
     * eventsApi: { getAll, getById, create, update, delete, clearAll }
     * galleryApi: { getAll, getById, create, update, delete, clearAll }
     * teachersApi: { getAll, getById, create, update, delete, clearAll }
     * departmentsApi: { getAll, getById, create, update, delete, clearAll }
   
   - Har bir admin sahifasida (src/pages/admin/):
     * "Qo'shish" tugmasi — Dialog ochiladi, forma maydonlari:
       - 3 tilda sarlavha (title_uz, title_ru, title_en) — Input
       - 3 tilda mazmun (content_uz/description_uz, content_ru, content_en) — Textarea
       - Kategoriya — Input yoki Select
       - Rasm URL yoki rasm yuklash — Input + upload button
       - Published toggle — Switch
     * Elementlar ro'yxati — Card grid (responsive: 1/2/3 ustun)
     * Har bir cardda:
       - Rasm (agar bor bo'lsa)
       - Sarlavha (current language bo'yicha)
       - Sana
       - Tahrirlash tugmasi (Pencil icon) — Dialog ochiladi, mavjud ma'lumotlar bilan
       - O'chirish tugmasi (Trash2 icon) — AlertDialog bilan tasdiqlash
       - Published toggle (Eye/EyeOff icon)
     * @tanstack/react-query ishlatilsin (useQuery, useMutation, queryClient.invalidateQueries)
     * useToast() bilan xabar berish (muvaffaqiyat/xatolik)
     * useLanguage() context bilan ko'p tilli UI

3. RASM YUKLASH TIZIMI:
   - Admin formada rasm URL kiritish yoki fayl yuklash imkoniyati
   - Agar fayl yuklansa — avval POST /api/upload ga yuborilsin
   - Upload natijasidan qaytgan URL ni image_url ga qo'yilsin
   - Gallery bo'limida bir nechta rasm bir vaqtda yuklash imkoniyati

4. UI KOMPONENTLARI (Shadcn/UI):
   - Dialog — qo'shish/tahrirlash formasi
   - AlertDialog — o'chirishni tasdiqlash
   - Button, Input, Label, Textarea, Switch — forma elementlari
   - Card, CardContent, CardHeader, CardTitle — elementlar ko'rinishi
   - Loader2 — yuklanish animatsiyasi
   - Plus, Pencil, Trash2, Eye, EyeOff — ikonlar (lucide-react)

5. MAVJUD PATTERN:
   - NewsAdmin.tsx dagi pattern — asos sifatida ishlat
   - Har bir admin sahifa AdminLayout ichida bo'lsin
   - Formalar 3 tilda maydonlarga ega
   - Saqlashda saveMutation, o'chirishda deleteMutation ishlatilsin
   - queryKey lar: ['admin-news'], ['admin-events'], ['admin-gallery'], etc.

6. XAVFSIZLIK:
   - Barcha admin API endpointlar JWT middleware bilan himoyalangan
   - Login sahifasi orqali admin kirishi

QOIDALAR:
- Mavjud fayllarni o'zgartirmasdan, faqat kerakli joylarni to'ldir
- Agar funksionallik allaqachon mavjud bo'lsa — tekshir va agar buglar bo'lsa tuzat
- Barcha to'ldirilgan formalar validatsiya qilinsin
- Responsive dizayn saqlansin
- TypeScript tiplar to'g'ri bo'lsin
- ESM import/export ishlatilsin (backend)
- Console.log xatoliklarni yozsin

YO'RIQNOMA:
1. Avval backend controllerlarni tekshir va to'ldir
2. Keyin routelarni tekshir
3. Frontend API client (api.ts) ni tekshir va to'ldir
4. Admin sahifalarni birma-bir tekshir va to'ldir
5. Rasm yuklash tizimini integratsiya qil
6. Hammasi ishlashini tekshir
```

---

## ✅ TEKSHIRISH REJASI

Har bir bo'lim uchun quyidagilarni tekshir:

| Bo'lim | Qo'shish | Ko'rish | Tahrirlash | O'chirish | Rasm yuklash | Published toggle |
|--------|----------|---------|-----------|----------|-------------|-----------------|
| News | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Events | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Gallery | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Teachers | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Departments | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### Tekshirish qadamlari:
1. `npm run dev` bilan serverni ishga tushir
2. Admin logindan kir
3. Har bir bo'limga o'tib:
   - "Qo'shish" tugmasini bos → forma to'ldir → saqlash
   - Yangi element ro'yxatda ko'rinishini tekshir
   - "Tahrirlash" tugmasini bos → ma'lumotlar to'g'ri yuklanganini tekshir → o'zgartir → saqlash
   - "O'chirish" tugmasini bos → tasdiqlash → o'chirilganini tekshir
   - Published toggle ni bos → holatni tekshir
   - Public sahifada (frontend) ma'lumotlar ko'rinishini tekshir

---

## 📌 ESLATMALAR

- **JSON storage:** Ma'lumotlar `backend/data/` papkasidagi JSON fayllarida saqlanadi. PostgreSQL yoki boshqa DB ishlatilmaydi.
- **3 til:** Barcha matnli maydonlar 3 tilda (O'zbek, Rus, Ingliz) kiritiladi.
- **UUID:** Har bir element uchun `crypto.randomUUID()` yoki shunga o'xshash UUID generatsiya qilinadi.
- **Image path:** Rasmlar yo'li `/maktab/...`, `/png/...`, `/uploads/...` formatlarida bo'lishi mumkin.
- **ESM:** Backend `"type": "module"` rejimida ishlaydi — `import/export` ishlatiladi.
