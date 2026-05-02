import React from 'react';
import './AboutSection.css';

export default function AboutSection({ description, targetSegment, year }) {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2>About Our Property</h2>
        <p className="about-description">{description}</p>
        
        <div className="about-details">
          {year && (
            <div className="detail-item">
              <h3>Established</h3>
              <p>{year}</p>
            </div>
          )}
          {targetSegment && (
            <div className="detail-item">
              <h3>Target Segment</h3>
              <p>{targetSegment}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
