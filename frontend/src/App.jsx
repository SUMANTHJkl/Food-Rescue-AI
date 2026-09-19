import React from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import KitchenPortal from './pages/KitchenPortal';
import NGOPortal from './pages/NGOPortal';
import FarmerPortal from './pages/FarmerPortal';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell min-h-screen flex flex-col justify-between">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between wrap-gap">
            {/* Logo Brand */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg group-hover:scale-105 transition-transform">
                🌱
              </span>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Food Rescue AI
                </span>
                <span className="text-[10px] text-muted block -mt-1 font-mono">
                  SIH 2026 • PS-26234
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
              >
                🏠 Home
              </NavLink>
              
              <NavLink 
                to="/kitchen" 
                className={({ isActive }) => `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
              >
                🍳 Kitchen / Donor
              </NavLink>

              <NavLink 
                to="/ngo" 
                className={({ isActive }) => `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
              >
                🏢 NGO Relief Hub
              </NavLink>

              <NavLink 
                to="/farmer" 
                className={({ isActive }) => `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
              >
                🌾 Farmer Bio-Hub
              </NavLink>

              <NavLink 
                to="/admin" 
                className={({ isActive }) => `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
              >
                ⚡ Admin Command
              </NavLink>
            </nav>

            {/* Live Telemetry Pill */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              InsForge BaaS Active
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kitchen" element={<KitchenPortal />} />
            <Route path="/ngo" element={<NGOPortal />} />
            <Route path="/farmer" element={<FarmerPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950/80 py-4 px-4 text-center text-xs text-muted">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2026 Food Rescue AI • Smart India Hackathon PS-26234 Solutions</p>
            <div className="flex gap-4">
              <span>InsForge Postgres</span>
              <span>•</span>
              <span>OpenRouter AI (gpt-4o-mini)</span>
              <span>•</span>
              <span>MongoDB Audit Logger</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
