
// Bu scriptni brauzer konsolida ishga tushiring (F12 > Console)
// Bu script Telegram kanalidan metodik qo'llanmalarni (yoki yangiliklarni) tortib oladi

(async function () {
    console.clear();
    console.log("🚀 Telegram import ishga tushdi...");

    // 1. Supabase kutubxonasini yuklash
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');

    // 2. Admin ruxsati bilan ulanish (RLS bypass)
    const SUPABASE_URL = 'https://iusctesnflzacsjksozt.supabase.co';
    const SERVICE_ROLE_KEY = 'sb_secret_AyDA2jvBFZoPrd3dL6TkHA_C8e0TH1o';

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // 3. Eski ma'lumotlarni o'chirish
    console.log("🗑️ Eski yangiliklarni o'chirish...");
    const { error: deleteError } = await supabase
        .from('news')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.error("❌ O'chirishda xatolik:", deleteError);
        return;
    }
    console.log("✅ Eski ma'lumotlar tozalandi.");

    // 4. Telegramdan yuklab olish (Proxy orqali)
    console.log("📥 Telegramdan ma'lumot olinmoqda...");
    const PROXY_URL = 'https://api.allorigins.win/get?url=';
    const TARGET_URL = 'https://t.me/s/T2022PIMA';

    try {
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(TARGET_URL)}`);
        const data = await response.json();
        const html = data.contents;

        // Parsing
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const messages = doc.querySelectorAll('.tgme_widget_message_wrap');

        const newsItems = [];
        const START_DATE = new Date('2025-08-25T00:00:00+05:00');

        console.log(`🔎 ${messages.length} ta xabar topildi. Saralanmoqda...`);

        for (const msg of messages) {
            const textEl = msg.querySelector('.tgme_widget_message_text');
            const timeEl = msg.querySelector('time');

            if (!textEl || !timeEl) continue;

            const text = textEl.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .trim();

            const dateStr = timeEl.getAttribute('datetime');
            const date = new Date(dateStr);

            if (date >= START_DATE && text.length > 0) {
                // Kategoriya aniqlash
                let category = 'general';
                const lowerText = text.toLowerCase();
                if (lowerText.includes('olimpiada') || lowerText.includes('musobaqa')) category = 'Awards';
                else if (lowerText.includes('sport')) category = 'Sports';
                else if (lowerText.includes('tadbir') || lowerText.includes('bayram')) category = 'Events';
                else if (lowerText.includes('fan') || lowerText.includes('dars')) category = 'Academic';

                // Rasm (agar bor bo'lsa)
                let image = null;
                const photoEl = msg.querySelector('.tgme_widget_message_photo_wrap');
                if (photoEl) {
                    const style = photoEl.getAttribute('style');
                    const match = style.match(/background-image:url\('([^']+)'\)/);
                    if (match) image = match[1];
                }

                // Title
                const title = text.split('\n')[0].substring(0, 100);

                newsItems.push({
                    title_uz: title,
                    title_ru: title,
                    title_en: title,
                    content_uz: text,
                    content_ru: text,
                    content_en: text,
                    category,
                    image_url: image,
                    published: true,
                    created_at: dateStr
                });
            }
        }

        console.log(`✅ ${newsItems.length} ta yangilik tayyorlandi.`);

        if (newsItems.length > 0) {
            console.log("📤 Bazaga yuklanmoqda...");
            const { error: insertError } = await supabase.from('news').insert(newsItems);

            if (insertError) {
                console.error("❌ Yuklashda xatolik:", insertError);
            } else {
                console.log("🎉 Muvaffaqiyatli yuklandi! Sahifani yangilang.");
                alert("Yangiliklar muvaffaqiyatli yangilandi! Sahifani yangilang.");
                window.location.reload();
            }
        } else {
            console.warn("⚠️ Yuklash uchun yangilik topilmadi.");
        }

    } catch (e) {
        console.error("❌ Xatolik yuz berdi:", e);
    }
})();
