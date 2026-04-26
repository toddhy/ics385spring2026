import express from 'express';
import passport from 'passport';

const router = express.Router();

// GET /admin/login
router.get('/login', (req, res) => {
  res.render('login', { error: req.query.error });
});

// POST /admin/login
router.post('/login', (req, res, next) => {
  console.log('Login attempt for:', req.body.email);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Passport authenticate error:', err);
      return next(err);
    }
    if (!user) {
      console.log('Login failed:', info ? info.message : 'Invalid credentials');
      return res.redirect('/admin/login?error=Invalid%20credentials.%20Please%20try%20again.');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      console.log('Login successful for:', user.email);
      return res.redirect('/admin/dashboard');
    });
  })(req, res, next);
});

// GET /admin/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/admin/login');
  });
});

export default router;
