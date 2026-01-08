# Telegram Kanaldan Yangiliklarni Olish va Qo'shish

Bu skript `t.me/T2022PIMA` Telegram kanalidan 2025-yil 25-avgustdan boshlab barcha yangiliklarni olib, Supabase database'ga qo'shadi.

## Talablar

1. `.env` faylida quyidagi o'zgaruvchilar bo'lishi kerak:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Supabase database'da `news` jadvali mavjud bo'lishi kerak.

## Ishlatish

Terminalda quyidagi buyruqni bajaring:

```bash
npm run fetch-news
```

Yoki to'g'ridan-to'g'ri:

```bash
tsx scripts/fetch_news.ts
```

## Nima qiladi?

1. ✅ Telegram kanaldan (`t.me/T2022PIMA`) 2025-yil 25-avgustdan boshlab barcha postlarni oladi
2. ✅ Har bir postdan quyidagi ma'lumotlarni ajratadi:
   - Sana va vaqt
   - Matn (title va content)
   - Rasm (agar mavjud bo'lsa)
   - Link
3. ✅ Kategoriyani avtomatik aniqlaydi:
   - `Awards` - olimpiada, musobaqa, tanlov
   - `Sports` - sport, futbol, basketbol
   - `Events` - tadbir, bayram, marosim
   - `Academic` - fan, dars, ta'lim
   - `general` - boshqa hamma narsa
4. ✅ Supabase database'ga qo'shadi
5. ✅ Duplikatlarni o'tkazib yuboradi (bir xil title bo'lgan yangiliklarni)
6. ✅ `scripts/news_data.json` faylga saqlaydi

## Natija

Skript ishga tushgandan keyin:
- ✅ Barcha yangiliklarni Supabase'ga qo'shadi
- ✅ `scripts/news_data.json` faylga saqlaydi
- ✅ Konsol'da progress va natijalarni ko'rsatadi

## Xatolar

Agar xatolik bo'lsa:
1. `.env` faylida Supabase o'zgaruvchilarini tekshiring
2. Supabase database'da `news` jadvali mavjudligini tekshiring
3. Internet aloqasini tekshiring

## Eslatma

- Skript bir necha daqiqa davom etishi mumkin (kanaldagi postlar soniga qarab)
- Har bir post o'rtasida 100ms kechikish bor (rate limiting uchun)
- Maksimal 500 ta post olinadi (xavfsizlik uchun)

