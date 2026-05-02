import React from 'react';
import './CTASection.css';

export default function CTASection({ email }) {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2>Ready to Plan Your Paradise?</h2>
        <p className="cta-description">
          Don't miss out on an unforgettable Hawaiian experience. Book your stay with us today!
        </p>
        
        <div className="cta-buttons">
          <a 
            href={`mailto:${email}`} 
            className="btn btn-primary"
            aria-label={`Contact us at ${email}`}
          >
            ✉️ Contact Us
          </a>
          <button className="btn btn-secondary" aria-label="View booking information">
            📅 Check Availability
          </button>
        </div>
        
        <p className="cta-contact">
          Email: <a href={`mailto:${email}`} className="email-link">{email}</a>
        </p>
      </div>
    </section>
  );
}
