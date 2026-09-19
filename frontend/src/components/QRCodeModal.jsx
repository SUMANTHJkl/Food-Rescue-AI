import React from 'react';

export default function QRCodeModal({ item, onClose }) {
  if (!item) return null;

  const qrToken = `QR-FR-${item.id || 101}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '440px', textAlignment: 'center', padding: '28px', background: '#091526', border: '1px solid #38bdf8' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="badge-pill" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
            🔒 Unique Digital QR Safety Pass
          </span>
          <button onClick={onClose} className="btn btn-xs btn-outline">✕</button>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f0f9ff', marginBottom: '4px' }}>
          {item.item_name || 'Surplus Batch'}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          🏢 {item.donor_name || 'Donor Kitchen'} • Quantity: {item.quantity_kg || 25} kg ({item.plates_count || 100} plates)
        </p>

        {/* Dynamic SVG QR Matrix */}
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', display: 'inline-block', margin: '0 auto 16px auto', boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)' }}>
          <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
            {/* Outer Finder Pattern Top-Left */}
            <rect x="5" y="5" width="26" height="26" fill="#000" />
            <rect x="9" y="9" width="18" height="18" fill="#fff" />
            <rect x="13" y="13" width="10" height="10" fill="#000" />

            {/* Outer Finder Pattern Top-Right */}
            <rect x="69" y="5" width="26" height="26" fill="#000" />
            <rect x="73" y="9" width="18" height="18" fill="#fff" />
            <rect x="77" y="13" width="10" height="10" fill="#000" />

            {/* Outer Finder Pattern Bottom-Left */}
            <rect x="5" y="69" width="26" height="26" fill="#000" />
            <rect x="9" y="73" width="18" height="18" fill="#fff" />
            <rect x="13" y="77" width="10" height="10" fill="#000" />

            {/* Data Modules (Deterministic QR simulation matrix) */}
            <rect x="36" y="8" width="6" height="6" fill="#000" />
            <rect x="48" y="8" width="6" height="6" fill="#000" />
            <rect x="56" y="14" width="6" height="6" fill="#000" />
            <rect x="38" y="24" width="6" height="6" fill="#000" />
            <rect x="50" y="24" width="6" height="6" fill="#000" />

            <rect x="8" y="38" width="6" height="6" fill="#000" />
            <rect x="20" y="38" width="6" height="6" fill="#000" />
            <rect x="34" y="38" width="10" height="10" fill="#0ea5e9" />
            <rect x="50" y="38" width="6" height="6" fill="#000" />
            <rect x="64" y="38" width="6" height="6" fill="#000" />
            <rect x="78" y="38" width="6" height="6" fill="#000" />

            <rect x="8" y="50" width="6" height="6" fill="#000" />
            <rect x="22" y="50" width="6" height="6" fill="#000" />
            <rect x="38" y="50" width="6" height="6" fill="#000" />
            <rect x="52" y="50" width="10" height="10" fill="#f97316" />
            <rect x="68" y="50" width="6" height="6" fill="#000" />
            <rect x="84" y="50" width="6" height="6" fill="#000" />

            <rect x="38" y="68" width="6" height="6" fill="#000" />
            <rect x="50" y="68" width="6" height="6" fill="#000" />
            <rect x="64" y="68" width="6" height="6" fill="#000" />
            <rect x="78" y="68" width="6" height="6" fill="#000" />

            <rect x="38" y="82" width="6" height="6" fill="#000" />
            <rect x="52" y="82" width="6" height="6" fill="#000" />
            <rect x="68" y="82" width="10" height="10" fill="#10b981" />
            <rect x="84" y="82" width="6" height="6" fill="#000" />
          </svg>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>SECURITY SCAN VERIFICATION TOKEN</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px' }}>{qrToken}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button className="btn btn-sm btn-primary" onClick={() => alert(`QR Pass ${qrToken} downloaded to device!`)}>
            📥 Download Pass
          </button>
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
