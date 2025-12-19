# 🚀 Deploy Qo'llanmasi - Vercel va Railway

Bu loyiha **Vercel** (frontend + Telegram bot webhook) va **Railway** (Telegram bot server) da deploy qilinishi mumkin.

---

## 📋 Kerakli Environment Variables

Quyidagi environment variables larni sozlang:

### Telegram Bot
- `TELEGRAM_BOT_TOKEN` - Bot Father dan olgan token

### Supabase
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (admin)

### Server (Railway uchun)
- `PORT` - Server port (Railway avtomatik belgilaydi, lekin 3000 default)

---

## 🌐 Vercel Deployment (Frontend + Telegram Bot Webhook)

### 1. Vercel Account ochish
1. [Vercel.com](https://vercel.com) ga kiring
2. GitHub/GitLab/Bitbucket bilan login qiling

### 2. Project Import
1. Vercel Dashboard > **Add New Project**
2. GitHub repository ni tanlang
3. **Import** tugmasini bosing

### 3. Build Settings
Vercel avtomatik aniqlaydi:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Environment Variables Qo'shish
1. Project Settings > **Environment Variables**
2. Quyidagilarni qo'shing:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. **Environment**: Production, Preview, Development (hammasini tanlang)
4. **Save** tugmasini bosing

### 5. Deploy
1. **Deploy** tugmasini bosing
2. Deploy tugagach, **Redeploy** qiling (env variables yangilanishi uchun)

### 6. Telegram Webhook O'rnatish
Deploy tugagach, webhook URL ni o'rnating:

```bash
# TOKEN o'rniga o'zingizning bot tokeningizni qo'ying
# URL o'rniga Vercel deployment URL ni qo'ying
curl -X POST "https://api.telegram.org/botTOKEN/setWebhook?url=https://your-project.vercel.app/api/telegram-webhook"
```

Yoki brauzerda:
```
https://api.telegram.org/botTOKEN/setWebhook?url=https://your-project.vercel.app/api/telegram-webhook
```

### 7. Webhook Tekshirish
```bash
curl "https://api.telegram.org/botTOKEN/getWebhookInfo"
```

---

## 🚂 Railway Deployment (Telegram Bot Server)

### 1. Railway Account ochish
1. [Railway.app](https://railway.app) ga kiring
2. GitHub bilan login qiling

### 2. New Project
1. Dashboard > **New Project**
2. **Deploy from GitHub repo** ni tanlang
3. Repository ni tanlang

### 3. Environment Variables
1. Project > **Variables** tab
2. Quyidagilarni qo'shing:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
```

### 4. Build Settings
Railway avtomatik aniqlaydi:
- **Build Command**: `npm run build` (package.json dan)
- **Start Command**: `node server.ts` (Procfile dan)

### 5. Deploy
Railway avtomatik deploy qiladi. Logs ni ko'rish uchun **View Logs** tugmasini bosing.

### 6. Telegram Webhook O'rnatish
Deploy tugagach, Railway sizga URL beradi (masalan: `https://your-project.railway.app`)

Webhook ni o'rnating:
```bash
curl -X POST "https://api.telegram.org/botTOKEN/setWebhook?url=https://your-project.railway.app/api/telegram-webhook"
```

### 7. Custom Domain (ixtiyoriy)
1. Railway Project > **Settings** > **Domains**
2. **Generate Domain** yoki **Custom Domain** qo'shing

---

## 🔄 Ikkala Platform Ham Ishlatish

Agar siz **ikkala platform ham** ishlatmoqchi bo'lsangiz:

### Vercel (Frontend + Webhook)
- Frontend sayt uchun
- Telegram bot webhook uchun (serverless function)

### Railway (Bot Server)
- Telegram bot uchun alohida server
- 24/7 ishlaydi

**Eslatma**: Faqat bitta webhook o'rnatishingiz kerak! Agar ikkalasini ham ishlatsangiz, faqat bittasini tanlang.

---

## 🧪 Testing

### 1. Frontend Test
1. Vercel deployment URL ga kiring
2. Sayt to'g'ri ishlayotganini tekshiring

### 2. Telegram Bot Test
1. Telegram da botingizga `/start` yuboring
2. Til tanlash menyusi chiqishi kerak
3. Barcha funksiyalarni test qiling

### 3. Webhook Test
```bash
# Webhook status
curl "https://api.telegram.org/botTOKEN/getWebhookInfo"

# Webhook ni o'chirish (agar kerak bo'lsa)
curl -X POST "https://api.telegram.org/botTOKEN/deleteWebhook"
```

---

## 🐛 Troubleshooting

### Bot javob bermayapti?
1. ✅ Webhook o'rnatilganini tekshiring
2. ✅ Environment variables to'g'ri qo'shilganini tekshiring
3. ✅ Vercel/Railway logs ni ko'ring
4. ✅ Bot token to'g'ri ekanligini tekshiring

### Build xatosi?
1. ✅ `npm install` lokalda ishlayotganini tekshiring
2. ✅ Node.js versiyasi mos ekanligini tekshiring (20.x)
3. ✅ Dependencies to'liq o'rnatilganini tekshiring

### Supabase xatosi?
1. ✅ Environment variables to'g'ri qo'shilganini tekshiring
2. ✅ Supabase project faol ekanligini tekshiring
3. ✅ Service role key to'g'ri ekanligini tekshiring

---

## 📝 Qo'shimcha Eslatmalar

1. **Environment Variables** ni hech qachon GitHub ga commit qilmang!
2. **Bot Token** ni xavfsiz saqlang
3. **Service Role Key** ni faqat server-side ishlating
4. **Webhook URL** ni to'g'ri o'rnating
5. **Deploy** dan keyin har doim test qiling

---

## 🔗 Foydali Linklar

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Supabase Documentation](https://supabase.com/docs)

---

## ✅ Checklist

Deploy qilishdan oldin:

- [ ] GitHub repository ga push qilingan
- [ ] Environment variables tayyor
- [ ] Supabase project sozlangan
- [ ] Telegram bot yaratilgan va token olingan
- [ ] Vercel/Railway account ochilgan
- [ ] Webhook URL o'rnatilgan
- [ ] Test qilingan

---

**Muvaffaqiyatli deploy! 🎉**

