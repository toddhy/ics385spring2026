import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded fallback property data
  const fallbackProperty = {
    _id: 'fallback-1',
    name: 'Kauai Beach Resort',
    island: 'Kauai',
    type: 'Resort',
    description: 'Beautiful beachfront resort with pristine sandy shores and crystal clear waters.',
    year: '2020',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Beach Access', 'WiFi'],
    targetSegment: 'Luxury Vacationers',
    imageURL: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=600&h=400&fit=crop',
    reviews: [
      {
        guestName: 'Sarah Johnson',
        rating: 5,
        comment: 'Absolutely stunning views and excellent service!',
        date: new Date('2024-01-15')
      },
      {
        guestName: 'Michael Chen',
        rating: 4,
        comment: 'Great location but a bit pricey.',
        date: new Date('2024-02-20')
      }
    ]
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Attempt to fetch from Express server
        // Using /api/properties/:id - you may need to replace 'fallback-1' with an actual MongoDB ObjectId
        const response = await fetch('http://localhost:3000/api/properties');
        
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        
        const properties = await response.json();
        
        // Use the first property if available
        if (properties.length > 0) {
          setProperty(properties[0]);
        } else {
          // No properties in database, use fallback
          setProperty(fallbackProperty);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        // If server is not running or request fails, use hardcoded fallback data
        setProperty(fallbackProperty);
        setError('Using cached data - Express server not running');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, []);

  if (loading) {
    return <div className="container"><p>Loading property...</p></div>;
  }

  if (!property) {
    return <div className="container"><p>No property data available</p></div>;
  }

  // Calculate average rating
  const averageRating = property.reviews && property.reviews.length > 0
    ? (property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="container">
      {error && <p className="error-notice">{error}</p>}
      
      <div className="property-card">
        {/* Property Image */}
        <div className="property-image">
          <img 
            src={property.imageURL} 
            alt={property.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
            }}
          />
        </div>

        {/* Property Header */}
        <div className="property-header">
          <h1>{property.name}</h1>
          <p className="location">
            <span>📍</span> {property.island}
          </p>
          <p className="type">{property.type}</p>
        </div>

        {/* Property Details */}
        <div className="property-details">
          <p className="description">{property.description}</p>
          
          {property.year && <p><strong>Established:</strong> {property.year}</p>}
          <p><strong>Target Segment:</strong> {property.targetSegment}</p>
        </div>

        {/* Amenities */}
        <div className="amenities-section">
          <h3>Amenities</h3>
          <ul className="amenities-list">
            {property.amenities && property.amenities.map((amenity, idx) => (
              <li key={idx}>✓ {amenity}</li>
            ))}
          </ul>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>Guest Reviews</h3>
          <p className="average-rating">Average Rating: ⭐ {averageRating}/5</p>
          
          <div className="reviews-list">
            {property.reviews && property.reviews.map((review, idx) => (
              <div key={idx} className="review">
                <div className="review-header">
                  <p className="guest-name"><strong>{review.guestName}</strong></p>
                  <p className="rating">{'⭐'.repeat(review.rating)}</p>
                </div>
                <p className="comment">{review.comment}</p>
                <p className="date">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
