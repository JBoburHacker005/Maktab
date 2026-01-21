// ============================================
// NEWS CONTROLLER
// ============================================
// Yangiliklar bilan ishlash
// CRUD operatsiyalari
// ============================================

import db from '../models/db.js';

const FILENAME = 'news.json';

/**
 * Barcha yangiliklar ro'yxati
 * GET /api/news
 */
export const getAll = (req, res) => {
    try {
        let news = db.readData(FILENAME);

        // Faqat published = true bo'lganlarni qaytarish (public uchun)
        const { published } = req.query;
        if (published === 'true') {
            news = news.filter(item => item.published === true);
        }

        return res.json({
            success: true,
            data: news,
            count: news.length,
        });
    } catch (error) {
        console.error('Get all news error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bitta yangilik
 * GET /api/news/:id
 */
export const getById = (req, res) => {
    try {
        const { id } = req.params;
        const item = db.findById(FILENAME, id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Yangilik topilmadi',
            });
        }

        return res.json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error('Get news by id error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Yangi yangilik qo'shish
 * POST /api/news
 */
export const create = (req, res) => {
    try {
        const {
            title_uz,
            title_ru,
            title_en,
            content_uz,
            content_ru,
            content_en,
            category,
            image_url,
            published = true,
        } = req.body;

        // Validation
        if (!title_uz || !title_ru || !title_en) {
            return res.status(400).json({
                success: false,
                message: 'Barcha tillarda sarlavha kiritilishi shart',
            });
        }

        if (!content_uz || !content_ru || !content_en) {
            return res.status(400).json({
                success: false,
                message: 'Barcha tillarda matn kiritilishi shart',
            });
        }

        const newItem = db.addItem(FILENAME, {
            title_uz,
            title_ru,
            title_en,
            content_uz,
            content_ru,
            content_en,
            category: category || 'general',
            image_url: image_url || null,
            published,
            author_id: req.user?.id || null,
        });

        return res.status(201).json({
            success: true,
            message: 'Yangilik muvaffaqiyatli qo\'shildi',
            data: newItem,
        });
    } catch (error) {
        console.error('Create news error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Yangilikni yangilash
 * PUT /api/news/:id
 */
export const update = (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Mavjudligini tekshirish
        const existing = db.findById(FILENAME, id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Yangilik topilmadi',
            });
        }

        const updatedItem = db.updateItem(FILENAME, id, updates);

        return res.json({
            success: true,
            message: 'Yangilik muvaffaqiyatli yangilandi',
            data: updatedItem,
        });
    } catch (error) {
        console.error('Update news error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Yangilikni o'chirish
 * DELETE /api/news/:id
 */
export const remove = (req, res) => {
    try {
        const { id } = req.params;

        const success = db.deleteItem(FILENAME, id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Yangilik topilmadi',
            });
        }

        return res.json({
            success: true,
            message: 'Yangilik muvaffaqiyatli o\'chirildi',
        });
    } catch (error) {
        console.error('Delete news error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Barcha yangiliklar o'chirish
 * DELETE /api/news
 */
export const clearAll = (req, res) => {
    try {
        db.clearAll(FILENAME);

        return res.json({
            success: true,
            message: 'Barcha yangiliklar o\'chirildi',
        });
    } catch (error) {
        console.error('Clear all news error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    clearAll,
};
