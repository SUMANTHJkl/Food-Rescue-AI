import React, { useState } from 'react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [tokenInput, setTokenInput] = useState('');
  const [scanningState, setScanningState] = useState('IDLE'); // IDLE, SCANNING, SUCCESS
  const [scannedResult, setScannedResult] = useState(null);

  if (!isOpen) return null;

  const handleSimulateScan = (batchId = 101, name = "Paneer Butter Masala", donor = "Royal Palace Banquet") => {
    setScanningState('SCANNING');
    setTimeout(() => {
      const result = {
        batchId: batchId,
        token: `QR-FR-${batchId}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        itemName: name,
        donorName: donor,
        quantityKg: 25.0,
        platesCount: 120,
        safetyScore: 94,
        timestamp: new Date().toLocaleTimeString()
      };
      setScannedResult(result);
      setScanningState('SUCCESS');
      if (onScanSuccess) {
        onScanSuccess(result);
      }
    }, 1200);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    handleSimulateScan(102, "Basmati Rice & Dal", "TechPark Cafeteria");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '24px', background: '#071322', border: '1px solid #38bdf8' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>📷</span>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8', margin: 0 }}>
                Live Digital QR Safety Scanner
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scan Donor QR Pass to Claim & Dispatch Food Order</span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-xs btn-outline">✕</button>
        </div>

        {/* Camera Viewfinder Simulation */}
        <div style={{ 
          position: 'relative', 
          height: '200px', 
          background: '#030812', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          border: '2px solid #0ea5e9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: 'inset 0 0 30px rgba(14, 165, 233, 0.2)'
        }}>
          {/* Laser Overlay */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            right: '15%',
            bottom: '20%',
            border: '2px dashed #38bdf8',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}></div>

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
            boxShadow: '0 0 10px #ef4444',
            animation: 'pulse 1.5s infinite'
          }}></div>

          {scanningState === 'SCANNING' ? (
            <div style={{ textAlign: 'center', color: '#38bdf8', zIndex: 2 }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <p style={{ fontWeight: '700' }}>Decrypting QR Cryptographic Token...</p>
            </div>
          ) : scanningState === 'SUCCESS' ? (
            <div style={{ textAlign: 'center', color: '#34d399', zIndex: 2 }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>✅</div>
              <p style={{ fontWeight: '800', fontSize: '16px' }}>QR Pass Verified & Authentic!</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', zIndex: 2 }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎯</div>
              <p style={{ fontSize: '13px' }}>Point camera at Donor's Food Safety QR Pass</p>
            </div>
          )}
        </div>

        {/* Scan Result Feedback Card */}
        {scannedResult && (
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge-pill" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#34d399' }}>Verified Order #{scannedResult.batchId}</span>
                <div style={{ fontWeight: '800', color: '#fff', marginTop: '4px' }}>{scannedResult.itemName}</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Donor: {scannedResult.donorName} • Scanned at {scannedResult.timestamp}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#fb923c' }}>{scannedResult.platesCount} Plates</span>
                <span style={{ fontSize: '11px', color: '#34d399', display: 'block' }}>Safety: {scannedResult.safetyScore}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Test Buttons */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>QUICK TEST SIMULATED SCAN:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-xs btn-primary" onClick={() => handleSimulateScan(101, "Paneer Butter Masala", "Royal Palace Banquet")}>
              ⚡ Scan Batch #101 (Curry)
            </button>
            <button className="btn btn-xs btn-orange" onClick={() => handleSimulateScan(102, "Basmati Rice & Dal", "TechPark Cafeteria")}>
              ⚡ Scan Batch #102 (Rice)
            </button>
          </div>
        </div>

        {/* Manual Token Input Form */}
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Or enter QR Pass Token (e.g. QR-FR-101-98A4X)..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            style={{ fontSize: '12px' }}
          />
          <button type="submit" className="btn btn-sm btn-outline">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
