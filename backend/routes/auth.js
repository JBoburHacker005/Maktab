// ============================================
// AUTH ROUTES
// ============================================
// Login/Logout API endpoints
// ============================================

import { Router } from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);

export default router;
