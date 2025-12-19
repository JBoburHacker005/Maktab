# 🚀 Quick Deploy Guide

Bu loyiha **Vercel** va **Railway** da deploy qilinishi mumkin.

## 📦 Nima Yaratildi?

✅ **Railway uchun**:
- `server.ts` - Express server (Telegram bot uchun)
- `railway.json` - Railway konfiguratsiyasi
- `Procfile` - Railway start command

✅ **Vercel uchun**:
- `vercel.json` - Vercel konfiguratsiyasi (allaqachon bor)
- `api/telegram-webhook.ts` - Serverless function

✅ **Umumiy**:
- `DEPLOY.md` - Batafsil deploy qo'llanmasi
- `ENV_TEMPLATE.md` - Environment variables qo'llanmasi
- `package.json` - Yangi dependencies qo'shildi (express, tsx)

---

## ⚡ Tezkor Start

### 1. Environment Variables

Quyidagilarni sozlang:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Vercel Deployment

1. GitHub ga push qiling
2. Vercel Dashboard > New Project
3. Repository ni tanlang
4. Environment Variables qo'shing
5. Deploy!

**Webhook URL**: `https://your-project.vercel.app/api/telegram-webhook`

### 3. Railway Deployment (ixtiyoriy)

1. Railway Dashboard > New Project
2. GitHub repo ni tanlang
3. Environment Variables qo'shing
4. Deploy!

**Webhook URL**: `https://your-project.railway.app/api/telegram-webhook`

### 4. Telegram Webhook

```bash
curl -X POST "https://api.telegram.org/botTOKEN/setWebhook?url=YOUR_WEBHOOK_URL"
```

---

## 📚 Batafsil Qo'llanmalar

- **DEPLOY.md** - To'liq deploy qo'llanmasi
- **ENV_TEMPLATE.md** - Environment variables qo'llanmasi
- **README_TELEGRAM_BOT.md** - Telegram bot qo'llanmasi

---

## ✅ Checklist

- [ ] Environment variables sozlangan
- [ ] GitHub ga push qilingan
- [ ] Vercel/Railway da deploy qilingan
- [ ] Webhook o'rnatilgan
- [ ] Bot test qilingan (`/start`)

---

**Muvaffaqiyatli deploy! 🎉**

