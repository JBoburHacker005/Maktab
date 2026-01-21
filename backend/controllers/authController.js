// ============================================
// AUTH CONTROLLER
// ============================================
// Login/Logout funksiyalari
// Admin autentifikatsiyasi
// ============================================

import config from '../config/config.js';
import { generateToken } from '../middleware/auth.js';
import { readData } from '../models/db.js';

/**
 * Admin login
 * POST /api/auth/login
 */
export const login = (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username va password kiritilishi shart',
            });
        }

        // Default admin tekshirish
        if (
            username === config.defaultAdmin.username &&
            password === config.defaultAdmin.password
        ) {
            const user = {
                id: 'super-admin-default',
                username: config.defaultAdmin.username,
                role: config.defaultAdmin.role,
            };

            const token = generateToken(user);

            return res.json({
                success: true,
                message: 'Muvaffaqiyatli kirildi',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    },
                    token,
                },
            });
        }

        // Boshqa adminlarni tekshirish (admins.json dan)
        const admins = readData('admins.json');
        const admin = admins.find(
            (a) => a.username === username && a.password === password
        );

        if (admin) {
            const user = {
                id: admin.id,
                username: admin.username,
                role: admin.role || 'admin',
            };

            const token = generateToken(user);

            return res.json({
                success: true,
                message: 'Muvaffaqiyatli kirildi',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    },
                    token,
                },
            });
        }

        // Noto'g'ri credentials
        return res.status(401).json({
            success: false,
            message: 'Noto\'g\'ri username yoki password',
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Joriy foydalanuvchi ma'lumotlari
 * GET /api/auth/me
 */
export const getMe = (req, res) => {
    try {
        return res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    role: req.user.role,
                },
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Logout (client-side token o'chirish uchun)
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
    return res.json({
        success: true,
        message: 'Muvaffaqiyatli chiqildi',
    });
};

export default {
    login,
    getMe,
    logout,
};
