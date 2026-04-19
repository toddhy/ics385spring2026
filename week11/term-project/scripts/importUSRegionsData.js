import mongoose from 'mongoose';
import 'dotenv/config';
import USRegionsData from '../models/USRegionsData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usRegionsDataPath = path.join(__dirname, '../us-regions-data.json');
const usRegionsData = JSON.parse(fs.readFileSync(usRegionsDataPath, 'utf-8'));

async function importUSRegionsData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await USRegionsData.deleteMany({});
    console.log('Cleared existing US regions data');

    // Insert new data
    const result = await USRegionsData.insertMany(usRegionsData.monthlyByRegion);
    console.log(`Successfully imported ${result.length} months of US regions data`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error importing US regions data:', error);
    process.exit(1);
  }
}

importUSRegionsData();
