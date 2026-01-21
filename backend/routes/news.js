// ============================================
// NEWS ROUTES
// ============================================
// Yangiliklar API endpoints
// ============================================

import { Router } from 'express';
import { getAll, getById, create, update, remove, clearAll } from '../controllers/newsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAll);
router.get('/:id', getById);

// Protected routes (admin only)
router.post('/', verifyToken, create);
router.put('/:id', verifyToken, update);
router.delete('/', verifyToken, clearAll);
router.delete('/:id', verifyToken, remove);

export default router;
