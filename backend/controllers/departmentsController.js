// ============================================
// DEPARTMENTS CONTROLLER
// ============================================
// Bo'limlar bilan ishlash
// CRUD operatsiyalari
// ============================================

import db from '../models/db.js';

const FILENAME = 'departments.json';

/**
 * Barcha bo'limlar
 * GET /api/departments
 */
export const getAll = (req, res) => {
    try {
        let departments = db.readData(FILENAME);

        const { published } = req.query;
        if (published === 'true') {
            departments = departments.filter(item => item.published === true);
        }

        return res.json({
            success: true,
            data: departments,
            count: departments.length,
        });
    } catch (error) {
        console.error('Get all departments error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bitta bo'lim
 * GET /api/departments/:id
 */
export const getById = (req, res) => {
    try {
        const { id } = req.params;
        const item = db.findById(FILENAME, id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Bo\'lim topilmadi',
            });
        }

        return res.json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error('Get department by id error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Yangi bo'lim qo'shish
 * POST /api/departments
 */
export const create = (req, res) => {
    try {
        const {
            name_uz,
            name_ru,
            name_en,
            description_uz,
            description_ru,
            description_en,
            icon,
            published = true,
        } = req.body;

        if (!name_uz || !name_ru || !name_en) {
            return res.status(400).json({
                success: false,
                message: 'Barcha tillarda nom kiritilishi shart',
            });
        }

        if (!description_uz || !description_ru || !description_en) {
            return res.status(400).json({
                success: false,
                message: 'Barcha tillarda tavsif kiritilishi shart',
            });
        }

        const newItem = db.addItem(FILENAME, {
            name_uz,
            name_ru,
            name_en,
            description_uz,
            description_ru,
            description_en,
            icon: icon || 'BookOpen',
            published,
        });

        return res.status(201).json({
            success: true,
            message: 'Bo\'lim muvaffaqiyatli qo\'shildi',
            data: newItem,
        });
    } catch (error) {
        console.error('Create department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bo'limni yangilash
 * PUT /api/departments/:id
 */
export const update = (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = db.findById(FILENAME, id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Bo\'lim topilmadi',
            });
        }

        const updatedItem = db.updateItem(FILENAME, id, updates);

        return res.json({
            success: true,
            message: 'Bo\'lim muvaffaqiyatli yangilandi',
            data: updatedItem,
        });
    } catch (error) {
        console.error('Update department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Bo'limni o'chirish
 * DELETE /api/departments/:id
 */
export const remove = (req, res) => {
    try {
        const { id } = req.params;

        const success = db.deleteItem(FILENAME, id);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Bo\'lim topilmadi',
            });
        }

        return res.json({
            success: true,
            message: 'Bo\'lim muvaffaqiyatli o\'chirildi',
        });
    } catch (error) {
        console.error('Delete department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Barcha bo'limlarni o'chirish
 * DELETE /api/departments
 */
export const clearAll = (req, res) => {
    try {
        db.clearAll(FILENAME);

        return res.json({
            success: true,
            message: 'Barcha bo\'limlar o\'chirildi',
        });
    } catch (error) {
        console.error('Clear all departments error:', error);
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
