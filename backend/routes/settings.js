// ============================================
// SETTINGS ROUTES
// ============================================
// Sayt sozlamalari API endpoints
// ============================================

import { Router } from 'express';
import { getSettings, getSection, updateSettings, updateSection } from '../controllers/settingsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getSettings);
router.get('/:section', getSection);

// Protected routes (admin only)
router.put('/', verifyToken, updateSettings);
router.put('/:section', verifyToken, updateSection);

export default router;
