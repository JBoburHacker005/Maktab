# Telegram Bot Token Sozlash

## Vercel da Environment Variable qo'shish

### 1-usul: Vercel Dashboard orqali

1. **Vercel Dashboard ga kiring**
   - https://vercel.com/dashboard ga o'ting
   - Loyihangizni tanlang (ima-uz)

2. **Settings ga o'ting**
   - Project > Settings
   - Environment Variables bo'limiga o'ting

3. **Yangi Variable qo'shing**
   - **Name**: `TELEGRAM_BOT_TOKEN`
   - **Value**: Bot Father dan olgan token (masalan: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
   - **Environment**: Production, Preview, Development (hammasini tanlang)
   - **Save** tugmasini bosing

4. **Qo'shimcha Variables** (agar yo'q bo'lsa):
   - `VITE_SUPABASE_URL` - Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (Settings > API)

5. **Redeploy qiling**
   - Deployments bo'limiga o'ting
   - Eng so'nggi deployment ni ... menu dan "Redeploy" ni tanlang

### 2-usul: Vercel CLI orqali

```bash
# Vercel CLI o'rnatish (agar yo'q bo'lsa)
npm i -g vercel

# Login qilish
vercel login

# Environment variable qo'shish
vercel env add TELEGRAM_BOT_TOKEN

# Qiymatni kiriting (Bot Father dan olgan token)
# Environment ni tanlang (Production, Preview, Development)

# Qayta deploy qilish
vercel --prod
```

## Bot Token olish

1. Telegram da [@BotFather](https://t.me/botfather) ga o'ting
2. `/newbot` yuboring
3. Bot nomini kiriting
4. Bot username ni kiriting (oxirida `bot` bo'lishi kerak)
5. Bot Father sizga token beradi, uni nusxalang

**Misol token formati:**
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
```

## Tekshirish

Token to'g'ri qo'shilganini tekshirish:

1. Vercel Dashboard > Settings > Environment Variables
2. `TELEGRAM_BOT_TOKEN` borligini tekshiring
3. Webhook ni sozlang:
   ```
   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://ima-uz.vercel.app/api/telegram-webhook
   ```
4. Webhook status ni tekshiring:
   ```
   https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

## Muhim eslatmalar

⚠️ **Token ni hech qachon public qilmaydilar!**
- `.env` faylini `.gitignore` ga qo'shing
- Token ni kodga yozmang
- Faqat Vercel Environment Variables da saqlang

✅ **Xavfsizlik:**
- Token faqat server-side ishlatiladi
- Client-side kodda ko'rinmaydi
- Vercel avtomatik xavfsiz saqlaydi

