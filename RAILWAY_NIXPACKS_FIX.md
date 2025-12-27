# Railway Nixpacks Fix - nodejs-20_x Error

## Muammo

Nixpacks `nodejs-20_x` ni tushunmayapti va xato beradi:
```
error: undefined variable 'nodejs-20_x'
```

## Yechim

### 1. nixpacks.toml yangilandi

`nixpacks.toml` fayl yangilandi va endi u:
- `nixPkgs` bo'sh qoldirildi (Railway `.nvmrc` yoki `.node-version` dan Node.js versiyasini avtomatik detect qiladi)
- `package-lock.json` ni o'chiradi
- `npm install` ishlatadi

### 2. Node.js versiyasi

Node.js versiyasi `.nvmrc` va `.node-version` fayllaridan olinadi (20).

### 3. Railway Dashboard da Build Command (Agar kerak bo'lsa)

Agar hali ham muammo bo'lsa, Railway Dashboard da:

1. **Railway Dashboard** > Service > **Settings** > **Build & Deploy**
2. **Build Command** ni o'zgartiring:
   ```
   rm -f package-lock.json && npm install
   ```
3. **Save** va **Redeploy**

## Tekshirish

Deploy tugagach:
- Railway logs da Node.js 20 ishlatilayotganini ko'rasiz
- `npm install` ko'rinishi kerak (npm ci emas)
- Xatolar yo'q bo'lishi kerak
- Server ishga tushishi kerak

---

**Muvaffaqiyatli deploy! 🚀**

