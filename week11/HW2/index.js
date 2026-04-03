require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./customerModel');
const Hotel = require('./hotelModel');
const Amenities = require('./amenitiesModel');

// ==================== CONNECTION STRINGS ====================
// Local MongoDB connection string
const localConnectionString = 'mongodb://127.0.0.1:27017/myHotelDB';

// Atlas MongoDB connection string (loaded from .env file)
// Format: mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
const atlasConnectionString = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://username:password@cluster-name.mongodb.net/myHotelDB?retryWrites=true&w=majority';

// ==================== CRUD OPERATIONS FUNCTION ====================
async function performCRUDOperations(connectionString, isAtlas) {
  const connectionType = isAtlas ? 'Atlas' : 'Local MongoDB';
  console.log(`\n========== Connecting to ${connectionType} ==========`);
  
  try {
    // Connect to MongoDB
    await mongoose.connect(connectionString, { useNewUrlParser: true });
    console.log(`✓ Connected to ${connectionType}.`);

    // ==================== CUSTOMER OPERATIONS ====================
    console.log('\n--- CUSTOMER OPERATIONS ---');
    
    // Delete all documents in the Customers collection
    try {
      const customerDeleteResult = await Customer.deleteMany({});
      console.log(`✓ Deleted ${customerDeleteResult.deletedCount} customers.`);
    } catch (error) {
      console.error('✗ Error deleting customers:', error.message);
    }
    
    // Insert three customer records
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

    try {
      const insertedCustomers = await Customer.insertMany(customersToInsert);
      console.log(`✓ Inserted ${insertedCustomers.length} customers.`);
    } catch (error) {
      console.error('✗ Error inserting customers:', error.message);
    }

    // Query customers by last name 'Doe'
    try {
      const lastNameToFind = 'Doe';
      const customers = await Customer.find({ lastName: lastNameToFind });

      if (customers.length > 0) {
        console.log(`✓ Found ${customers.length} customer(s) with last name '${lastNameToFind}':`);
        customers.forEach(c => console.log(`  - ${c.firstName} ${c.lastName} (${c.email})`));
      } else {
        console.log(`✓ No customers found with last name '${lastNameToFind}'`);
      }
    } catch (error) {
      console.error('✗ Error finding customers:', error.message);
    }

    // ==================== HOTEL OPERATIONS ====================
    console.log('\n--- HOTEL OPERATIONS ---');
    
    // Delete all documents in the Hotels collection
    try {
      const hotelDeleteResult = await Hotel.deleteMany({});
      console.log(`✓ Deleted ${hotelDeleteResult.deletedCount} hotels.`);
    } catch (error) {
      console.error('✗ Error deleting hotels:', error.message);
    }
    
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

    try {
      const insertedHotels = await Hotel.insertMany(hotelsToInsert);
      console.log(`✓ Inserted ${insertedHotels.length} hotels.`);
    } catch (error) {
      console.error('✗ Error inserting hotels:', error.message);
    }

    // Query hotels by name
    try {
      const hotelNameToFind = 'Tropical Paradise Resort';
      const hotels = await Hotel.find({ name: hotelNameToFind });

      if (hotels.length > 0) {
        console.log(`✓ Found hotel(s) with name '${hotelNameToFind}':`);
        hotels.forEach(h => console.log(`  - ${h.name} (${h.location}, Rating: ${h.rating}/5)`));
      } else {
        console.log(`✓ No hotels found with name '${hotelNameToFind}'`);
      }
    } catch (error) {
      console.error('✗ Error finding hotels:', error.message);
    }

    // ==================== AMENITIES OPERATIONS ====================
    console.log('\n--- AMENITIES OPERATIONS ---');
    
    // Delete all documents in the Amenities collection
    try {
      const amenitiesDeleteResult = await Amenities.deleteMany({});
      console.log(`✓ Deleted ${amenitiesDeleteResult.deletedCount} amenities records.`);
    } catch (error) {
      console.error('✗ Error deleting amenities:', error.message);
    }
    
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

    try {
      const insertedAmenities = await Amenities.insertMany(amenitiesToInsert);
      console.log(`✓ Inserted ${insertedAmenities.length} amenities records.`);
    } catch (error) {
      console.error('✗ Error inserting amenities:', error.message);
    }

    // Query amenities by pool
    try {
      const hasPool = true;
      const hotelWithPool = await Amenities.find({ pool: hasPool });

      if (hotelWithPool.length > 0) {
        console.log(`✓ Found ${hotelWithPool.length} hotel(s) with pool:`);
        hotelWithPool.forEach(a => console.log(`  - ${a.hotelName} (Amenities: Pool, Lawn: ${a.lawn}, BBQ: ${a.bbq}, Laundry: ${a.laundry})`));
      } else {
        console.log(`✓ No hotels found with pool.`);
      }
    } catch (error) {
      console.error('✗ Error finding amenities:', error.message);
    }

    console.log(`\n✓ ${connectionType} operations completed successfully!`);
    
  } catch (error) {
    console.error(`✗ Error connecting to ${connectionType}:`, error.message);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// ==================== MAIN EXECUTION ====================
async function main() {
  console.log('========== MONGOOSE CRUD OPERATIONS ==========');
  console.log('Demonstrating CRUD operations with Customer, Hotel, and Amenities models\n');

  // Perform CRUD operations on local MongoDB
  await performCRUDOperations(localConnectionString, false);

  // Wait a moment before connecting to Atlas
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Perform CRUD operations on Atlas (only if connection string is configured)
  // Uncomment the line below after updating the Atlas connection string with your credentials
  // await performCRUDOperations(atlasConnectionString, true);

  console.log('\n========== ALL OPERATIONS COMPLETED ==========');
  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
