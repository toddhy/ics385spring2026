import { useEffect, useState } from 'react';
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
import { getBackendUrl } from './utils/getBackendUrl';

function AuthPage() {
  const [path, setPath] = useState(window.location.pathname);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const isRegister = path === '/register';
  const title = isRegister ? 'Create your account' : 'Sign in';
  const subtitle = isRegister ? 'Book a stay or manage your reservations.' : 'Use Google or email and password to continue.';
  const actionPath = isRegister ? '/register' : '/login';
  const googlePath = isRegister ? '/auth/google?from=register' : '/auth/google?from=login';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${getBackendUrl()}${actionPath}`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      window.location.href = '/';
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #0ea5e9 100%)' }}>
      <div style={{ width: '100%', maxWidth: 480, background: 'rgba(255,255,255,0.96)', borderRadius: 20, padding: '2rem', boxShadow: '0 30px 80px rgba(15,23,42,0.35)' }}>
        <p style={{ margin: 0, color: '#0369a1', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hawaiian Hospitality</p>
        <h1 style={{ margin: '0.5rem 0 0.5rem', fontSize: '2rem', color: '#0f172a' }}>{title}</h1>
        <p style={{ margin: 0, color: '#475569', lineHeight: 1.5 }}>{subtitle}</p>

        <div style={{ marginTop: '1.5rem' }}>
          <a href={`${getBackendUrl()}${googlePath}`} style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: '#2563eb', color: 'white', padding: '0.9rem 1rem', borderRadius: 12, fontWeight: 700 }}>
            Continue with Google
          </a>
          <p style={{ textAlign: 'center', color: '#64748b', margin: '1rem 0' }}>or</p>
          {error ? <div style={{ marginBottom: '0.9rem', padding: '0.75rem 1rem', borderRadius: 12, background: '#fee2e2', color: '#b91c1c' }}>{error}</div> : null}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
            <input name="email" type="email" placeholder="Email address" required style={{ padding: '0.9rem 1rem', borderRadius: 12, border: '1px solid #cbd5e1' }} />
            <input name="password" type="password" placeholder="Password" required style={{ padding: '0.9rem 1rem', borderRadius: 12, border: '1px solid #cbd5e1' }} />
            <button type="submit" disabled={submitting} style={{ padding: '0.95rem 1rem', borderRadius: 12, border: 'none', background: '#0f172a', color: 'white', fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Please wait...' : (isRegister ? 'Create account' : 'Sign in')}
            </button>
          </form>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.95rem' }}>
          <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Back to home</a>
          <a href={isRegister ? '/login' : '/register'} style={{ color: '#2563eb', textDecoration: 'none' }}>
            {isRegister ? 'Already have an account?' : 'Need an account?'}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (path === '/login' || path === '/register') {
    return <AuthPage />;
  }

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
