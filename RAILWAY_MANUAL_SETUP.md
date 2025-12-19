# Railway Manual Setup - FINAL SOLUTION

## Muammo

Railway `nixpacks.toml` da `nodejs_20` format xatosi va hali ham build qilmoqda.

## Yechim

### Railway Dashboard da Manual Sozlash (ENG OSON)

1. **Railway Dashboard** > Service > **Settings** > **Build & Deploy**

2. **Build Command** ni o'zgartiring:
   - Eski: `npm run build` yoki `bun run build` (avtomatik)
   - **Yangi**: `npm install` yoki **bo'sh qoldiring**
   
3. **Start Command**: `npm start` (allaqachon to'g'ri)

4. **Node Version**: `20` (yoki `.nvmrc` fayl orqali)

5. **Save** tugmasini bosing

6. **Redeploy** qiling

---

## Yoki nixpacks.toml ni O'chirish

`nixpacks.toml` fayl o'chirildi. Endi Railway avtomatik detect qiladi, lekin siz Build Command ni manual o'zgartirishingiz kerak.

---

## Environment Variables

Railway Dashboard > Variables:

```
PORT=3000
TELEGRAM_BOT_TOKEN=your_bot_token
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Tekshirish

Deploy tugagach:
- Railway logs da `npm run build` yoki `bun run build` ko'rinmasligi kerak
- Faqat `npm install` va `npm start` ko'rinishi kerak
- Server ishga tushishi kerak

---

## Muhim Eslatma

**Railway Dashboard da Build Command ni manual o'zgartirish eng ishonchli yechim!**

Nixpacks avtomatik detect qilmoqda, shuning uchun manual o'zgartirish kerak.

---

**Muvaffaqiyatli deploy! 🚀**

