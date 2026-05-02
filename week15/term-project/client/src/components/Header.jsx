import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <h2>🌺 Hawaiian Hospitality</h2>
        </div>
        <ul className="nav-links">
          <li><a href="#home" className="nav-link">Home</a></li>
          <li><a href="#dashboard" className="nav-link">Dashboard</a></li>
          <li><a href="/admin/login" className="nav-link">Admin</a></li>
        </ul>
      </nav>
    </header>
  );
}
