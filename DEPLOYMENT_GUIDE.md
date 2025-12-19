# 🚀 To'liq Deploy Qo'llanmasi

## 📋 Umumiy Ko'rinish

- **Frontend (React/Vite)** → **Vercel**
- **Backend (Express/Node.js)** → **Railway**
- **Database (Postgres)** → **Supabase**
- **Telegram Bot** → **Railway** (backend bilan birga)

---

## 1️⃣ Supabase Database Sozlash

### 1.1. Project Yaratish

1. [Supabase Dashboard](https://app.supabase.com) ga kiring
2. **New Project** tugmasini bosing
3. Project nomi va parol kiriting
4. **Create project** tugmasini bosing

### 1.2. API Keys Olish

1. **Settings** > **API** ga o'ting
2. Quyidagilarni nusxalang:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3. Migrations Ishlatish

1. **SQL Editor** ga o'ting
2. `supabase/migrations/` papkasidagi fayllarni ketma-ket ishlating
3. Yoki **Database** > **Migrations** orqali import qiling

---

## 2️⃣ Backend (Railway) Deploy

### 2.1. GitHub Repository Tayyorlash

```bash
# package.json da quyidagilar bo'lishi kerak:
{
  "scripts": {
    "start": "tsx server.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@supabase/supabase-js": "^2.87.1"
  }
}
```

### 2.2. Railway da Project Yaratish

1. [Railway Dashboard](https://railway.app) ga kiring
2. **New Project** > **Deploy from GitHub repo**
3. Repository ni tanlang
4. **Deploy** boshlanadi

### 2.3. Environment Variables Qo'shish

Railway Dashboard > Project > Variables:

```env
# Server
PORT=3000

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Frontend URL (CORS uchun)
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2.4. Railway URL Olish

Deploy tugagach:
- Railway Dashboard > Service > Settings > Domains
- **Generate Domain** yoki **Custom Domain** qo'shing
- URL: `https://your-backend.up.railway.app`

### 2.5. Telegram Webhook O'rnatish

```bash
# TOKEN o'rniga o'zingizning bot tokeningizni qo'ying
# URL o'rniga Railway URL ni qo'ying
curl -X POST "https://api.telegram.org/botTOKEN/setWebhook?url=https://your-backend.up.railway.app/api/telegram-webhook"
```

### 2.6. Tekshirish

```bash
# Health check
curl https://your-backend.up.railway.app/health

# Javob:
# {"status":"ok","timestamp":"2025-12-19T..."}
```

---

## 3️⃣ Frontend (Vercel) Deploy

### 3.1. GitHub Repository Tayyorlash

```bash
# vercel.json allaqachon sozlangan
# package.json da build script bor
```

### 3.2. Vercel da Project Yaratish

1. [Vercel Dashboard](https://vercel.com) ga kiring
2. **Add New Project**
3. GitHub repository ni tanlang
4. **Import** tugmasini bosing

### 3.3. Build Settings

Vercel avtomatik aniqlaydi:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.4. Environment Variables Qo'shish

Vercel Dashboard > Project > Settings > Environment Variables:

```env
# Supabase (Frontend uchun)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Backend API (agar kerak bo'lsa)
VITE_API_URL=https://your-backend.up.railway.app
```

**Muhim**: 
- **Environment**: Production, Preview, Development (hammasini tanlang)
- **Save** tugmasini bosing

### 3.5. Deploy

1. **Deploy** tugmasini bosing
2. Deploy tugagach, **Redeploy** qiling (env variables yangilanishi uchun)

### 3.6. Vercel URL Olish

Deploy tugagach:
- Vercel Dashboard > Project > Settings > Domains
- URL: `https://your-project.vercel.app`

---

## 4️⃣ CORS Sozlash

### 4.1. Backend (Railway)

`server.ts` da allaqachon sozlangan:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : '*',
  credentials: true,
}));
```

### 4.2. Frontend URL ni Backend ga Qo'shish

Railway Dashboard > Variables:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 5️⃣ Tekshirish

### 5.1. Frontend

1. Vercel URL ga kiring
2. Sayt ochilishi kerak
3. Supabase ulanayotganini tekshiring

### 5.2. Backend

```bash
# Health check
curl https://your-backend.up.railway.app/health

# Javob kelishi kerak:
# {"status":"ok","timestamp":"..."}
```

### 5.3. Telegram Bot

1. Telegram da bot ga `/start` yuboring
2. Javob kelishi kerak

---

## 6️⃣ Checklist ✅

### Supabase
- [ ] Project yaratilgan
- [ ] API keys olingan
- [ ] Migrations ishlatilgan
- [ ] Tables yaratilgan

### Railway (Backend)
- [ ] Project yaratilgan
- [ ] Environment variables qo'shilgan
- [ ] Deploy muvaffaqiyatli
- [ ] Health check ishlayapti
- [ ] Telegram webhook o'rnatilgan

### Vercel (Frontend)
- [ ] Project yaratilgan
- [ ] Environment variables qo'shilgan
- [ ] Deploy muvaffaqiyatli
- [ ] Sayt ochilmoqda
- [ ] Supabase ulanmoqda

### CORS
- [ ] Backend da CORS sozlangan
- [ ] Frontend URL backend ga qo'shilgan

---

## 🐛 Muammolarni Hal Qilish

### Backend ishlamayapti?

1. **Railway logs ni tekshiring**:
   - Railway Dashboard > Deployments > View Logs
   - Xatolarni ko'ring

2. **Environment variables tekshiring**:
   - Barcha kerakli variables qo'shilganini tekshiring

3. **PORT tekshiring**:
   - Railway avtomatik PORT beradi
   - `process.env.PORT` ishlatilayotganini tekshiring

### Frontend ishlamayapti?

1. **Vercel build logs ni tekshiring**:
   - Vercel Dashboard > Deployments > View Logs

2. **Environment variables tekshiring**:
   - `VITE_` bilan boshlanadigan variables borligini tekshiring

3. **Supabase ulanayotganini tekshiring**:
   - Browser Console da xatolarni ko'ring

### Telegram bot javob bermayapti?

1. **Webhook tekshiring**:
   ```bash
   curl "https://api.telegram.org/botTOKEN/getWebhookInfo"
   ```

2. **Railway logs ni tekshiring**:
   - Telegram so'rovlar kelayotganini tekshiring

3. **Bot token tekshiring**:
   - Railway da `TELEGRAM_BOT_TOKEN` to'g'ri ekanligini tekshiring

---

## 📚 Qo'shimcha Ma'lumot

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

**Muvaffaqiyatli deploy! 🎉**

