import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import Property from './models/Property.js';
import TourismStatistics from './models/TourismStatistics.js';
import TourismMarketShare from './models/TourismMarketShare.js';
import USRegionsData from './models/USRegionsData.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET / - Render properties with optional filters (island, minRating)
app.get('/', async (req, res) => {
  try {
    const { island, minRating } = req.query;
    const query = {};
    
    // Filter by island using $regex for case-insensitive search
    if (island) {
      query.island = { $regex: island, $options: 'i' };
    }
    
    // Filter by minimum rating using $gte (greater than or equal) operator
    // This finds properties that have at least one review with rating >= minRating
    if (minRating) {
      const minRatingNum = parseInt(minRating);
      query['reviews.rating'] = { $gte: minRatingNum };
    }
    
    const properties = await Property.find(query);
    
    res.render('index', { properties, island, minRating });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// GET /properties - Render all properties (basic EJS listing)
app.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.render('properties-list', { properties });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// GET /api/properties - Get all properties (JSON API) with optional filters
// Query params: ?island=<name>&minRating=<number>
app.get('/api/properties', async (req, res) => {
  try {
    const { island, minRating, maxRating } = req.query;
    const query = {};
    
    // Filter by island using $regex for case-insensitive substring search
    if (island) {
      query.island = { $regex: island, $options: 'i' };
    }
    
    // Filter by rating range using $gte (>=) and $lte (<=) operators
    // This finds properties that have reviews with ratings in the specified range
    if (minRating || maxRating) {
      query['reviews.rating'] = {};
      
      if (minRating) {
        const minRatingNum = parseInt(minRating);
        query['reviews.rating'].$gte = minRatingNum;
      }
      
      if (maxRating) {
        const maxRatingNum = parseInt(maxRating);
        query['reviews.rating'].$lte = maxRatingNum;
      }
    }
    
    const properties = await Property.find(query);
    
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /properties/:id - Get a specific property (JSON API)
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /properties/:id - Render property details page
app.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).send('Property not found');
    }
    
    res.render('property', { property });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// POST /properties/:id/reviews - Add a review to a property
app.post('/properties/:id/reviews', async (req, res) => {
  try {
    const { guestName, rating, comment } = req.body;
    
    // Validate required fields
    if (!guestName || rating === undefined) {
      return res.status(400).json({ error: 'guestName and rating are required' });
    }
    
    // Validate rating is a number between 1-5
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
    }
    
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Initialize reviews array if it doesn't exist
    if (!property.reviews) {
      property.reviews = [];
    }
    
    // Add the review
    const review = {
      guestName,
      rating,
      comment: comment || '',
      date: new Date()
    };
    
    property.reviews.push(review);
    await property.save();
    
    res.status(201).json({
      message: 'Review added successfully',
      review,
      property
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tourism - Get all tourism statistics
app.get('/api/tourism', async (req, res) => {
  try {
    const tourismStats = await TourismStatistics.find().sort({ month: 1 });
    res.json(tourismStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tourism/market-share - Get the tourism market-share summary
app.get('/api/tourism/market-share', async (req, res) => {
  try {
    const marketShare = await TourismMarketShare.findOne().sort({ createdAt: -1 });

    if (!marketShare) {
      return res.status(404).json({ error: 'Tourism market share data not found' });
    }

    res.json(marketShare.marketShare);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tourism/:month - Get tourism statistics for a specific month
app.get('/api/tourism/:month', async (req, res) => {
  try {
    const stat = await TourismStatistics.findOne({ month: req.params.month });
    
    if (!stat) {
      return res.status(404).json({ error: 'Tourism data for that month not found' });
    }
    
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/us-regions - Get all US regions data
app.get('/api/us-regions', async (req, res) => {
  try {
    const regionsData = await USRegionsData.find().sort({ month: 1 });
    res.json(regionsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/us-regions/:month - Get US regions data for a specific month
app.get('/api/us-regions/:month', async (req, res) => {
  try {
    const data = await USRegionsData.findOne({ month: req.params.month });
    
    if (!data) {
      return res.status(404).json({ error: 'US regions data for that month not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
