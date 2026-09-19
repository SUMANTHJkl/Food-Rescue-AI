import React, { useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import KitchenPortal from './pages/KitchenPortal';
import NGOPortal from './pages/NGOPortal';
import FarmerPortal from './pages/FarmerPortal';
import AdminDashboard from './pages/AdminDashboard';
import QRScannerModal from './components/QRScannerModal';

export default function App() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-shell min-h-screen flex flex-col justify-between">
        {/* Navigation Header */}
        <header className="app-header">
          <div className="brand-logo">
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px', background: 'rgba(56, 189, 248, 0.15)', padding: '6px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                🌱
              </span>
              <div>
                <h1>Food Rescue AI</h1>
                <span className="badge-pill">SIH 2026 • PS-26234</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="app-nav">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              🏠 Home
            </NavLink>

            <NavLink to="/kitchen" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              🍳 Kitchen / Donor
            </NavLink>

            <NavLink to="/ngo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              🏢 NGO Relief Hub
            </NavLink>

            <NavLink to="/farmer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              🌾 Farmer Bio-Hub
            </NavLink>

            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              ⚡ Admin Command
            </NavLink>
          </nav>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => setIsScannerOpen(true)}
            >
              📷 QR Scanner
            </button>

            <div className="badge-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              🟢 InsForge Active
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kitchen" element={<KitchenPortal />} />
            <Route path="/ngo" element={<NGOPortal />} />
            <Route path="/farmer" element={<FarmerPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer style={{ borderTop: '1px solid var(--icy-border)', background: 'rgba(7, 17, 30, 0.95)', padding: '16px 24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p>© 2026 Food Rescue AI • Smart India Hackathon PS-26234 Solutions</p>
            <div style={{ display: 'flex', gap: '12px', fontWeight: '600' }}>
              <span>💧 Icy Blue Fresh Theme</span>
              <span>•</span>
              <span>🛡️ Safest Route Mapping</span>
              <span>•</span>
              <span>📷 Unique QR Pass Tokens</span>
            </div>
          </div>
        </footer>

        {/* Global QR Scanner Modal */}
        <QRScannerModal 
          isOpen={isScannerOpen} 
          onClose={() => setIsScannerOpen(false)} 
          onScanSuccess={(res) => {
            alert(`Verified QR Order #${res.batchId} (${res.itemName})! Donor: ${res.donorName}`);
          }}
        />
      </div>
    </BrowserRouter>
  );
}
