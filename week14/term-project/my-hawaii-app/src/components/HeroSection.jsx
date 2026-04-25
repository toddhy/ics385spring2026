import React from 'react';
import './HeroSection.css';

export default function HeroSection({ name, island, tagline, imageURL }) {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${imageURL})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{name}</h1>
        <p className="hero-location">📍 {island}</p>
        <p className="hero-tagline">{tagline}</p>
      </div>
    </section>
  );
}
