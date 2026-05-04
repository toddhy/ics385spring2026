import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Protect ALL admin routes
router.use(isAuthenticated);

// GET /admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.redirect('/admin/login?error=' + encodeURIComponent('Administrator access required.'));
    }

    const currentOrigin = `${req.get('x-forwarded-proto') || req.protocol}://${req.get('host')}`;
    const frontendOrigin = new URL(FRONTEND_URL).origin;

    if (frontendOrigin !== currentOrigin) {
      return res.redirect(`${FRONTEND_URL}/admin/dashboard`);
    }

    return res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
