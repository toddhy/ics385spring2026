# Property Filtering with Mongoose Query Operators

This guide explains how to use the filtering features in the Hawaii Tourism application with Mongoose query operators.

## Overview

The application supports filtering properties by:
- **Island** (using `$regex` operator)
- **Minimum Average Rating** (using client-side aggregation)

## Features

### 1. Mongoose Query Operators Used

#### `$regex` - Case-Insensitive Island Search
Used to perform case-insensitive substring matching on the `island` field.

```javascript
// Example query in server.js
query.island = { $regex: island, $options: 'i' };
```

**Parameters:**
- `$regex`: The search pattern (e.g., "oahu", "Maui")
- `$options: 'i'`: Case-insensitive matching

#### `$gte` - Greater Than or Equal To
Filters properties by minimum rating using the greater-than-or-equal-to operator.

```javascript
query['reviews.rating'] = { $gte: minRating };
```

Returns properties that have **at least one review** with a rating >= minRating.

#### `$lte` - Less Than or Equal To
Filters properties by maximum rating using the less-than-or-equal-to operator.

```javascript
query['reviews.rating'] = { $lte: maxRating };
```

Returns properties that have **at least one review** with a rating <= maxRating.

#### GET /api/properties
Returns all properties as JSON with optional filters.

**Query Parameters:**
- `island` (optional): Filter by island name (case-insensitive)
- `minRating` (optional): Filter by minimum rating (1-5) using `$gte` operator
- `maxRating` (optional): Filter by maximum rating (1-5) using `$lte` operator

**Examples:**

```bash
# Get all properties
GET http://localhost:3000/api/properties

# Find all properties on Oahu
GET http://localhost:3000/api/properties?island=Oahu

# Find properties with at least one review rating 4+ ($gte operator)
GET http://localhost:3000/api/properties?minRating=4

# Find properties with reviews rated 3 or less ($lte operator)
GET http://localhost:3000/api/properties?maxRating=3

# Combine filters: Maui properties with reviews between 3-5 stars
GET http://localhost:3000/api/properties?island=Maui&minRating=3&maxRating=5

# Case-insensitive search works
GET http://localhost:3000/api/properties?island=big%20island
```

#### GET / (Web UI)
Same filtering as the API, but renders the results in an HTML page.

```bash
# Web UI examples
GET http://localhost:3000/?island=Kauai
GET http://localhost:3000/?island=Hawaii&minRating=4
GET http://localhost:3000/  # Clear filters
```

## Implementation Details

### Database Query (MongoDB with Mongoose)
The filtering uses Mongoose query operators at the database level:

**Island filtering with `$regex`:**
```javascript
const query = {};

if (island) {
  query.island = { $regex: island, $options: 'i' };
}
```

**Rating filtering with `$gte` and `$lte` operators:**
```javascript
if (minRating || maxRating) {
  query['reviews.rating'] = {};
  
  // $gte: Greater Than or Equal To
  if (minRating) {
    query['reviews.rating'].$gte = parseInt(minRating);
  }
  
  // $lte: Less Than or Equal To
  if (maxRating) {
    query['reviews.rating'].$lte = parseInt(maxRating);
  }
}

const properties = await Property.find(query);
```

**How it works:**
- `reviews.rating` accesses the rating field inside the reviews array
- `$gte` finds properties with reviews having rating >= minRating
- `$lte` finds properties with reviews having rating <= maxRating
- Filters are applied at the database level (more efficient than client-side filtering)

### Frontend Filter (JavaScript)
The web UI passes query parameters to trigger the server-side Mongoose filters.

```javascript
// User submits form with island and minRating
// Form action: GET /?island=Oahu&minRating=4
// Server applies Mongoose query operators
```

## Property Schema

The Property model includes:

```javascript
{
  name: String,
  island: String,
  type: String,
  description: String,
  imageURL: String,
  reviews: [{
    guestName: String,
    rating: Number (1-5),
    comment: String,
    date: Date
  }]
}
```

## Usage Examples

### Example 1: Find Oahu Properties
```bash
curl "http://localhost:3000/api/properties?island=Oahu"
```

### Example 2: Get 4+ Star Properties
Properties that have at least one review with rating >= 4:
```bash
curl "http://localhost:3000/api/properties?minRating=4"
```

Generated MongoDB query:
```javascript
{ 'reviews.rating': { $gte: 4 } }
```

### Example 3: Get 3-Star or Lower Properties
Properties that have at least one review with rating <= 3:
```bash
curl "http://localhost:3000/api/properties?maxRating=3"
```

Generated MongoDB query:
```javascript
{ 'reviews.rating': { $lte: 3 } }
```

### Example 4: Maui Properties with 3-5 Star Reviews
```bash
curl "http://localhost:3000/api/properties?island=Maui&minRating=4"
```

### Example 4: Web UI - Filter Using Form
1. Go to http://localhost:3000/
2. Enter island name in the search box
3. Select minimum rating from dropdown
4. Click "Apply Filters"
5. Click "Clear Filters" to reset

## Response Format

### JSON Response (API)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Oceanview Resort",
    "island": "Oahu",
    "type": "Resort",
    "description": "Beautiful beachfront resort",
    "imageURL": "https://example.com/image.jpg",
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "guestName": "John Doe",
        "rating": 5,
        "comment": "Amazing experience!",
        "date": "2026-04-04T10:30:00.000Z"
      }
    ]
  }
]
```

## Performance Notes

- **Island filtering**: Done at database level using Mongoose `$regex`, efficient for large datasets
- **Rating filtering**: Done client-side after fetching properties (useful for averaging across reviews)
- For better performance with large datasets, consider moving rating aggregation to MongoDB's `$group` stage

## Troubleshooting

### No Results Found
- Check island name spelling (filtering is case-insensitive, but exact matches work better)
- Ensure properties have reviews if filtering by rating
- Clear all filters and try individual filters

### Query Not Working
- Verify query parameters are URL-encoded (spaces = `%20`)
- Check browser console for JavaScript errors
- Test API endpoint directly with curl or Postman

## Next Steps

1. Add more filter options (price range, amenities, type)
2. Implement MongoDB aggregation for rating calculations
3. Add sorting options (rating, name, island)
4. Implement pagination for large datasets
