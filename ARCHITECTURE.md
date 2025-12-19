# 🏗️ Loyiha Arxitekturasi

## 📐 Umumiy Struktura

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │         │    Database     │
│   (React/Vite)   │────────▶│  (Express/Node) │────────▶│   (Supabase)    │
│                 │         │                 │         │                 │
│   VERCEL        │         │   RAILWAY       │         │   SUPABASE      │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        └────────── Telegram Bot ─────┘
                    (Railway)
```

---

## 1️⃣ Frontend → Vercel

### Texnologiyalar
- **Framework**: React + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State**: React Query + Context API
- **Database**: Supabase (client-side)

### Environment Variables (Vercel)

```env
# Supabase (Frontend to'g'ridan-to'g'ri ulanadi)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Backend API (agar kerak bo'lsa)
VITE_API_URL=https://your-backend.up.railway.app
```

### Deploy

1. **Vercel Dashboard** > New Project
2. GitHub repository ni tanlang
3. **Build Settings**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables** qo'shing
5. **Deploy**

---

## 2️⃣ Backend → Railway

### Texnologiyalar
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Features**:
  - Telegram Bot Webhook
  - REST API endpoints
  - CORS support
  - Health check

### Environment Variables (Railway)

```env
# Server
PORT=3000  # Railway avtomatik beradi

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# Supabase (Backend uchun)
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Frontend URL (CORS uchun)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Deploy

1. **Railway Dashboard** > New Project
2. **Deploy from GitHub Repo**
3. Repository ni tanlang
4. **Environment Variables** qo'shing
5. **Auto Deploy** boshlanadi

### API Endpoints

- `GET /health` - Health check
- `POST /api/telegram-webhook` - Telegram bot webhook

---

## 3️⃣ Database → Supabase

### Sozlash

1. **Supabase Dashboard** > New Project
2. **Settings** > API
3. Keys ni oling:
   - **URL**: `VITE_SUPABASE_URL`
   - **anon key**: `VITE_SUPABASE_PUBLISHABLE_KEY` (frontend)
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (backend)

---

## 🔄 Ma'lumot Oqimi

### Frontend → Database
```
React Component → Supabase Client → Supabase Database
```

### Frontend → Backend (agar kerak bo'lsa)
```
React Component → API Client → Railway Backend → Supabase Database
```

### Telegram Bot
```
Telegram → Railway Webhook → Supabase Database
```

---

## 🔐 Xavfsizlik

### CORS
- **Development**: Barcha originlarga ruxsat (`*`)
- **Production**: Faqat Vercel domain ga ruxsat

### Environment Variables
- ❌ **Hech qachon** GitHub ga commit qilmang
- ✅ **Faqat** Vercel/Railway da saqlang
- ✅ `.env` fayl `.gitignore` da bo'lishi kerak

---

## 📦 Fayl Strukturasi

```
project/
├── src/                    # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   └── api.ts          # Backend API client
│   └── integrations/
│       └── supabase/       # Supabase client
├── server.ts               # Backend (Express)
├── api/
│   └── telegram-webhook.ts # Vercel serverless (ixtiyoriy)
├── vercel.json             # Vercel config
├── railway.json            # Railway config
└── package.json
```

---

## ✅ Tekshirish Checklist

### Frontend (Vercel)
- [ ] Sayt ochilmoqda
- [ ] Supabase ulanmoqda
- [ ] Environment variables to'g'ri
- [ ] Build muvaffaqiyatli

### Backend (Railway)
- [ ] Server ishlamoqda
- [ ] `/health` endpoint ishlayapti
- [ ] Telegram bot javob bermoqda
- [ ] CORS sozlangan
- [ ] Environment variables to'g'ri

### Database (Supabase)
- [ ] Project faol
- [ ] Tables yaratilgan
- [ ] RLS policies sozlangan
- [ ] API keys to'g'ri

---

## 🐛 Troubleshooting

### Frontend xatosi?
1. ✅ Environment variables tekshiring
2. ✅ Supabase URL va key to'g'ri ekanligini tekshiring
3. ✅ Vercel build logs ni ko'ring

### Backend xatosi?
1. ✅ Railway logs ni tekshiring
2. ✅ PORT environment variable borligini tekshiring
3. ✅ CORS sozlanganini tekshiring

### Telegram bot javob bermayapti?
1. ✅ Webhook o'rnatilganini tekshiring
2. ✅ Railway URL to'g'ri ekanligini tekshiring
3. ✅ Bot token to'g'ri ekanligini tekshiring

---

**Muvaffaqiyatli deploy! 🚀**

