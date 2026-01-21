// ============================================
// JWT AUTHENTICATION MIDDLEWARE
// ============================================
// Token tekshirish va generatsiya qilish
// Protected routelar uchun ishlatiladi
// ============================================

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * JWT token generatsiya qilish
 * @param {Object} user - Foydalanuvchi ma'lumotlari
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};

/**
 * JWT token tekshirish middleware
 * Protected routelar uchun ishlatiladi
 */
export const verifyToken = (req, res, next) => {
    try {
        // Authorization header dan token olish
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token taqdim etilmagan',
            });
        }

        // "Bearer TOKEN" formatidan token ajratib olish
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token topilmadi',
            });
        }

        // Token tekshirish
        const decoded = jwt.verify(token, config.jwtSecret);

        // Foydalanuvchi ma'lumotlarini request ga qo'shish
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token muddati tugagan',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Noto\'g\'ri token',
        });
    }
};

/**
 * Super admin tekshirish middleware
 * Faqat super_admin uchun ruxsat
 */
export const requireSuperAdmin = (req, res, next) => {
    if (req.user?.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            message: 'Sizda bu amalni bajarish uchun ruxsat yo\'q',
        });
    }
    next();
};

/**
 * Admin yoki Super admin tekshirish middleware
 */
export const requireAdmin = (req, res, next) => {
    if (!['admin', 'super_admin'].includes(req.user?.role)) {
        return res.status(403).json({
            success: false,
            message: 'Sizda bu amalni bajarish uchun ruxsat yo\'q',
        });
    }
    next();
};

export default {
    generateToken,
    verifyToken,
    requireSuperAdmin,
    requireAdmin,
};
