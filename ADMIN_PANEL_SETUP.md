# Admin Panel Sozlash va Ishlatish

## Tez Start

Admin panelni ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1. Dependencies o'rnatish
```bash
npm install
```

### 2. Development serverni ishga tushirish
```bash
npm run dev
```

Bu komanda:
- Frontend'ni `http://localhost:8080` da ishga tushiradi
- Backend'ni `http://localhost:5000` da ishga tushiradi

### 3. Admin panelga kirish

1. Brauzerda `http://localhost:8080/auth` ga kiring
2. Quyidagi ma'lumotlar bilan kirish:
   - **Login**: `Bobur`
   - **Parol**: `boburbek`

3. Kirishdan keyin avtomatik ravishda `/admin` sahifasiga yo'naltirilasiz

## Admin Panel Funksiyalari

Admin panel quyidagi bo'limlarni o'z ichiga oladi:

- **Dashboard** (`/admin`) - Asosiy statistika va tezkor amallar
- **Yangiliklar** (`/admin/news`) - Yangiliklarni boshqarish
- **Tadbirlar** (`/admin/events`) - Tadbirlarni boshqarish
- **Galereya** (`/admin/gallery`) - Galereya rasmlarini boshqarish
- **O'qituvchilar** (`/admin/teachers`) - O'qituvchilarni boshqarish
- **Bo'limlar** (`/admin/departments`) - Bo'limlarni boshqarish
- **Sozlamalar** (`/admin/settings`) - Umumiy sozlamalar

## Backend API Endpoints

Backend server quyidagi API endpoint'larni taqdim etadi:

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Joriy foydalanuvchi ma'lumotlari
- `POST /api/auth/logout` - Logout
- `GET /api/news` - Barcha yangiliklar
- `POST /api/news` - Yangi yangilik qo'shish
- `PUT /api/news/:id` - Yangilikni yangilash
- `DELETE /api/news/:id` - Yangilikni o'chirish
- `GET /api/events` - Barcha tadbirlar
- `GET /api/gallery` - Barcha galereya rasmlari
- `GET /api/teachers` - Barcha o'qituvchilar
- `GET /api/departments` - Barcha bo'limlar
- `GET /api/settings` - Sozlamalar
- `POST /api/upload` - Rasm yuklash

## Muhim Eslatmalar

1. **CORS**: Backend development rejimida barcha origin'lardan so'rovlarni qabul qiladi
2. **Proxy**: Vite config'da `/api` so'rovlari avtomatik ravishda `http://localhost:5000` ga proxy qilinadi
3. **Token**: Login qilgandan keyin token `localStorage` da `admin_token` nomi bilan saqlanadi
4. **Default Admin**: Default admin ma'lumotlari `backend/config/config.js` da sozlangan

## Muammolarni Hal Qilish

### Backend ishlamayapti
- Port 5000 band bo'lishi mumkin. `.env` faylida `PORT` ni o'zgartiring
- `npm run dev:backend` bilan backend'ni alohida ishga tushiring

### Frontend ishlamayapti
- Port 8080 band bo'lishi mumkin. `vite.config.ts` da portni o'zgartiring
- `npm run dev:frontend` bilan frontend'ni alohida ishga tushiring

### Login ishlamayapti
- Backend server ishlab turganini tekshiring: `http://localhost:5000/health`
- Browser console'da xatolarni tekshiring
- Network tab'da API so'rovlarini tekshiring

### CORS xatosi
- Backend `server.js` da CORS sozlamalarini tekshiring
- Frontend URL'ni `allowedOrigins` ro'yxatiga qo'shing

## Production Deployment

Production'da quyidagilarni sozlang:

1. `.env` faylida:
   - `NODE_ENV=production`
   - `JWT_SECRET` - kuchli secret key
   - `FRONTEND_URL` - production frontend URL'i

2. Backend CORS'ni faqat production URL'larni qabul qilish uchun sozlang

3. Frontend build qiling: `npm run build`

4. Backend server production rejimida ishga tushiriladi va `dist` papkasidan static fayllarni serve qiladi

