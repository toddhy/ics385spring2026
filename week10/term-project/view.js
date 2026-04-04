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

  // Define the customer schema
  const customerSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false },
    date: { type: String, required: true },
    // Add any other fields as needed
  });
  
  // Create the customer model
  const Customer = mongoose.model('Customer', customerSchema);
  
  await mongoose.disconnect();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
