// ============================================
// GALLERY CONTROLLER
// ============================================
// Galereya bilan ishlash
// CRUD operatsiyalari
// ============================================

import db from '../models/db.js';

const FILENAME = 'gallery.json';

/**
 * Barcha galereya rasmlari
 * GET /api/gallery
 */
export const getAll = (req, res) => {
    try {
        let gallery = db.readData(FILENAME);

        const { published, category } = req.query;

        if (published === 'true') {
            gallery = gallery.filter(item => item.published === true);
        }

        if (category) {
            gallery = gallery.filter(item => item.category === category);
        }

        return res.json({
            success: true,
            data: gallery,
            count: gallery.length,
        });
    } catch (error) {
        console.error('Get all gallery error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bitta galereya rasmi
 * GET /api/gallery/:id
 */
export const getById = (req, res) => {
    try {
        const { id } = req.params;
        const item = db.findById(FILENAME, id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Rasm topilmadi',
            });
        }

        return res.json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error('Get gallery by id error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Yangi rasm qo'shish
 * POST /api/gallery
 */
export const create = (req, res) => {
    try {
        const {
            title_uz,
            title_ru,
            title_en,
            image_url,
            category,
            published = true,
        } = req.body;

        if (!title_uz || !title_ru || !title_en) {
            return res.status(400).json({
                success: false,
                message: 'Barcha tillarda sarlavha kiritilishi shart',
            });
        }

        if (!image_url) {
            return res.status(400).json({
                success: false,
                message: 'Rasm URL kiritilishi shart',
            });
        }

        const newItem = db.addItem(FILENAME, {
            title_uz,
            title_ru,
            title_en,
            image_url,
            category: category || 'general',
            published,
        });

        return res.status(201).json({
            success: true,
            message: 'Rasm muvaffaqiyatli qo\'shildi',
            data: newItem,
        });
    } catch (error) {
        console.error('Create gallery error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Rasmni yangilash
 * PUT /api/gallery/:id
 */
export const update = (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = db.findById(FILENAME, id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Rasm topilmadi',
            });
        }

        const updatedItem = db.updateItem(FILENAME, id, updates);

        return res.json({
            success: true,
            message: 'Rasm muvaffaqiyatli yangilandi',
            data: updatedItem,
        });
    } catch (error) {
        console.error('Update gallery error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Rasmni o'chirish
 * DELETE /api/gallery/:id
 */
export const remove = (req, res) => {
    try {
        const { id } = req.params;

        const success = db.deleteItem(FILENAME, id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Rasm topilmadi',
            });
        }

        return res.json({
            success: true,
            message: 'Rasm muvaffaqiyatli o\'chirildi',
        });
    } catch (error) {
        console.error('Delete gallery error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Barcha rasmlarni o'chirish
 * DELETE /api/gallery
 */
export const clearAll = (req, res) => {
    try {
        db.clearAll(FILENAME);

        return res.json({
            success: true,
            message: 'Barcha rasmlar o\'chirildi',
        });
    } catch (error) {
        console.error('Clear all gallery error:', error);
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
