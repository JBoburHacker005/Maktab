// ============================================
// EVENTS CONTROLLER
// ============================================
// Tadbirlar bilan ishlash
// CRUD operatsiyalari
// ============================================

import db from '../models/db.js';

const FILENAME = 'events.json';

/**
 * Barcha tadbirlar ro'yxati
 * GET /api/events
 */
export const getAll = (req, res) => {
    try {
        let events = db.readData(FILENAME);

        // Faqat published = true bo'lganlarni qaytarish (public uchun)
        const { published } = req.query;
        if (published === 'true') {
            events = events.filter(item => item.published === true);
        }

        return res.json({
            success: true,
            data: events,
            count: events.length,
        });
    } catch (error) {
        console.error('Get all events error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bitta tadbir
 * GET /api/events/:id
 */
export const getById = (req, res) => {
    try {
        const { id } = req.params;
        const item = db.findById(FILENAME, id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Tadbir topilmadi',
            });
        }

        return res.json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error('Get event by id error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Yangi tadbir qo'shish
 * POST /api/events
 */
export const create = (req, res) => {
    try {
        const {
            title_uz,
            title_ru,
            title_en,
            description_uz,
            description_ru,
            description_en,
            location,
            event_date,
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

        if (!description_uz || !description_ru || !description_en) {
            return res.status(400).json({
                success: false,
                message: 'Barcha tillarda tavsif kiritilishi shart',
            });
        }

        if (!event_date) {
            return res.status(400).json({
                success: false,
                message: 'Tadbir sanasi kiritilishi shart',
            });
        }

        const newItem = db.addItem(FILENAME, {
            title_uz,
            title_ru,
            title_en,
            description_uz,
            description_ru,
            description_en,
            location: location || null,
            event_date,
            image_url: image_url || null,
            published,
        });

        return res.status(201).json({
            success: true,
            message: 'Tadbir muvaffaqiyatli qo\'shildi',
            data: newItem,
        });
    } catch (error) {
        console.error('Create event error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Tadbirni yangilash
 * PUT /api/events/:id
 */
export const update = (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = db.findById(FILENAME, id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Tadbir topilmadi',
            });
        }

        const updatedItem = db.updateItem(FILENAME, id, updates);

        return res.json({
            success: true,
            message: 'Tadbir muvaffaqiyatli yangilandi',
            data: updatedItem,
        });
    } catch (error) {
        console.error('Update event error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Tadbirni o'chirish
 * DELETE /api/events/:id
 */
export const remove = (req, res) => {
    try {
        const { id } = req.params;

        const success = db.deleteItem(FILENAME, id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Tadbir topilmadi',
            });
        }

        return res.json({
            success: true,
            message: 'Tadbir muvaffaqiyatli o\'chirildi',
        });
    } catch (error) {
        console.error('Delete event error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Barcha tadbirlarni o'chirish
 * DELETE /api/events
 */
export const clearAll = (req, res) => {
    try {
        db.clearAll(FILENAME);

        return res.json({
            success: true,
            message: 'Barcha tadbirlar o\'chirildi',
        });
    } catch (error) {
        console.error('Clear all events error:', error);
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
