import mongoose from 'mongoose';
import Property from './models/Property.js';
import 'dotenv/config';

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  // Get all properties
  const properties = await Property.find();
  console.log(`\n📊 Total properties: ${properties.length}\n`);
  console.log(JSON.stringify(properties, null, 2));
  
  // Get collection stats
  const stats = await Property.collection.stats();
  console.log(`\n📈 Collection Stats:`, stats);
  
  await mongoose.disconnect();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
