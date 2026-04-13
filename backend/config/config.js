// ============================================
// CONFIGURATION FILE
// ============================================
// Barcha muhim sozlamalar shu yerda
// Environment variables bilan ishlash
// ============================================

import dotenv from 'dotenv';

dotenv.config();

const config = {
    // Server sozlamalari
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT sozlamalari
    jwtSecret: process.env.JWT_SECRET || 'maktab-admin-secret-key-2024',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // CORS sozlamalari
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

    // Upload sozlamalari
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB

    // Admin credentials (default)
    defaultAdmin: {
        username: 'admin005@jbn.jbn',
        password: 'admin005',
        role: 'super_admin',
    },
};

export default config;
