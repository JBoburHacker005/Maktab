# Environment Variables Template

Quyidagi environment variables larni `.env` faylida yoki deployment platform (Vercel/Railway) da sozlang:

## 📝 .env Fayl Yaratish

Lokal development uchun `.env` fayl yarating (`.env.example` dan nusxa oling):

```bash
# .env fayl yaratish
cp .env.example .env
```

Keyin `.env` faylga quyidagilarni qo'shing:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Port (Railway uchun, Vercel uchun kerak emas)
PORT=3000
```

---

## 🔐 Environment Variables Qanday Olish

### 1. Telegram Bot Token

1. Telegram da [@BotFather](https://t.me/botfather) ga kiring
2. `/newbot` yuboring
3. Bot nomi va username ni kiriting
4. Bot Father sizga token beradi

**Misol**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

---

### 2. Supabase URL va Keys

1. [Supabase Dashboard](https://app.supabase.com) ga kiring
2. Project ni tanlang
3. **Settings** > **API** ga o'ting
4. Quyidagilarni ko'rasiz:

   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

**Muhim**: `service_role` key ni faqat server-side ishlating! Client-side da ishlatmang!

---

## 🚀 Deployment Platform larda Qo'shish

### Vercel

1. Project Settings > **Environment Variables**
2. Har birini alohida qo'shing
3. **Environment**: Production, Preview, Development (hammasini tanlang)
4. **Save**

### Railway

1. Project > **Variables** tab
2. Har birini alohida qo'shing
3. **Save**

---

## ⚠️ Xavfsizlik Eslatmalari

1. ❌ **Hech qachon** `.env` faylini GitHub ga commit qilmang!
2. ✅ `.env` fayl `.gitignore` da bo'lishi kerak
3. ✅ Token va key larni hech kimga yubormang
4. ✅ Agar token oshkor bo'lsa, darhol yangilang

---

## ✅ Tekshirish

Environment variables to'g'ri qo'shilganini tekshirish:

### Lokal (Node.js)
```bash
node -e "console.log(process.env.TELEGRAM_BOT_TOKEN)"
```

### Lokal (Vite)
```bash
# .env fayl mavjudligini tekshiring
cat .env
```

---

**Muvaffaqiyatli sozlash! 🎉**

