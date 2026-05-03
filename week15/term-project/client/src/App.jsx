import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import AmenitiesSection from './components/AmenitiesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import WeatherDisplay from './components/dashboard/WeatherDisplay';
import BookingCalendar from './components/booking/BookingCalendar';
import VisitorStatsDashboard from './components/dashboard/VisitorStatsDashboard';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const property = {
    name: 'Upcountry Honeymoon Getaway',
    island: 'Maui',
    tagline: 'Your romantic escape on the Valley Isle.',
    description: 'Nestled on the slopes of Haleakala on Maui, Upcountry Honeymoon Getaway offers the perfect blend of luxury and natural beauty. Our vacation rental is designed for couples and families seeking an unforgettable Hawaiian getaway with world-class amenities and personalized service.',
    year: '2026',
    targetSegment: 'Luxury Vacationers & Honeymooners',
    imageURL: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
    amenities: [
      'Lanai with view of the valley and ocean',
      'Private Pool Ocean Views',
      'WiFi & Work Lounge'
    ],
    contactEmail: 'reservations@upcountrygetaway.com'
  };

  if (showDashboard) {
    return (
      <div className="app">
        <button 
          onClick={() => setShowDashboard(false)} 
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            padding: '10px 20px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back to Marketing
        </button>
        <VisitorStatsDashboard />
      </div>
    );
  }

  return (
    <div className="app">
      <button 
        onClick={() => setShowDashboard(true)} 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          backgroundColor: '#0EA5E9',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        View Dashboard
      </button>
      <Header />
      
      <main className="main-content">
        <HeroSection 
          name={property.name}
          island={property.island}
          tagline={property.tagline}
          imageURL={property.imageURL}
        />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
          <WeatherDisplay />
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
          <BookingCalendar />
        </div>
        
        <AboutSection 
          description={property.description}
          year={property.year}
          targetSegment={property.targetSegment}
        />
        
        <AmenitiesSection amenities={property.amenities} />
        
        <CTASection email={property.contactEmail} />
      </main>
      
      <Footer />
    </div>
  );
}
