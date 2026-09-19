import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container fade-in">
      {/* Hero Banner Section */}
      <section className="card glow-box margin-bottom-lg padding-xl text-center flex-col items-center">
        <div className="inline-flex items-center gap-xs margin-bottom-sm">
          <span className="badge badge-emerald">SIH 2026 Problem Statement PS-26234</span>
          <span className="badge badge-teal">Powered by OpenRouter AI & InsForge BaaS</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold margin-bottom-md bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
          Zero Food Waste. Infinite Impact.
        </h1>

        <p className="text-lg text-slate-300 max-w-3xl margin-bottom-lg leading-relaxed">
          An AI-driven hyper-local food redistribution network that bridges donor kitchens, NGOs, and local farmers. 
          When food is safe, we feed people. When it is spoiled, we fuel farms — ensuring 100% rational utilization.
        </p>

        <div className="flex wrap-gap gap-md justify-center">
          <Link to="/kitchen" className="btn btn-emerald btn-lg glow-box">
            🍳 Donate Food Surplus
          </Link>
          <Link to="/ngo" className="btn btn-primary btn-lg">
            🏢 NGO Meal Claim Hub
          </Link>
          <Link to="/farmer" className="btn btn-outline btn-lg text-amber-400 border-amber-500/40">
            🌾 Bio-Cycle Farmer Portal
          </Link>
        </div>
      </section>

      {/* Live Impact Counter Bar */}
      <div className="grid grid-4 gap-md margin-bottom-lg text-center">
        <div className="card glass-panel border-l-4 border-emerald-500">
          <h3 className="text-3xl font-extrabold text-emerald-400">7,380 +</h3>
          <p className="text-xs text-muted margin-top-xs">Total Plates Rescued</p>
        </div>
        <div className="card glass-panel border-l-4 border-teal-500">
          <h3 className="text-3xl font-extrabold text-teal-400">1,845 kg</h3>
          <p className="text-xs text-muted margin-top-xs">Surplus Kept Out of Landfills</p>
        </div>
        <div className="card glass-panel border-l-4 border-amber-500">
          <h3 className="text-3xl font-extrabold text-amber-400">425 kg</h3>
          <p className="text-xs text-muted margin-top-xs">Spoiled Food Converted to Manure</p>
        </div>
        <div className="card glass-panel border-l-4 border-indigo-500">
          <h3 className="text-3xl font-extrabold text-indigo-400">&lt; 15 min</h3>
          <p className="text-xs text-muted margin-top-xs">Average AI Route Match Time</p>
        </div>
      </div>

      {/* Stakeholder Portals Showcase Grid */}
      <h2 className="text-2xl font-bold margin-bottom-md flex items-center gap-xs">
        🎯 Choose Your Operations Portal
      </h2>

      <div className="grid grid-2 md:grid-4 gap-md margin-bottom-lg">
        {/* Kitchen Portal Card */}
        <Link to="/kitchen" className="card hover-lift transition-all border-t-4 border-emerald-500 flex-col justify-between">
          <div>
            <div className="text-3xl margin-bottom-xs">🍳</div>
            <h3 className="text-lg font-bold text-emerald-400 margin-bottom-xs">Kitchen & Donor Portal</h3>
            <p className="text-xs text-slate-300">
              Report leftover dishes & plates, calculate AI freshness & safety score, and broadcast surplus instantly.
            </p>
          </div>
          <div className="margin-top-md pt-2 border-t border-slate-700/40 text-xs text-emerald-300 font-semibold flex items-center justify-between">
            <span>Enter Donor Dashboard</span>
            <span>→</span>
          </div>
        </Link>

        {/* NGO Portal Card */}
        <Link to="/ngo" className="card hover-lift transition-all border-t-4 border-teal-500 flex-col justify-between">
          <div>
            <div className="text-3xl margin-bottom-xs">🏢</div>
            <h3 className="text-lg font-bold text-teal-400 margin-bottom-xs">NGO Relief Hub</h3>
            <p className="text-xs text-slate-300">
              Claim consumable food donations, view route map distance & ETA, and dispatch rescue fleet.
            </p>
          </div>
          <div className="margin-top-md pt-2 border-t border-slate-700/40 text-xs text-teal-300 font-semibold flex items-center justify-between">
            <span>Claim Available Surplus</span>
            <span>→</span>
          </div>
        </Link>

        {/* Farmer Portal Card */}
        <Link to="/farmer" className="card hover-lift transition-all border-t-4 border-amber-500 flex-col justify-between">
          <div>
            <div className="text-3xl margin-bottom-xs">🌾</div>
            <h3 className="text-lg font-bold text-amber-400 margin-bottom-xs">Bio-Cycle Farmer Hub</h3>
            <p className="text-xs text-slate-300">
              Rational recovery of spoiled food rerouted by safety gates for cattle feed and organic compost/manure.
            </p>
          </div>
          <div className="margin-top-md pt-2 border-t border-slate-700/40 text-xs text-amber-300 font-semibold flex items-center justify-between">
            <span>Claim Bio-Waste Lots</span>
            <span>→</span>
          </div>
        </Link>

        {/* Admin Command Center Card */}
        <Link to="/admin" className="card hover-lift transition-all border-t-4 border-indigo-500 flex-col justify-between">
          <div>
            <div className="text-3xl margin-bottom-xs">⚡</div>
            <h3 className="text-lg font-bold text-indigo-400 margin-bottom-xs">Admin Command Center</h3>
            <p className="text-xs text-slate-300">
              Executive dashboard, Recharts analytics, system telemetry, live alerts, and OpenRouter AI copilot.
            </p>
          </div>
          <div className="margin-top-md pt-2 border-t border-slate-700/40 text-xs text-indigo-300 font-semibold flex items-center justify-between">
            <span>View Executive Control</span>
            <span>→</span>
          </div>
        </Link>
      </div>

      {/* Feature Highlights Grid */}
      <div className="card glow-box">
        <h3 className="text-xl font-bold margin-bottom-md text-emerald-400">
          🚀 Key Technical Innovations
        </h3>
        <div className="grid grid-3 gap-md">
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-bold text-teal-300 margin-bottom-xs">🧠 OpenRouter AI Engine</h4>
            <p className="text-xs text-muted">
              Analyzes storage condition, temperature, and dish composition to predict safety scores and exact expiry hours.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-bold text-emerald-300 margin-bottom-xs">🗺️ Distance & Route Mapping</h4>
            <p className="text-xs text-muted">
              Calculates visual route overlays, distance in kilometers, and estimated fleet pickup time.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-bold text-amber-300 margin-bottom-xs">🛡️ Rational Safety Gate</h4>
            <p className="text-xs text-muted">
              Locks spoiled items from human distribution and automatically reroutes them to registered farmers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
