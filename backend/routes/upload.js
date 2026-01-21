// ============================================
// UPLOAD ROUTES
// ============================================
// Fayl yuklash API endpoints
// ============================================

import { Router } from 'express';
import { uploadImage, uploadFromUrl, deleteImage } from '../controllers/uploadController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Protected routes (admin only)
router.post('/', verifyToken, uploadImage);
router.post('/url', verifyToken, uploadFromUrl);
router.delete('/:filename', verifyToken, deleteImage);

export default router;
