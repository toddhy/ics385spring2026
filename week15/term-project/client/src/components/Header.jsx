import React, { useEffect, useState } from 'react';
import './Header.css';
import { getAdminUrl, getBackendUrl } from '../utils/getBackendUrl';

export default function Header() {
  const [auth, setAuth] = useState({ authenticated: false, user: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/auth/status`, { headers: { Accept: 'application/json' }, credentials: 'include' });
        const json = await res.json();
        if (mounted) setAuth(json);
      } catch (e) {
        if (mounted) setAuth({ authenticated: false, user: null });
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAdminClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = getAdminUrl('/admin/login');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // Use backend logout route (POST) to destroy session, then redirect client-side
      (async () => {
      try {
        await fetch(`${getBackendUrl()}/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
      } catch (err) {
        // ignore network errors
      }
      // Redirect to frontend root (keeps user on the SPA at :5173)
      window.location.href = window.location.origin;
    })();
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <h2>🌺 Hawaiian Hospitality</h2>
        </div>
        <ul className="nav-links">
          <li><a href="#home" className="nav-link">Home</a></li>
          <li><a href="#dashboard" className="nav-link">Dashboard</a></li>
          <li><a href="#" onClick={handleAdminClick} className="nav-link">Admin</a></li>
          {auth.authenticated ? (
            <>
              <li style={{marginLeft:12,alignSelf:'center',color:'#fff',fontWeight:600}}>
                {auth.user?.displayName || auth.user?.email}
              </li>
              <li style={{marginLeft:12}}>
                <button onClick={handleLogout} className="nav-link" style={{background:'transparent',border:'none',cursor:'pointer'}}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li style={{marginLeft:12}}><a href="/login" className="nav-link">Log In</a></li>
              <li style={{marginLeft:12}}><a href="/register" className="nav-link">Register</a></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
