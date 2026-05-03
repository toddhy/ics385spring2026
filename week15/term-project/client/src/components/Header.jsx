import React from 'react';
import './Header.css';
import { getAdminUrl } from '../utils/getBackendUrl';

export default function Header() {
  const handleAdminClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Admin link clicked');
    console.log('Navigating to admin login...');
    window.location.href = getAdminUrl('/admin/login');
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
        </ul>
      </nav>
    </header>
  );
}
