// ============================================
// SETTINGS CONTROLLER
// ============================================
// Sayt sozlamalari bilan ishlash
// Hero, Header, Footer, Contact
// ============================================

import db from '../models/db.js';

const FILENAME = 'settings.json';

// Default settings
const DEFAULT_SETTINGS = {
    hero: {
        title_uz: 'Xush kelibsiz',
        title_ru: 'Добро пожаловать',
        title_en: 'Welcome',
        subtitle_uz: 'Bizning maktabga',
        subtitle_ru: 'В нашу школу',
        subtitle_en: 'To our school',
        background_image: null,
    },
    header: {
        logo: null,
        phone: '+998 90 123 45 67',
        email: 'info@maktab.uz',
    },
    footer: {
        address_uz: 'Toshkent shahri',
        address_ru: 'Город Ташкент',
        address_en: 'Tashkent city',
        social_links: {
            telegram: '',
            instagram: '',
            facebook: '',
            youtube: '',
        },
    },
    contact: {
        phone: '+998 90 123 45 67',
        email: 'info@maktab.uz',
        address_uz: 'Toshkent shahri',
        address_ru: 'Город Ташкент',
        address_en: 'Tashkent city',
        map_embed: '',
        working_hours_uz: 'Dushanba - Shanba: 8:00 - 18:00',
        working_hours_ru: 'Понедельник - Суббота: 8:00 - 18:00',
        working_hours_en: 'Monday - Saturday: 8:00 - 18:00',
    },
};

/**
 * Barcha sozlamalarni olish
 * GET /api/settings
 */
export const getSettings = (req, res) => {
    try {
        let settings = db.readData(FILENAME);

        // Agar settings bo'sh bo'lsa, default qaytarish
        if (!settings || Object.keys(settings).length === 0) {
            db.writeData(FILENAME, DEFAULT_SETTINGS);
            settings = DEFAULT_SETTINGS;
        }

        return res.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error('Get settings error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bir bo'lim sozlamalarini olish
 * GET /api/settings/:section
 */
export const getSection = (req, res) => {
    try {
        const { section } = req.params;
        let settings = db.readData(FILENAME);

        if (!settings || Object.keys(settings).length === 0) {
            db.writeData(FILENAME, DEFAULT_SETTINGS);
            settings = DEFAULT_SETTINGS;
        }

        if (!settings[section]) {
            return res.status(404).json({
                success: false,
                message: 'Bo\'lim topilmadi',
            });
        }

        return res.json({
            success: true,
            data: settings[section],
        });
    } catch (error) {
        console.error('Get section error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Barcha sozlamalarni yangilash
 * PUT /api/settings
 */
export const updateSettings = (req, res) => {
    try {
        const updates = req.body;
        let settings = db.readData(FILENAME);

        if (!settings || Object.keys(settings).length === 0) {
            settings = DEFAULT_SETTINGS;
        }

        // Merge updates with existing settings
        const newSettings = {
            ...settings,
            ...updates,
        };

        db.writeData(FILENAME, newSettings);

        return res.json({
            success: true,
            message: 'Sozlamalar muvaffaqiyatli yangilandi',
            data: newSettings,
        });
    } catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bir bo'lim sozlamalarini yangilash
 * PUT /api/settings/:section
 */
export const updateSection = (req, res) => {
    try {
        const { section } = req.params;
        const updates = req.body;

        let settings = db.readData(FILENAME);

        if (!settings || Object.keys(settings).length === 0) {
            settings = DEFAULT_SETTINGS;
        }

        if (!DEFAULT_SETTINGS[section]) {
            return res.status(404).json({
                success: false,
                message: 'Bo\'lim topilmadi',
            });
        }

        // Merge updates with existing section
        settings[section] = {
            ...settings[section],
            ...updates,
        };

        db.writeData(FILENAME, settings);

        return res.json({
            success: true,
            message: `${section} sozlamalari muvaffaqiyatli yangilandi`,
            data: settings[section],
        });
    } catch (error) {
        console.error('Update section error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

export default {
    getSettings,
    getSection,
    updateSettings,
    updateSection,
};
