require('dotenv').config();
const mongoose = require('mongoose');
const { Customer, Hotel, Amenities } = require('../HW2/customerModel');


// Local MongoDB connection string
const localConnectionString = 'mongodb://127.0.0.1:27017/myHotelDB';

// Atlas MongoDB connection string (loaded from .env file)
// Format: mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
const atlasConnectionString = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://username:password@cluster-name.mongodb.net/myHotelDB?retryWrites=true&w=majority';


//mongoose.connect(localConnectionString, { useNewUrlParser: true})
mongoose.connect(atlasConnectionString, { useNewUrlParser: true})
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

    // Delete all documents in the Hotels collection
    try {
      const hotelDeleteResult = await Hotel.deleteMany({});
      console.log(`Deleted ${hotelDeleteResult.deletedCount} hotels.`);
    } catch (error) {
      console.error('Error deleting hotels:', error);
    }

    // Insert Array of HotelsToInsert into Hotels Collection
    try {
      const insertedHotels = await Hotel.insertMany(hotelsToInsert);
      console.log('Inserted hotels:', insertedHotels);
    } catch (error) {
      console.error('Error inserting hotels:', error);
    }

    // Delete all documents in the Amenities collection
    try {
      const amenitiesDeleteResult = await Amenities.deleteMany({});
      console.log(`Deleted ${amenitiesDeleteResult.deletedCount} amenities records.`);
    } catch (error) {
      console.error('Error deleting amenities:', error);
    }

    // Insert Array of AmenitiesToInsert into Amenities Collection
    try {
      const insertedAmenities = await Amenities.insertMany(amenitiesToInsert);
      console.log('Inserted amenities:', insertedAmenities);
    } catch (error) {
      console.error('Error inserting amenities:', error);
    }

    // Query hotels by name
    try {
      const hotelNameToFind = 'Tropical Paradise Resort';
      const hotels = await Hotel.find({ name: hotelNameToFind });

      if (hotels.length > 0) {
        console.log(`\nFound ${hotels.length} hotel(s) with name '${hotelNameToFind}':`);
        hotels.forEach(h => console.log(`  - ${h.name} (${h.location}, Rating: ${h.rating}/5)`));
      } else {
        console.log(`\nNo hotels found with name '${hotelNameToFind}'`);
      }
    } catch (error) {
      console.error('Error finding hotels:', error);
    }

    // Query amenities by pool
    try {
      const hasPool = true;
      const hotelWithPool = await Amenities.find({ pool: hasPool });

      if (hotelWithPool.length > 0) {
        console.log(`\nFound ${hotelWithPool.length} hotel(s) with pool:`);
        hotelWithPool.forEach(a => console.log(`  - ${a.hotelName}`));
      } else {
        console.log(`\nNo hotels found with pool.`);
      }
    } catch (error) {
      console.error('Error finding amenities with pool:', error);
    }
    
    // Close the MongoDB connection after finishing the operations
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//Customer.find({});