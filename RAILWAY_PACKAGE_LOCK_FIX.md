# Railway package-lock.json Fix

## Muammo

Railway `npm ci` ishlatmoqda, lekin `package-lock.json` eskirgan va `express`, `cors`, `tsx` kabi paketlar unda yo'q.

## Yechim

### Variant 1: nixpacks.toml sozlash (Tavsiya etiladi)

`nixpacks.toml` fayl yaratildi va build command `npm install` ga o'zgartirildi.

Bu fayl Railway'ga build paytida `npm install` ishlatishni aytadi, `npm ci` o'rniga.

### Variant 2: package-lock.json ni yangilash (Lokalda)

Agar lokalda npm mavjud bo'lsa:

```bash
# package-lock.json ni o'chirish
rm package-lock.json

# Qayta yaratish
npm install

# GitHub ga push qilish
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Variant 3: Railway Dashboard da Build Command ni o'zgartirish

1. Railway Dashboard > Service > Settings > Build & Deploy
2. **Build Command** ni o'zgartiring:
   - Eski: `npm ci` (avtomatik)
   - **Yangi**: `npm install`
3. **Save** va **Redeploy**

## Tekshirish

Deploy tugagach:
- Railway logs da `npm install` ko'rinishi kerak
- Xatolar yo'q bo'lishi kerak
- Server ishga tushishi kerak

---

**Muvaffaqiyatli deploy! 🚀**

