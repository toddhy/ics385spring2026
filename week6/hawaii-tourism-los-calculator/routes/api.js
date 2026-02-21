const express = require('express');
const router = express.Router();
const TourismData = require('../models/TourismData');

// Cache valid categories and locations to reduce database queries
// This prevents information disclosure through timing attacks and repeated validation queries
let cachedCategories = [];
let cachedLocations = [];
let cacheExpiry = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// SECURITY FIX #12: Implement caching to prevent repeated database queries
// This mitigates both DoS and information disclosure through query analysis
async function updateCache() {
  const now = Date.now();
  if (now > cacheExpiry) {
    cachedCategories = await TourismData.distinct('group');
    cachedLocations = await TourismData.distinct('indicator');
    cacheExpiry = now + CACHE_TTL;
  }
}

// SECURITY FIX #4: Input validation helper - whitelist allowed categories and locations
const validateInput = async (category, location) => {
  const errors = [];
  
  // Update cache if expired
  await updateCache();
  
  // Validate category - must exist in database
  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('Invalid category');
  } else if (!cachedCategories.includes(category)) {
    errors.push('Category not found');
  }
  
  // Validate location if provided - must exist in database
  if (location && (typeof location !== 'string' || location.trim() === '')) {
    errors.push('Invalid location format');
  } else if (location && location.trim() !== '' && !cachedLocations.includes(location)) {
    errors.push('Location not found');
  }
  
  return errors;
};

// Get all unique categories (groups)
router.get('/categories', async (req, res) => {
  try {
    const categories = await TourismData.distinct('group');
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    // SECURITY FIX #6: Sanitize error messages
    console.error('Categories error:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching categories' });
  }
});

// Get all unique locations (indicators)
router.get('/locations', async (req, res) => {
  try {
    const locations = await TourismData.distinct('indicator');
    res.json({ success: true, data: locations.sort() });
  } catch (error) {
    // SECURITY FIX #6: Sanitize error messages
    console.error('Locations error:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching locations' });
  }
});

// Calculate average length of stay
router.post('/calculate', async (req, res) => {
  try {
    const { category, location } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }

    // SECURITY FIX #5: Validate user input against database to prevent NoSQL injection
    const validationErrors = await validateInput(category, location);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input parameters'
      });
    }

    // Build query
    const query = { group: category };
    if (location) {
      query.indicator = location;
    }

    // Find matching records
    const records = await TourismData.find(query);

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No data found for the specified criteria'
      });
    }

    // Collect all values
    const allValues = [];
    records.forEach(record => {
      record.yearlyData.forEach(yearData => {
        allValues.push({
          year: yearData.year,
          value: yearData.value,
          location: record.indicator
        });
      });
    });

    if (allValues.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No valid data points found'
      });
    }

    // Calculate statistics
    const values = allValues.map(v => v.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    const minEntry = allValues.find(v => v.value === min);
    const maxEntry = allValues.find(v => v.value === max);

    // Calculate year-over-year data for chart
    const yearlyAverages = {};
    allValues.forEach(item => {
      if (!yearlyAverages[item.year]) {
        yearlyAverages[item.year] = [];
      }
      yearlyAverages[item.year].push(item.value);
    });

    const chartData = Object.keys(yearlyAverages).sort().map(year => ({
      year,
      average: yearlyAverages[year].reduce((a, b) => a + b, 0) / yearlyAverages[year].length
    }));

    res.json({
      success: true,
      data: {
        category,
        location: location || 'All locations',
        statistics: {
          average: parseFloat(average.toFixed(2)),
          min: {
            value: min,
            year: minEntry.year,
            location: minEntry.location
          },
          max: {
            value: max,
            year: maxEntry.year,
            location: maxEntry.location
          },
          dataPoints: values.length
        },
        chartData
      }
    });

  } catch (error) {
    // SECURITY FIX #6: Sanitize error messages - don't expose internal error details
    console.error('Calculate error:', error);
    res.status(500).json({ success: false, error: 'An error occurred while calculating results' });
  }
});

// SECURITY FIX #7: Remove unprotected /api/data endpoint that exposed raw database records
// This endpoint was a security risk as it allowed anyone to dump all database records
// If admin access needed in the future, implement proper authentication first

module.exports = router;
