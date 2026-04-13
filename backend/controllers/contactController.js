// ============================================
// CONTACT CONTROLLER
// ============================================
// Aloqa formasi xabarlarini qayta ishlash
// Email va Telegramga jo'natish
// ============================================

import config from '../config/config.js';
import https from 'https';

/**
 * Xabarni qabul qilish va jo'natish
 * POST /api/contact
 */
export const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Barcha maydonlarni to\'ldirish shart',
            });
        }

        // Telegramga jo'natish
        let telegramSuccess = false;
        if (config.telegram.botToken && config.telegram.chatId) {
            const botToken = config.telegram.botToken;
            const chatId = config.telegram.chatId;
            
            const telegramMessage = `
📩 *Yangi xabar (Maktab saytidan)*

👤 *Ism:* ${name}
📧 *Email:* ${email}
📝 *Mavzu:* ${subject}
💬 *Xabar:*
${message}
            `.trim();

            telegramSuccess = await sendTelegramMessage(botToken, chatId, telegramMessage);
        }

        // Emailga jo'natish (Hozircha faqat log qilamiz, SMTP ma'lumotlari kutilmoqda)
        // console.log('Email to imx321@piima.uz:', { name, email, subject, message });

        if (telegramSuccess) {
            return res.status(200).json({
                success: true,
                message: 'Xabaringiz muvaffaqiyatli yuborildi',
            });
        } else {
            console.error('Telegram notification failed');
            return res.status(500).json({
                success: false,
                message: 'Xabarni yuborishda xatolik yuz berdi (Telegram)',
            });
        }

    } catch (error) {
        console.error('Contact submit error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Telegram Bot API orqali xabar yuborish
 */
function sendTelegramMessage(token, chatId, text) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown',
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${token}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };

        const req = https.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                console.error(`Telegram API error: ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (error) => {
            console.error('Telegram request error:', error);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

export default {
    submitContact,
};
