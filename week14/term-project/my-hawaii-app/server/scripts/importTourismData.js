import mongoose from 'mongoose';
import 'dotenv/config';
import TourismStatistics from '../models/TourismStatistics.js';
import TourismMarketShare from '../models/TourismMarketShare.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tourismDataPath = path.join(__dirname, '../tourism-data.json');
const tourismData = JSON.parse(fs.readFileSync(tourismDataPath, 'utf-8'));
const cleanedMarketShare = { ...tourismData.marketShare };

delete cleanedMarketShare['US Total'];

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await TourismStatistics.deleteMany({});
    console.log('Cleared existing tourism statistics');

    // Insert new data
    const result = await TourismStatistics.insertMany(tourismData.monthlyData);
    console.log(`Successfully imported ${result.length} months of tourism data`);

    // Replace the market-share summary used by the pie chart
    await TourismMarketShare.deleteMany({});
    await TourismMarketShare.create({ marketShare: cleanedMarketShare });
    console.log('Successfully imported tourism market share');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
