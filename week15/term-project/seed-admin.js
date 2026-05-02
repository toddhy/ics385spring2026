import mongoose from 'mongoose';
import User from './models/User.js';
import 'dotenv/config';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@myhawaiiapp.com';
    const adminPassword = 'Password123!'; // User should change this

    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('Admin user already exists');
    } else {
      const admin = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log(`Admin user created: ${adminEmail}`);
      console.log('Note: Use the password set in this script to login.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
