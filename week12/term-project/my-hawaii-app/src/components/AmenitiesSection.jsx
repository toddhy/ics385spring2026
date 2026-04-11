import React from 'react';
import './AmenitiesSection.css';

export default function AmenitiesSection({ amenities }) {
  return (
    <section className="amenities-section">
      <div className="amenities-container">
        <h2>Our Amenities</h2>
        <p className="amenities-intro">Experience world-class facilities designed for your comfort</p>
        
        <ul className="amenities-list">
          {amenities && amenities.map((amenity, idx) => (
            <li key={idx} className="amenity-item">
              <span className="amenity-icon">✓</span>
              <span className="amenity-text">{amenity}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
