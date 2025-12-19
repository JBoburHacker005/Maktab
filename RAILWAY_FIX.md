# Railway Deployment Fix

## Muammo

Railway da deployment paytida xatolar bo'lishi mumkin edi. Quyidagi o'zgarishlar kiritildi:

### 1. `railway.json` tuzatildi
- `startCommand` ni `node server.ts` dan `npm start` ga o'zgartirildi
- `buildCommand` olib tashlandi (Railway avtomatik aniqlaydi)

### 2. `tsx` dependencies ga ko'chirildi
- `tsx` endi `dependencies` da (production uchun ham kerak)
- `server.ts` TypeScript fayl, shuning uchun `tsx` kerak

### 3. `nixpacks.toml` yaratildi
- Railway uchun aniq build konfiguratsiyasi
- Node.js 20.x versiyasi belgilandi

### 4. `Procfile` to'g'ri sozlandi
- `npm start` ishlatiladi

---

## Railway da Deploy Qilish

### 1. Environment Variables
Railway Dashboard > Variables bo'limida quyidagilarni qo'shing:

```
TELEGRAM_BOT_TOKEN=your_bot_token
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
```

### 2. Deploy
1. GitHub repository ni Railway ga ulang
2. Railway avtomatik detect qiladi va deploy qiladi
3. Logs ni tekshiring

### 3. Webhook O'rnatish
Deploy tugagach, Railway sizga URL beradi:

```bash
curl -X POST "https://api.telegram.org/botTOKEN/setWebhook?url=https://your-project.railway.app/api/telegram-webhook"
```

---

## Agar Hali Ham Xato Bo'lsa

1. **Logs ni tekshiring**: Railway Dashboard > Deployments > View Logs
2. **Environment Variables ni tekshiring**: Barcha kerakli variables qo'shilganini tekshiring
3. **Build Command**: Railway avtomatik `npm run build` ni ishlatadi
4. **Start Command**: `npm start` (package.json dan)

---

## Tekshirish

Deploy tugagach:
1. Railway Dashboard > Service > Settings > Domains
2. URL ni oling
3. `/health` endpoint ni tekshiring: `https://your-url.railway.app/health`
4. Telegram bot ga `/start` yuboring

---

**Muvaffaqiyatli deploy! 🚀**

