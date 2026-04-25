import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import Property from '../models/Property.js';

const router = express.Router();

// Protect ALL admin routes
router.use(isAuthenticated);

// GET /admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const properties = await Property.find();
    
    // Optional (recommended): display the count of guest reviews across all properties
    let totalReviews = 0;
    properties.forEach(p => {
      if (p.reviews) {
        totalReviews += p.reviews.length;
      }
    });

    res.render('admin-dashboard', {
      adminEmail: req.user.email,
      propertyName: "Hawaii Hospitality", 
      properties: properties,
      totalReviews: totalReviews
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
