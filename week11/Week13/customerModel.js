const mongoose = require('mongoose');

// Define the customer schema
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  // Add any other fields as needed
});

// Create the customer model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

// Define the hotel schema
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  location: { type: String, required: true },
  description: { type: String, required: true }
});

// Create the hotel model
const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;

// Define the amenities schema
const amenitiesSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  pool: { type: Boolean, default: false },
  lawn: { type: Boolean, default: false },
  bbq: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false }
});

// Create the amenities model
const Amenities = mongoose.model('Amenities', amenitiesSchema);

module.exports = Amenities;