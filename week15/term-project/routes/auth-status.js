import express from 'express';

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user
      ? {
          id: req.user._id.toString(),
          email: req.user.email,
          displayName: req.user.displayName || req.user.email,
          role: req.user.role,
          provider: req.user.provider,
        }
      : null,
  });
});

export default router;
