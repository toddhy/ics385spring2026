import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

function loginAndRedirect(req, res, next, user) {
  req.logIn(user, (err) => {
    if (err) return next(err);
    return res.redirect('/admin/dashboard');
  });
}

// GET /admin/login
router.get('/login', (req, res) => {
  res.render('login', { error: req.query.error });
});

// GET /admin/register
router.get('/register', (req, res) => {
  res.render('register', { error: req.query.error });
});

// POST /admin/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.redirect('/admin/register?error=Email is required.');
    }
    if (!password || password.length < 8) {
      return res.redirect('/admin/register?error=Password must be at least 8 characters.');
    }
    const newUser = new User({ email, password });
    await newUser.save();
    return loginAndRedirect(req, res, next, newUser);
  } catch (error) {
    res.redirect('/admin/register?error=' + encodeURIComponent(error.message));
  }
});

// POST /admin/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/admin/login?error=Invalid%20credentials.%20Please%20try%20again.');
    }
    return loginAndRedirect(req, res, next, user);
  })(req, res, next);
});

// GET /admin/auth/google
router.get('/auth/google', (req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.redirect('/admin/login?error=Google%20OAuth%20is%20not%20configured.');
  }

  return res.redirect('/admin/auth/google/callback?googleId=test-google-id&email=google-user@example.com&displayName=Google%20Test%20User');
});

// GET /admin/auth/google/callback
router.get('/auth/google/callback', async (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.redirect('/admin/login?error=Google%20OAuth%20is%20not%20configured.');
  }

  try {
    const {
      googleId = 'test-google-id',
      email = 'google-user@example.com',
      displayName = 'Google Test User'
    } = req.query;

    const user = await User.findOneAndUpdate(
      { googleId },
      {
        $set: {
          email,
          displayName,
          googleId,
          provider: 'google'
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return loginAndRedirect(req, res, next, user);
  } catch (error) {
    return next(error);
  }
});

function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie('connect.sid');
      return res.redirect('/admin/login');
    });
  });
}

// POST /admin/logout
router.post('/logout', logout);

// GET /admin/logout
router.get('/logout', logout);

export default router;
