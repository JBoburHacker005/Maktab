# Railway Deployment Fix V2

## Muammolar

1. ❌ **Node.js versiyasi**: Railway Node.js 18 ishlatmoqda, lekin Supabase Node.js 20+ talab qiladi
2. ❌ **package-lock.json**: Yangi dependencies qo'shilgan, lekin `package-lock.json` yangilanmagan
3. ❌ **npm ci xatosi**: `npm ci` `package-lock.json` va `package.json` o'rtasida moslik talab qiladi

## Yechim

### 1. Node.js 20 ni belgilash

Quyidagi fayllar yaratildi:
- `.nvmrc` - Node.js 20
- `.node-version` - Node.js 20
- `nixpacks.toml` - Node.js 20_x belgilandi

### 2. package-lock.json ni yangilash

**Lokalda quyidagilarni bajaring:**

```bash
# package-lock.json ni yangilash
npm install

# Yoki
npm update
```

Keyin GitHub ga push qiling:

```bash
git add package-lock.json
git commit -m "Update package-lock.json for Railway"
git push
```

### 3. Railway da Deploy

1. **Environment Variables** ni tekshiring:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=3000
   ```

2. **Redeploy** qiling:
   - Railway avtomatik yangi commit ni detect qiladi
   - Yoki manual Redeploy tugmasini bosing

3. **Logs ni tekshiring**:
   - Railway Dashboard > Deployments > View Logs
   - Node.js 20 ishlatilayotganini tekshiring

---

## Tekshirish

Deploy tugagach:

1. **Health check**:
   ```
   https://your-project.railway.app/health
   ```

2. **Telegram bot**:
   - Bot ga `/start` yuboring
   - Javob kelishi kerak

---

## Agar Hali Ham Xato Bo'lsa

### Variant 1: package-lock.json ni o'chirish

Agar `package-lock.json` muammo qilayotgan bo'lsa:

```bash
# Lokalda
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Regenerate package-lock.json"
git push
```

### Variant 2: Railway da npm install ishlatish

Railway Settings > Build Command ni o'zgartiring:
- Eski: `npm ci`
- Yangi: `npm install`

---

## Node.js Versiyasini Tekshirish

Railway logs da quyidagilarni ko'rasiz:

```
nodejs_20_x
```

Agar `nodejs_18` ko'rsatilsa, `.nvmrc` va `.node-version` fayllarini tekshiring.

---

**Muvaffaqiyatli deploy! 🚀**

