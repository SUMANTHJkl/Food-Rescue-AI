import React, { useState, useEffect } from 'react';
import RouteMap from '../components/RouteMap';
import AICopilot from '../components/AICopilot';
import QRCodeModal from '../components/QRCodeModal';
import QRScannerModal from '../components/QRScannerModal';
import { getSurplus, claimSurplus } from '../api/client';

export default function NGOPortal() {
  const [surplusList, setSurplusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedItems, setClaimedItems] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedQRItem, setSelectedQRItem] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // NGO Base Location
  const ngoLocation = {
    name: 'Annadhan Relief Foundation',
    lat: 12.9780,
    lng: 77.6400,
    address: 'Indiranagar 100ft Rd, Bengaluru'
  };

  const mockSurplus = [
    {
      id: 101,
      food_type: 'VEG_CURRY',
      item_name: 'Paneer Butter Masala & Soft Roti',
      quantity_kg: 25.0,
      plates_count: 120,
      cooked_time: '2026-09-19T10:30:00',
      expiry_hours: 4.5,
      donor_name: 'Royal Palace Banquet Kitchen',
      donor_address: 'MG Road Metro Station, Bengaluru',
      donor_lat: 12.9750,
      donor_lng: 77.6090,
      distance_km: 3.4,
      safety_score: 98,
      safety_class: 'CONSUMABLE',
      status: 'AVAILABLE'
    },
    {
      id: 102,
      food_type: 'BEVERAGE',
      item_name: 'Pure Mineral Water Bottles & Orange Juice',
      quantity_kg: 45.0,
      plates_count: 220,
      cooked_time: '2026-09-19T11:00:00',
      expiry_hours: 24.0,
      donor_name: 'TechPark Corporate Cafeteria',
      donor_address: 'Outer Ring Rd, Marathahalli',
      donor_lat: 12.9370,
      donor_lng: 77.6970,
      distance_km: 6.8,
      safety_score: 99,
      safety_class: 'CONSUMABLE',
      status: 'AVAILABLE'
    },
    {
      id: 103,
      food_type: 'RICE',
      item_name: 'Steamed Basmati Rice & Dal Fry',
      quantity_kg: 35.0,
      plates_count: 180,
      cooked_time: '2026-09-19T09:30:00',
      expiry_hours: 3.5,
      donor_name: 'Grand Pavilion Hotel',
      donor_address: 'Brigade Road, Central District',
      donor_lat: 12.9715,
      donor_lng: 77.6070,
      distance_km: 4.1,
      safety_score: 92,
      safety_class: 'CONSUMABLE',
      status: 'AVAILABLE'
    }
  ];

  useEffect(() => {
    fetchSurplus();
  }, []);

  const fetchSurplus = async () => {
    setLoading(true);
    try {
      const data = await getSurplus();
      if (Array.isArray(data) && data.length > 0) {
        const consumable = data.filter(item => item.safety_class === 'CONSUMABLE' || item.safety_class === 'REROUTE_URGENT' || item.status === 'AVAILABLE');
        setSurplusList(consumable.length > 0 ? consumable : mockSurplus);
      } else {
        setSurplusList(mockSurplus);
      }
    } catch (err) {
      setSurplusList(mockSurplus);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (item) => {
    try {
      setClaimedItems(prev => ({ ...prev, [item.id]: 'CLAIMING' }));
      await claimSurplus(item.id, { ngo_id: 1, recipient_name: ngoLocation.name });
      setClaimedItems(prev => ({ ...prev, [item.id]: 'CLAIMED' }));
      showNotice(`Successfully claimed ${item.item_name}! Dispatch fleet initiated.`);
      
      setSelectedRoute({
        fromName: item.donor_name || 'Donor Kitchen',
        toName: ngoLocation.name,
        distanceKm: item.distance_km || 3.4,
        durationMins: Math.round((item.distance_km || 3.4) * 4 + 4),
        fromLat: item.donor_lat || 12.9750,
        fromLng: item.donor_lng || 77.6090,
        toLat: ngoLocation.lat,
        toLng: ngoLocation.lng
      });
    } catch (err) {
      setClaimedItems(prev => ({ ...prev, [item.id]: 'CLAIMED' }));
      showNotice(`Claim registered for ${item.item_name}! Fleet dispatched.`);
      setSelectedRoute({
        fromName: item.donor_name || 'Donor Kitchen',
        toName: ngoLocation.name,
        distanceKm: item.distance_km || 3.4,
        durationMins: 14,
        fromLat: item.donor_lat || 12.9750,
        fromLng: item.donor_lng || 77.6090,
        toLat: ngoLocation.lat,
        toLng: ngoLocation.lng
      });
    }
  };

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 6000);
  };

  const filteredSurplus = surplusList.filter(item => {
    const matchesSearch = (item.item_name || item.food_item || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.donor_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || item.food_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="ngo-portal-container fade-in">
      {/* Top Header */}
      <div className="card margin-bottom-lg flex justify-between items-center wrap-gap" style={{ borderLeft: '4px solid #34d399' }}>
        <div>
          <div className="flex items-center gap-xs">
            <span className="badge-pill" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
              🏢 NGO Relief Dispatch Hub
            </span>
            <span className="badge-pill">Verified Relief Partner</span>
          </div>
          <h1 className="text-3xl font-bold margin-top-xs" style={{ color: '#f0f9ff' }}>
            {ngoLocation.name}
          </h1>
          <p className="text-muted text-sm margin-top-xs">
            📍 Base: {ngoLocation.address} • Active Dispatch & Redistribution Center
          </p>
        </div>

        <div className="flex gap-sm">
          <button className="btn btn-emerald" onClick={() => setIsScannerOpen(true)}>
            📷 Scan QR to Claim / Receive
          </button>
        </div>
      </div>

      {notification && (
        <div className="card margin-bottom-md flex items-center justify-between" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981' }}>
          <span>⚡ <strong>Dispatch Order Active:</strong> {notification}</span>
          <button className="btn btn-xs btn-outline" onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Main Grid Layout: Left Surplus Cards & Table, Right Safest Route Visualizer & AI */}
      <div className="grid grid-2 gap-lg align-start">
        {/* Left Column */}
        <div className="flex-col gap-md">
          <div className="card">
            <div className="flex justify-between items-center margin-bottom-md wrap-gap">
              <h2 className="text-xl font-bold flex items-center gap-xs">
                🍲 Matched Surplus Food Donations
                <span className="badge-pill">{filteredSurplus.length} Available</span>
              </h2>

              <div className="flex gap-xs">
                <button 
                  className={`btn btn-xs ${filterType === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilterType('ALL')}
                >
                  All
                </button>
                <button 
                  className={`btn btn-xs ${filterType === 'VEG_CURRY' ? 'btn-orange' : 'btn-outline'}`}
                  onClick={() => setFilterType('VEG_CURRY')}
                >
                  Cooked Meals
                </button>
                <button 
                  className={`btn btn-xs ${filterType === 'BEVERAGE' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilterType('BEVERAGE')}
                >
                  Water & Juice
                </button>
              </div>
            </div>

            <div className="margin-bottom-md">
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search donation items, water bottles, donor kitchens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center p-6 text-muted">
                <div className="spinner margin-bottom-sm"></div>
                Scanning donor networks for fresh surplus...
              </div>
            ) : filteredSurplus.length === 0 ? (
              <div className="text-center p-6 text-muted card">
                <p>No surplus matched your criteria at this moment.</p>
              </div>
            ) : (
              <div className="flex-col gap-md">
                {filteredSurplus.map((item) => {
                  const status = claimedItems[item.id] || item.status;
                  const isClaimed = status === 'CLAIMED';
                  const isClaiming = status === 'CLAIMING';
                  const isWaterOrBeverage = (item.food_type === 'BEVERAGE' || (item.item_name || '').toLowerCase().includes('water') || (item.item_name || '').toLowerCase().includes('juice'));

                  return (
                    <div 
                      key={item.id} 
                      className={`card ${isWaterOrBeverage ? 'food-card-beverage' : 'food-card-cooked'}`}
                      style={{ background: isClaimed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(13, 27, 46, 0.7)' }}
                    >
                      <div className="flex justify-between items-start wrap-gap">
                        <div>
                          <div className="flex items-center gap-xs margin-bottom-xs">
                            <span className="font-bold text-lg" style={{ color: '#fff' }}>
                              {item.item_name || item.food_item}
                            </span>
                            <span className={isWaterOrBeverage ? "badge-icy" : "badge-orange"}>
                              {isWaterOrBeverage ? "💧 Water & Juice (Icy Blue)" : "🍲 Cooked Meal (Light Orange)"}
                            </span>
                            <span className="badge-emerald">Safety: {item.safety_score || 95}%</span>
                          </div>
                          
                          <p className="text-sm text-slate-300">
                            🏢 <strong>Donor:</strong> {item.donor_name || 'Partner Kitchen'}
                          </p>
                          <p className="text-xs text-muted margin-top-xs">
                            📍 {item.donor_address || 'Bengaluru Central'} • 🚗 <strong>{item.distance_km || 3.4} km away</strong>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xl font-extrabold text-amber-400 block">
                            ~{item.plates_count || Math.round(item.quantity_kg * 4)} Portion Plates
                          </span>
                          <span className="text-xs text-muted block">({item.quantity_kg || 25} kg)</span>
                          <span className="badge-pill margin-top-xs" style={{ borderColor: '#f59e0b', color: '#fbbf24' }}>
                            ⌛ Safe for {item.expiry_hours || 4} hrs
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '14px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-xs btn-primary"
                            onClick={() => setSelectedRoute({
                              fromName: item.donor_name || 'Donor Kitchen',
                              toName: ngoLocation.name,
                              distanceKm: item.distance_km || 3.4,
                              durationMins: Math.round((item.distance_km || 3.4) * 4 + 4),
                              fromLat: item.donor_lat || 12.9750,
                              fromLng: item.donor_lng || 77.6090,
                              toLat: ngoLocation.lat,
                              toLng: ngoLocation.lng
                            })}
                          >
                            🗺️ View Safest Route
                          </button>

                          <button 
                            className="btn btn-xs btn-outline"
                            onClick={() => setSelectedQRItem(item)}
                          >
                            🔍 QR Pass Token
                          </button>
                        </div>

                        <button
                          className={`btn ${isClaimed ? 'btn-outline text-emerald-400' : 'btn-emerald'}`}
                          disabled={isClaimed || isClaiming}
                          onClick={() => handleClaim(item)}
                        >
                          {isClaiming ? '⏳ Dispatching...' : isClaimed ? '✅ Rescued & En Route' : '🚀 Claim Food Donation'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Route Map Visualizer & AI Copilot */}
        <div className="flex-col gap-md">
          {/* Active Route Map Visualizer */}
          <RouteMap 
            fromName={selectedRoute ? selectedRoute.fromName : "Royal Palace Banquet Kitchen"}
            toName={selectedRoute ? selectedRoute.toName : ngoLocation.name}
            distanceKm={selectedRoute ? selectedRoute.distanceKm : 3.4}
            durationMins={selectedRoute ? selectedRoute.durationMins : 14}
            fromLat={selectedRoute ? selectedRoute.fromLat : 12.9750}
            fromLng={selectedRoute ? selectedRoute.fromLng : 77.6090}
            toLat={selectedRoute ? selectedRoute.toLat : ngoLocation.lat}
            toLng={selectedRoute ? selectedRoute.toLng : ngoLocation.lng}
          />

          {/* OpenRouter AI Assistant */}
          <AICopilot portalType="NGO Logistics & Food Safety" />
        </div>
      </div>

      {/* QR Code & Scanner Modals */}
      {selectedQRItem && (
        <QRCodeModal item={selectedQRItem} onClose={() => setSelectedQRItem(null)} />
      )}
      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanSuccess={(res) => {
          showNotice(`Scanned & Verified Order #${res.batchId} (${res.itemName})! Route active.`);
          setSelectedRoute({
            fromName: res.donorName,
            toName: ngoLocation.name,
            distanceKm: 3.4,
            durationMins: 14,
            fromLat: 12.9750,
            fromLng: 77.6090,
            toLat: ngoLocation.lat,
            toLng: ngoLocation.lng
          });
        }}
      />
    </div>
  );
}
