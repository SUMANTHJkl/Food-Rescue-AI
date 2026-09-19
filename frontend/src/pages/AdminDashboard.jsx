import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import ImpactCharts from '../components/ImpactCharts';
import AlertsPanel from '../components/AlertsPanel';
import SurplusTable from '../components/SurplusTable';
import AICopilot from '../components/AICopilot';
import RouteMap from '../components/RouteMap';
import { getAnalyticsSummary, getSurplus, getAlerts } from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_surplus_kg: 1845.0,
    consumable_kg: 1420.0,
    biowaste_kg: 425.0,
    total_plates: 7380,
    active_kitchens: 14,
    registered_ngos: 9,
    partner_farmers: 6,
    active_alerts: 3
  });

  const [surplusList, setSurplusList] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Fallback data for robust demo
  const mockAlerts = [
    {
      id: 1,
      alert_type: 'EXPIRE_SOON',
      severity: 'HIGH',
      message: 'Paneer Butter Masala at Royal Palace Banquet expires in < 2 hours (120 plates)',
      created_at: '2026-09-19T11:45:00'
    },
    {
      id: 2,
      alert_type: 'BIOWASTE_ROUTED',
      severity: 'MEDIUM',
      message: 'Spoiled Rice Batch #804 (45kg) rerouted to Bio-Cycle Farmer Hub for Cattle/Manure',
      created_at: '2026-09-19T11:30:00'
    },
    {
      id: 3,
      alert_type: 'HIGH_DEMAND_ZONE',
      severity: 'INFO',
      message: 'NGO Relief Hub Sector 4 requested +300 plates for evening distribution',
      created_at: '2026-09-19T11:15:00'
    }
  ];

  const mockSurplus = [
    { id: 1, food_type: 'VEG_CURRY', item_name: 'Paneer Masala', quantity_kg: 25.0, plates_count: 100, safety_score: 94, safety_class: 'CONSUMABLE', status: 'AVAILABLE', donor_name: 'Royal Palace' },
    { id: 2, food_type: 'RICE', item_name: 'Fried Rice', quantity_kg: 35.0, plates_count: 140, safety_score: 42, safety_class: 'DISCARD', status: 'BIOWASTE_AVAILABLE', donor_name: 'Grand Pavilion' },
    { id: 3, food_type: 'BREAD', item_name: 'Wheat Roti & Naan', quantity_kg: 18.0, plates_count: 72, safety_score: 88, safety_class: 'CONSUMABLE', status: 'CLAIMED', donor_name: 'TechPark Cafe' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, surplusData, alertsData] = await Promise.allSettled([
        getAnalyticsSummary(),
        getSurplus(),
        getAlerts()
      ]);

      if (analyticsData.status === 'fulfilled' && analyticsData.value) {
        setStats(prev => ({ ...prev, ...analyticsData.value }));
      }

      if (surplusData.status === 'fulfilled' && Array.isArray(surplusData.value)) {
        setSurplusList(surplusData.value.length > 0 ? surplusData.value : mockSurplus);
      } else {
        setSurplusList(mockSurplus);
      }

      if (alertsData.status === 'fulfilled' && Array.isArray(alertsData.value)) {
        setAlerts(alertsData.value.length > 0 ? alertsData.value : mockAlerts);
      } else {
        setAlerts(mockAlerts);
      }
    } catch (err) {
      console.warn('Using fallback admin dataset:', err);
      setSurplusList(mockSurplus);
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container fade-in">
      {/* Executive Command Header */}
      <div className="portal-header card glow-box margin-bottom-lg flex justify-between items-center wrap-gap">
        <div>
          <div className="flex items-center gap-xs">
            <span className="badge badge-emerald">SIH 2026 PS-26234 Command Center</span>
            <span className="badge badge-teal">Live Telemetry Active</span>
          </div>
          <h1 className="text-3xl font-bold margin-top-xs">
            ⚡ Food Rescue AI Executive Operations
          </h1>
          <p className="text-muted text-sm margin-top-xs">
            Real-time monitoring across Donors, NGOs, Bio-Cycle Farmers, OpenRouter AI & Safety Gates
          </p>
        </div>

        <div className="flex gap-xs">
          <button 
            className={`btn ${activeTab === 'OVERVIEW' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('OVERVIEW')}
          >
            📊 Operations Overview
          </button>
          <button 
            className={`btn ${activeTab === 'SURPLUS_AUDIT' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('SURPLUS_AUDIT')}
          >
            🍲 Surplus Audit
          </button>
          <button 
            className={`btn ${activeTab === 'BIOWASTE_HUB' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('BIOWASTE_HUB')}
          >
            🌾 Bio-Cycle Routing
          </button>
        </div>
      </div>

      {/* High-level KPI Cards */}
      <div className="margin-bottom-lg">
        <StatsCards stats={stats} />
      </div>

      {/* Main Tab Views */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-2 gap-lg align-start">
          {/* Left: Recharts Visualizations */}
          <div className="flex-col gap-md">
            <ImpactCharts />

            {/* System Status Indicators */}
            <div className="card">
              <h3 className="text-lg font-bold margin-bottom-sm flex items-center gap-xs">
                🔌 System Infrastructure & Backend Health
              </h3>
              <div className="grid grid-2 gap-sm text-sm">
                <div className="glass-panel p-3 rounded flex justify-between items-center">
                  <span>InsForge Database:</span>
                  <span className="badge badge-emerald">Connected (PostgreSQL)</span>
                </div>
                <div className="glass-panel p-3 rounded flex justify-between items-center">
                  <span>OpenRouter AI Engine:</span>
                  <span className="badge badge-teal">Online (gpt-4o-mini)</span>
                </div>
                <div className="glass-panel p-3 rounded flex justify-between items-center">
                  <span>MongoDB Audit Trail:</span>
                  <span className="badge badge-emerald">Active Logging</span>
                </div>
                <div className="glass-panel p-3 rounded flex justify-between items-center">
                  <span>Bio-Cycle Safety Gates:</span>
                  <span className="badge badge-emerald">Enforced (Auto-Reroute)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Alerts & AI Executive Copilot */}
          <div className="flex-col gap-md">
            <AlertsPanel alerts={alerts} />
            <AICopilot portalType="Admin Executive Strategy & Network Optimization" />
          </div>
        </div>
      )}

      {activeTab === 'SURPLUS_AUDIT' && (
        <div className="flex-col gap-md">
          <SurplusTable surplusItems={surplusList} />
        </div>
      )}

      {activeTab === 'BIOWASTE_HUB' && (
        <div className="grid grid-2 gap-lg align-start">
          <div className="card glow-box">
            <h2 className="text-xl font-bold margin-bottom-sm text-amber-400">
              🌾 Rational Bio-Cycle & Farmer Rerouting Network
            </h2>
            <p className="text-sm text-muted margin-bottom-md">
              When food fails safety checks (`safety_score &lt; 60%`), our automated safety gate locks it from human consumption and automatically converts it into Bio-Waste listings available for local verified farmers for compost/manure and animal feed.
            </p>

            <div className="flex-col gap-sm">
              <div className="glass-panel p-4 rounded-lg border border-amber-500/30 flex justify-between items-center">
                <div>
                  <span className="badge badge-warning">DISCARD REROUTED</span>
                  <h4 className="font-bold text-amber-300 margin-top-xs">Spoiled Cooked Rice & Gravy (45 kg)</h4>
                  <p className="text-xs text-muted">Donor: Grand Pavilion Hotel • Claimed by: Green Earth Organic Farm</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-emerald">Converted: Manure</span>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-lg border border-amber-500/30 flex justify-between items-center">
                <div>
                  <span className="badge badge-warning">DISCARD REROUTED</span>
                  <h4 className="font-bold text-amber-300 margin-top-xs">Over-ripe Bananas & Fruit Pulp (28 kg)</h4>
                  <p className="text-xs text-muted">Donor: FreshMarket Distribution • Claimed by: Nandi Dairy & Cattle Feed</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-emerald">Converted: Animal Feed</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <RouteMap 
              fromAddress="Grand Pavilion Hotel, Central Bengaluru"
              toAddress="Green Earth Organic Farm, Devanahalli"
              distanceKm={24.5}
              estimatedTimeMinutes={45}
              fromLat={12.9715}
              fromLng={77.6070}
              toLat={13.2450}
              toLng={77.7120}
            />
          </div>
        </div>
      )}
    </div>
  );
}
