# MongoDB Mongoose CRUD Operations Assignment

## Overview
This project demonstrates CRUD operations using Mongoose with three models:
- **Customer** - with firstName, lastName, email, phone
- **Hotel** - with name, rating, location, description
- **Amenities** - with hotelName, pool, lawn, bbq, laundry

## Files Created
- `package.json` - Project configuration and dependencies
- `customerModel.js` - Customer schema and model
- `hotelModel.js` - Hotel schema and model
- `amenitiesModel.js` - Amenities schema and model
- `index.js` - Main script with CRUD operations for all three collections
- `README.md` - This file

## Prerequisites
1. **MongoDB** - Local instance running on `mongodb://127.0.0.1:27017/`
2. **Node.js** - Version 14 or higher
3. **Optional** - MongoDB Atlas account for cloud testing

## Setup Instructions

### 1. Install Dependencies
```powershell
cd week11\HW2
npm install
```

### 2. Start Local MongoDB
Ensure MongoDB is running locally on the default port (27017):
```powershell
# If using mongod command
mongod
```

### 3. Run the Script with Local MongoDB
```powershell
node index.js
```

### 4. Configure for Atlas (Optional)
To test with MongoDB Atlas:

1. Get your Atlas connection string from MongoDB Atlas console
2. Update the `atlasConnectionString` in `index.js`:
   ```javascript
   const atlasConnectionString = 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/myHotelDB?retryWrites=true&w=majority';
   ```
3. Uncomment the Atlas operation call at the bottom of the `main()` function:
   ```javascript
   await performCRUDOperations(atlasConnectionString, true);
   ```
4. Run again:
   ```powershell
   node index.js
   ```

## What the Script Does

### Customer Operations
- ✓ Deletes all existing customer records
- ✓ Inserts 3 sample customer records (John Doe, Jane Doe, Alice Johnson)
- ✓ Queries customers by last name "Doe"

### Hotel Operations
- ✓ Deletes all existing hotel records
- ✓ Inserts 3 sample hotels:
  - Tropical Paradise Resort (Honolulu, 5-star)
  - Mountain View Lodge (Denver, 4-star)
  - Desert Dreams Hotel (Phoenix, 4.5-star)
- ✓ Queries hotels by name "Tropical Paradise Resort"

### Amenities Operations
- ✓ Deletes all existing amenities records
- ✓ Inserts 3 amenities records corresponding to the hotels
- ✓ Queries for hotels with a pool

## Expected Output
```
========== MONGOOSE CRUD OPERATIONS ==========
Demonstrating CRUD operations with Customer, Hotel, and Amenities models

========== Connecting to Local MongoDB ==========
✓ Connected to Local MongoDB.

--- CUSTOMER OPERATIONS ---
✓ Deleted 0 customers.
✓ Inserted 3 customers.
✓ Found 2 customer(s) with last name 'Doe':
  - John Doe (john.doe@example.com)
  - Jane Doe (jane.doe@example.com)

--- HOTEL OPERATIONS ---
✓ Deleted 0 hotels.
✓ Inserted 3 hotels.
✓ Found hotel(s) with name 'Tropical Paradise Resort':
  - Tropical Paradise Resort (Honolulu, Hawaii, Rating: 5/5)

--- AMENITIES OPERATIONS ---
✓ Deleted 0 amenities records.
✓ Inserted 3 amenities records.
✓ Found 1 hotel(s) with pool:
  - Tropical Paradise Resort (Amenities: Pool, Lawn: true, BBQ: true, Laundry: true)

✓ Local MongoDB operations completed successfully!

========== ALL OPERATIONS COMPLETED ==========
```

## Mongoose Schema Features

### Hotel Schema
```javascript
{
  name: String (required),
  rating: Number (0-5, required),
  location: String (required),
  description: String (required)
}
```

### Amenities Schema
```javascript
{
  hotelName: String (required),
  pool: Boolean (default: false),
  lawn: Boolean (default: false),
  bbq: Boolean (default: false),
  laundry: Boolean (default: false)
}
```

## Troubleshooting

### Connection Error to Local MongoDB
- Ensure MongoDB server is running
- Check that it's listening on `127.0.0.1:27017`

### Atlas Connection Issues
- Verify connection string formatting
- Check username and password
- Ensure your IP is whitelisted in Atlas Network Access
- Confirm database name in connection string

### Duplicate Email Error
- The script clears all records on each run, but if you manually test insertions, be aware that email must be unique
- Either delete records from the collection or use different emails

## Files Location
All files are located in: `c:\ics385spring2026\week11\HW2\`
