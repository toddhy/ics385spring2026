const mongoose = require('mongoose');
const Customer = require('./customerModel');


// Local MongoDB connection string
const localConnectionString = 'mongodb://127.0.0.1:27017/myHotelDB';

// Atlas MongoDB connection string (loaded from .env file)
// Format: mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
const atlasConnectionString = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://username:password@cluster-name.mongodb.net/myHotelDB?retryWrites=true&w=majority';


mongoose.connect(localConnectionString, { useNewUrlParser: true})
  .then(async () => {
    console.log('Connected to MongoDB.');

    // Insert three records into the Customer model
    const customersToInsert = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '555-987-6543'
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '555-555-1234'
      }
    ];
    // Insert three hotel records
    const hotelsToInsert = [
      {
        name: 'Tropical Paradise Resort',
        rating: 5,
        location: 'Honolulu, Hawaii',
        description: 'Luxury beachfront resort with oceanview rooms and premium service'
      },
      {
        name: 'Mountain View Lodge',
        rating: 4,
        location: 'Denver, Colorado',
        description: 'Cozy mountain lodge with scenic views and hiking trails'
      },
      {
        name: 'Desert Dreams Hotel',
        rating: 4.5,
        location: 'Phoenix, Arizona',
        description: 'Modern desert hotel with spa facilities and pools'
      }
    ];

    // Insert three amenities records
    const amenitiesToInsert = [
      {
        hotelName: 'Tropical Paradise Resort',
        pool: true,
        lawn: true,
        bbq: true,
        laundry: true
      },
      {
        hotelName: 'Mountain View Lodge',
        pool: false,
        lawn: true,
        bbq: true,
        laundry: true
      },
      {
        hotelName: 'Desert Dreams Hotel',
        pool: true,
        lawn: false,
        bbq: false,
        laundry: true
      }
    ];


    // Delete all documents in the Customers collection
    try {
      const result = await Customer.deleteMany({});

      console.log(`Deleted ${result.deletedCount} customers.`);
    } catch (error) {
      console.error('Error deleting customers:', error);
    }
    
    // Insert Array of CustomersToInsert into Customers Collection
    try {
      const insertedCustomers = await Customer.insertMany(customersToInsert);
      console.log('Inserted customers:', insertedCustomers);
    } catch (error) {
      console.error('Error inserting customers:', error);
    }

    // Find all the documents with the last name 'Doe'
    try {
      const lastNameToFind = 'Doe';
      const customer = await Customer.find({ lastName: lastNameToFind });

      if (customer) {
        console.log(`Found customer with last name '${lastNameToFind}':`, customer);
      } else {
        console.log(`No customer found with last name '${lastNameToFind}'`);
      }
    } catch (error) {
      console.error('Error finding customer:', error);
    }
    
    // Close the MongoDB connection after finishing the operations
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//Customer.find({});