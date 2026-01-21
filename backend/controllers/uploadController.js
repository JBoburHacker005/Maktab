// ============================================
// UPLOAD CONTROLLER
// ============================================
// Fayl yuklash bilan ishlash
// Rasmlar va media fayllar
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads papkasi
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');

// Papkani yaratish
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Base64 rasmni saqlash
 * POST /api/upload
 */
export const uploadImage = (req, res) => {
    try {
        const { image, filename } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Rasm taqdim etilmagan',
            });
        }

        // Base64 formatini tekshirish
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            return res.status(400).json({
                success: false,
                message: 'Noto\'g\'ri rasm formati',
            });
        }

        const mimeType = matches[1];
        const base64Data = matches[2];

        // Fayl kengaytmasini aniqlash
        let extension = 'jpg';
        if (mimeType.includes('png')) extension = 'png';
        else if (mimeType.includes('gif')) extension = 'gif';
        else if (mimeType.includes('webp')) extension = 'webp';
        else if (mimeType.includes('svg')) extension = 'svg';

        // Fayl nomini generatsiya qilish
        const timestamp = Date.now();
        const randomStr = crypto.randomBytes(8).toString('hex');
        const safeFilename = filename
            ? filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
            : 'image';
        const finalFilename = `${safeFilename}_${timestamp}_${randomStr}.${extension}`;

        // Faylni saqlash
        const filePath = path.join(UPLOADS_DIR, finalFilename);
        const buffer = Buffer.from(base64Data, 'base64');

        fs.writeFileSync(filePath, buffer);

        // URL qaytarish
        const imageUrl = `/uploads/${finalFilename}`;

        return res.status(201).json({
            success: true,
            message: 'Rasm muvaffaqiyatli yuklandi',
            data: {
                url: imageUrl,
                filename: finalFilename,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * URL orqali rasm yuklash
 * POST /api/upload/url
 */
export const uploadFromUrl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL taqdim etilmagan',
            });
        }

        // URL dan rasmni yuklash
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(400).json({
                success: false,
                message: 'Rasmni yuklab bo\'lmadi',
            });
        }

        const contentType = response.headers.get('content-type') || '';
        const buffer = Buffer.from(await response.arrayBuffer());

        // Fayl kengaytmasini aniqlash
        let extension = 'jpg';
        if (contentType.includes('png')) extension = 'png';
        else if (contentType.includes('gif')) extension = 'gif';
        else if (contentType.includes('webp')) extension = 'webp';

        // Fayl nomini generatsiya qilish
        const timestamp = Date.now();
        const randomStr = crypto.randomBytes(8).toString('hex');
        const finalFilename = `downloaded_${timestamp}_${randomStr}.${extension}`;

        // Faylni saqlash
        const filePath = path.join(UPLOADS_DIR, finalFilename);
        fs.writeFileSync(filePath, buffer);

        // URL qaytarish
        const imageUrl = `/uploads/${finalFilename}`;

        return res.status(201).json({
            success: true,
            message: 'Rasm muvaffaqiyatli yuklandi',
            data: {
                url: imageUrl,
                filename: finalFilename,
            },
        });
    } catch (error) {
        console.error('Upload from URL error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

/**
 * Rasmni o'chirish
 * DELETE /api/upload/:filename
 */
export const deleteImage = (req, res) => {
    try {
        const { filename } = req.params;

        const filePath = path.join(UPLOADS_DIR, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Fayl topilmadi',
            });
        }

        fs.unlinkSync(filePath);

        return res.json({
            success: true,
            message: 'Fayl muvaffaqiyatli o\'chirildi',
        });
    } catch (error) {
        console.error('Delete image error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server xatosi',
        });
    }
};

export default {
    uploadImage,
    uploadFromUrl,
    deleteImage,
};
