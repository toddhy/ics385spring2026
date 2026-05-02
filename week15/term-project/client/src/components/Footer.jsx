import React from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#amenities">Amenities</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#facebook" aria-label="Facebook" className="social-link">f</a>
              <a href="#twitter" aria-label="Twitter" className="social-link">𝕏</a>
              <a href="#instagram" aria-label="Instagram" className="social-link">📷</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Hawaiian Hospitality Properties. All rights reserved.</p>
          <p>Designed with ❤️ for island paradise seekers.</p>
        </div>
      </div>
    </footer>
  );
}
