// ============================================
// EXPRESS SERVER - MAIN ENTRY POINT
// ============================================
// Backend server with REST API
// Supabase ishlatilmaydi, JSON file storage
// ============================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Config
import config from './config/config.js';

// Routes
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import eventsRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';
import teachersRoutes from './routes/teachers.js';
import departmentsRoutes from './routes/departments.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    config.frontendUrl,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
].filter(Boolean);

app.use(cors({
    origin: config.nodeEnv === 'production'
        ? allowedOrigins
        : '*',
    credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// API Info
app.get('/api', (req, res) => {
    res.json({
        name: 'Maktab Admin API',
        version: '1.0.0',
        endpoints: [
            'GET /api/auth/me',
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET /api/news',
            'GET /api/events',
            'GET /api/gallery',
            'GET /api/teachers',
            'GET /api/departments',
            'GET /api/settings',
            'POST /api/upload',
        ],
    });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// ============================================
// STATIC FILES (FRONTEND)
// ============================================

// Serve static files from dist directory (Vite build output)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/') || req.path === '/health') {
        return res.status(404).json({ error: 'Not found' });
    }

    res.sendFile(path.join(distPath, 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint topilmadi',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: config.nodeEnv === 'development' ? err.message : 'Server xatosi',
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('============================================');
    console.log('🚀 MAKTAB ADMIN SERVER');
    console.log('============================================');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/health`);
    console.log(`📍 API:    http://localhost:${PORT}/api`);
    console.log(`📦 Static: ${distPath}`);
    console.log(`🌍 Mode:   ${config.nodeEnv}`);
    console.log('============================================');
    console.log('');
});

export default app;
