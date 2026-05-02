// scripts/seed.js
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import 'dotenv/config';
await mongoose.connect(process.env.MONGO_URI);
await Property.deleteMany({}); // Clear existing records
await Property.insertMany([
{ name: 'Wailea Beach Villas', island: 'Maui', type: 'vacation rental',
description: 'Luxury ocean-front villas near Wailea.',
amenities: ['pool','wifi','ocean view','parking'],
targetSegment: 'Honeymoon', imageURL: '/images/wailea.jpg' },
{ name: 'Grand Hyatt Kauai', island: 'Kauai', type: 'hotel',
description: 'Luxury resort on Kauai with golf course.',
amenities: ['spa','golf','beach','restaurant'],
targetSegment: 'Family', imageURL: '/images/kauai.jpg' },
{ name: 'Volcano House', island: 'Hawaii Island', type: 'hotel',
description: 'Historic hotel overlooking Hawaii Volcanoes National Park.',
amenities: ['volcano view','restaurant','guided tours'],
targetSegment: 'Eco-tourist', imageURL: '/images/volcano.jpg' },
{ name: 'Surfer Shack HNL', island: 'Oahu', type: 'vacation rental',
description: 'Beachfront accommodation perfect for surfers.',
amenities: ['surfboard rental','wifi','kitchen'],
targetSegment: 'Adventure seekers', imageURL: '/images/hnl.jpg' },
{ name: 'Lanai Cat Refuge B&B', island: 'Lanai', type: 'vacation rental',
description: 'Unique bed and breakfast with cat sanctuary.',
amenities: ['quiet','garden','cat sanctuary'],
targetSegment: 'Repeat visitors', imageURL: '/images/lanai.jpg' }
]);
console.log('Seed complete — 5 properties inserted.');
await mongoose.disconnect();
