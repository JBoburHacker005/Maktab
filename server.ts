// Express server for Railway deployment
// Serves static frontend build + health check endpoint
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  'https://*.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? allowedOrigins
    : '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist directory (Vite build output)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Serving static files from: ${distPath}`);
});
