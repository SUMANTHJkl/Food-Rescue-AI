import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container fade-in" style={{ maxWidth: '1380px', margin: '0 auto' }}>
      {/* Hero Banner Section */}
      <section className="card" style={{ background: 'linear-gradient(135deg, rgba(13, 27, 46, 0.95) 0%, rgba(7, 17, 30, 0.98) 100%)', border: '1px solid var(--icy-border)', borderRadius: '24px', padding: '40px 32px', marginBottom: '36px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge-pill" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '6px 14px', fontSize: '12px' }}>
            🏆 SIH 2026 Problem Statement PS-26234
          </span>
          <span className="badge-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '6px 14px', fontSize: '12px' }}>
            ⚡ Powered by OpenRouter AI & InsForge BaaS
          </span>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1px', margin: '0 0 16px 0', background: 'linear-gradient(90deg, #38bdf8 0%, #34d399 50%, #fb923c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Zero Food Waste. Infinite Impact.
        </h1>

        <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '840px', margin: '0 auto 28px auto', lineHeight: '1.7' }}>
          An AI-driven hyper-local food redistribution network that bridges donor kitchens, NGOs, and local farmers. 
          When food is safe, we feed people. When it is spoiled, we fuel farms — ensuring 100% rational utilization.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-emerald" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={() => navigate('/kitchen')}>
            🍳 Donate Food Surplus
          </button>
          <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={() => navigate('/ngo')}>
            🏢 NGO Meal Claim Hub
          </button>
          <button className="btn btn-orange" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={() => navigate('/farmer')}>
            🌾 Bio-Cycle Farmer Portal
          </button>
        </div>
      </section>

      {/* Live Impact Counter Bar */}
      <div className="grid grid-4 gap-md" style={{ marginBottom: '40px' }}>
        <div className="card" style={{ borderLeft: '4px solid #34d399', padding: '24px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#34d399', margin: 0 }}>7,380 +</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Total Portion Plates Rescued</p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #38bdf8', padding: '24px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#38bdf8', margin: 0 }}>1,845 kg</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Surplus Kept Out of Landfills</p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #fb923c', padding: '24px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#fb923c', margin: 0 }}>425 kg</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Spoiled Food Converted to Manure</p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #a855f7', padding: '24px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#c084fc', margin: 0 }}>&lt; 12 min</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Average AI Route Match Time</p>
        </div>
      </div>

      {/* Enterprise Operations Portals Grid (Amazon / Flipkart Style) */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc', marginBottom: '8px' }}>
          🎯 Operations & Management Portals
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Select a specialized portal below to broadcast surplus, dispatch relief fleet, manage bio-waste, or monitor telemetry.
        </p>
      </div>

      <div className="grid grid-2 md:grid-4 gap-lg" style={{ marginBottom: '44px' }}>
        {/* Donor Kitchen Portal Card */}
        <div className="portal-card">
          <div>
            <div className="portal-card-header">
              <div className="portal-icon-wrapper" style={{ background: 'rgba(52, 211, 153, 0.15)', borderColor: '#34d399' }}>
                🍳
              </div>
              <div>
                <h3 className="portal-card-title" style={{ color: '#34d399' }}>Kitchen & Donor</h3>
                <span className="badge-pill" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontSize: '10px' }}>Food Business</span>
              </div>
            </div>
            <p className="portal-card-desc">
              Report leftover dishes & plates, run AI freshness pre-check, and generate unique QR passes to broadcast surplus.
            </p>
          </div>
          <button className="portal-card-action" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }} onClick={() => navigate('/kitchen')}>
            <span>Enter Donor Hub</span>
            <span>➔</span>
          </button>
        </div>

        {/* NGO Relief Hub Card */}
        <div className="portal-card">
          <div>
            <div className="portal-card-header">
              <div className="portal-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8' }}>
                🏢
              </div>
              <div>
                <h3 className="portal-card-title" style={{ color: '#38bdf8' }}>NGO Relief Hub</h3>
                <span className="badge-pill" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '10px' }}>Food Relief</span>
              </div>
            </div>
            <p className="portal-card-desc">
              Claim consumable food donations, view visual route map distance & ETA, and dispatch rescue fleet.
            </p>
          </div>
          <button className="portal-card-action" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }} onClick={() => navigate('/ngo')}>
            <span>Claim Available Surplus</span>
            <span>➔</span>
          </button>
        </div>

        {/* Farmer Bio-Hub Card */}
        <div className="portal-card">
          <div>
            <div className="portal-card-header">
              <div className="portal-icon-wrapper" style={{ background: 'rgba(249, 115, 22, 0.15)', borderColor: '#fb923c' }}>
                🌾
              </div>
              <div>
                <h3 className="portal-card-title" style={{ color: '#fb923c' }}>Bio-Cycle Farmer Hub</h3>
                <span className="badge-pill" style={{ background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', fontSize: '10px' }}>Bio-Recycle</span>
              </div>
            </div>
            <p className="portal-card-desc">
              Rational recovery of spoiled food rerouted by safety gates for cattle feed and organic compost/manure.
            </p>
          </div>
          <button className="portal-card-action" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }} onClick={() => navigate('/farmer')}>
            <span>Claim Bio-Waste Lots</span>
            <span>➔</span>
          </button>
        </div>

        {/* Admin Command Center Card */}
        <div className="portal-card">
          <div>
            <div className="portal-card-header">
              <div className="portal-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: '#c084fc' }}>
                ⚡
              </div>
              <div>
                <h3 className="portal-card-title" style={{ color: '#c084fc' }}>Admin Command</h3>
                <span className="badge-pill" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontSize: '10px' }}>Executive</span>
              </div>
            </div>
            <p className="portal-card-desc">
              Executive telemetry control panel, Recharts analytics, system alerts, real-time audit table, and OpenRouter AI copilot.
            </p>
          </div>
          <button className="portal-card-action" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }} onClick={() => navigate('/admin')}>
            <span>View Executive Control</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8', marginBottom: '20px' }}>
          🚀 Key Technical Innovations & Architectural Features
        </h3>
        <div className="grid grid-3 gap-lg">
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>🧠 OpenRouter AI Copilot</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Analyzes storage condition, temperature, and dish composition to predict safety scores and exact expiry hours.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontWeight: '800', color: '#34d399', marginBottom: '8px' }}>🗺️ Safest Cold-Chain Route Mapping</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Calculates visual route overlays, distance in kilometers, temperature control telemetry, and pickup ETA.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontWeight: '800', color: '#fb923c', marginBottom: '8px' }}>🛡️ Deep-Link QR Verification</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Generates cryptographic QR Code tokens with direct URL verification (`http://localhost:5173/verify?token=...`).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
