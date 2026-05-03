import express from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

function visitorLoginAndRedirect(req, res, next, user) {
  req.logIn(user, (err) => {
    if (err) return next(err);
    // Redirect back to the booking calendar on the frontend
    return res.redirect('/');
  });
}

// GET /login - Visitor login page
router.get('/login', (req, res) => {
  res.render('visitor-login', { error: req.query.error });
});

// GET /register - Visitor registration page
router.get('/register', (req, res) => {
  res.render('visitor-register', { error: req.query.error });
});

// POST /register - Create new visitor account
router.post('/register', [
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').trim().escape()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.redirect(`/register?error=${encodeURIComponent(errors.array()[0].msg)}`);
  }

  try {
    const { email, password } = req.body;
    const newUser = new User({ 
      email, 
      password,
      role: 'user'  // Ensure visitor is created with 'user' role
    });
    await newUser.save();
    return visitorLoginAndRedirect(req, res, next, newUser);
  } catch (error) {
    res.redirect('/register?error=' + encodeURIComponent(error.message));
  }
});

// POST /login - Visitor login
router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required').trim().escape()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.redirect(`/login?error=${encodeURIComponent(errors.array()[0].msg)}`);
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/login?error=' + encodeURIComponent(info.message || 'Invalid credentials.'));
    }
    return visitorLoginAndRedirect(req, res, next, user);
  })(req, res, next);
});

// GET /logout - Visitor logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie('connect.sid');
      return res.redirect('/');
    });
  });
});

// POST /logout - Visitor logout (POST variant)
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie('connect.sid');
      return res.redirect('/');
    });
  });
});

export default router;
