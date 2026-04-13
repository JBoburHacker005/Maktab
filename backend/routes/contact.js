// ============================================
// CONTACT ROUTES
// ============================================
// Aloqa formasi uchun yo'nalishlar
// ============================================

import express from 'express';
import contactController from '../controllers/contactController.js';

const router = express.Router();

// Xabar yuborish
// POST /api/contact
router.post('/', contactController.submitContact);

export default router;
