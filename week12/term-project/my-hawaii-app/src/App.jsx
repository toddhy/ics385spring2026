import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import AmenitiesSection from './components/AmenitiesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function App() {
  // Hardcoded property data
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


  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <HeroSection 
          name={property.name}
          island={property.island}
          tagline={property.tagline}
          imageURL={property.imageURL}
        />
        
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
