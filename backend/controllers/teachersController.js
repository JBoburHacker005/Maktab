// ============================================
// TEACHERS CONTROLLER
// ============================================
// O'qituvchilar bilan ishlash
// CRUD operatsiyalari
// ============================================

import db from '../models/db.js';

const FILENAME = 'teachers.json';

/**
 * Barcha o'qituvchilar
 * GET /api/teachers
 */
export const getAll = (req, res) => {
    try {
        let teachers = db.readData(FILENAME);

        const { published } = req.query;
        if (published === 'true') {
            teachers = teachers.filter(item => item.published === true);
        }

        return res.json({
            success: true,
            data: teachers,
            count: teachers.length,
        });
    } catch (error) {
        console.error('Get all teachers error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bitta o'qituvchi
 * GET /api/teachers/:id
 */
export const getById = (req, res) => {
    try {
        const { id } = req.params;
        const item = db.findById(FILENAME, id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'O\'qituvchi topilmadi',
            });
        }

        return res.json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error('Get teacher by id error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Yangi o'qituvchi qo'shish
 * POST /api/teachers
 */
export const create = (req, res) => {
    try {
        const {
            name,
            subject_uz,
            subject_ru,
            subject_en,
            bio_uz,
            bio_ru,
            bio_en,
            image_url,
            email,
            phone,
            published = true,
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Ism kiritilishi shart',
            });
        }

        if (!subject_uz || !subject_ru || !subject_en) {
            return res.status(400).json({
                success: false,
                message: 'Barcha tillarda fan kiritilishi shart',
            });
        }

        const newItem = db.addItem(FILENAME, {
            name,
            subject_uz,
            subject_ru,
            subject_en,
            bio_uz: bio_uz || null,
            bio_ru: bio_ru || null,
            bio_en: bio_en || null,
            image_url: image_url || null,
            email: email || null,
            phone: phone || null,
            published,
        });

        return res.status(201).json({
            success: true,
            message: 'O\'qituvchi muvaffaqiyatli qo\'shildi',
            data: newItem,
        });
    } catch (error) {
        console.error('Create teacher error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * O'qituvchini yangilash
 * PUT /api/teachers/:id
 */
export const update = (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = db.findById(FILENAME, id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'O\'qituvchi topilmadi',
            });
        }

        const updatedItem = db.updateItem(FILENAME, id, updates);

        return res.json({
            success: true,
            message: 'O\'qituvchi muvaffaqiyatli yangilandi',
            data: updatedItem,
        });
    } catch (error) {
        console.error('Update teacher error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * O'qituvchini o'chirish
 * DELETE /api/teachers/:id
 */
export const remove = (req, res) => {
    try {
        const { id } = req.params;

        const success = db.deleteItem(FILENAME, id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'O\'qituvchi topilmadi',
            });
        }

        return res.json({
            success: true,
            message: 'O\'qituvchi muvaffaqiyatli o\'chirildi',
        });
    } catch (error) {
        console.error('Delete teacher error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Barcha o'qituvchilarni o'chirish
 * DELETE /api/teachers
 */
export const clearAll = (req, res) => {
    try {
        db.clearAll(FILENAME);

        return res.json({
            success: true,
            message: 'Barcha o\'qituvchilar o\'chirildi',
        });
    } catch (error) {
        console.error('Clear all teachers error:', error);
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
