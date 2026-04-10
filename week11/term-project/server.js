import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import Property from './models/Property.js';
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
