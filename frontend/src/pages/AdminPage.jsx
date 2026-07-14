import { useState, useEffect } from 'react';
import { Settings, Lock, Loader2, Dices, RotateCcw, RefreshCw, ParkingCircle, CircleCheck, Car, BarChart3 } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import { getAdminDashboard, simulateParking, resetAllSlots } from '../api/parkingAPI';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getOccupancyBadge } from '../utils/helpers';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboard();
      setDashboard(res.data);
      setLogs(res.data.recent_logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      await simulateParking();
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all slots to available?')) return;
    setResetting(true);
    try {
      await resetAllSlots();
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container admin-login-prompt">
        <div className="glass-card prompt-card">
          <span className="prompt-icon-wrap"><Lock size={28} /></span>
          <h2>Admin Access Required</h2>
          <p>Please sign in with an admin account to access this panel.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats;

  return (
    <div className="admin-page page-container">
      <div className="page-header">
        <h1><Settings size={24} style={{ verticalAlign: 'middle', marginRight: 'var(--space-xs)' }} /> Admin Dashboard</h1>
        <p>Manage parking slots, monitor usage, and run simulations</p>
      </div>

      {/* Actions */}
      <div className="admin-actions fade-in">
        <button
          className="btn btn-primary"
          onClick={handleSimulate}
          disabled={simulating}
        >
          {simulating ? <><Loader2 size={14} className="spin-icon" /> Simulating...</> : <><Dices size={14} /> Simulate Changes</>}
        </button>
        <button
          className="btn btn-success"
          onClick={handleReset}
          disabled={resetting}
        >
          {resetting ? <><Loader2 size={14} className="spin-icon" /> Resetting...</> : <><RotateCcw size={14} /> Reset All Slots</>}
        </button>
        <button className="btn btn-ghost" onClick={fetchDashboard}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid-4 admin-stats slide-up">
          <StatsCard icon={<ParkingCircle size={20} />} label="Total Slots" value={stats.total_slots} />
          <StatsCard icon={<CircleCheck size={20} />} label="Available" value={stats.available} />
          <StatsCard icon={<Car size={20} />} label="Occupied" value={stats.occupied} />
          <StatsCard icon={<BarChart3 size={20} />} label="Occupancy" value={`${stats.occupancy_rate}%`} />
        </div>
      )}

      {/* Zone breakdown */}
      {stats?.zones && (
        <div className="admin-zones glass-card slide-up">
          <h3>Zone Breakdown</h3>
          <div className="zone-table">
            <div className="zone-table-header">
              <span>Zone</span>
              <span>Total</span>
              <span>Available</span>
              <span>Occupied</span>
              <span>Occupancy</span>
            </div>
            {Object.entries(stats.zones).map(([zone, data]) => (
              <div key={zone} className="zone-table-row">
                <span className="zone-name-cell">Zone {zone}</span>
                <span className="tabular-nums">{data.total}</span>
                <span className="text-success tabular-nums">{data.available}</span>
                <span className="text-danger tabular-nums">{data.occupied}</span>
                <span>
                  <span className={`badge ${getOccupancyBadge(data.occupancy_rate)}`}>
                    {data.occupancy_rate}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Logs */}
      <div className="admin-logs glass-card slide-up">
        <h3>Recent Activity</h3>
        {logs.length === 0 ? (
          <p className="no-logs">No recent activity</p>
        ) : (
          <div className="logs-list">
            {logs.map((log) => (
              <div key={log.id} className="log-item">
                <div className="log-indicator">
                  <span className={`log-dot ${log.new_status === 'occupied' ? 'occupied' : 'available'}`}></span>
                </div>
                <div className="log-content">
                  <span className="log-slot">{log.slot_label}</span>
                  <span className="log-change font-mono-stencil">
                    {log.previous_status} → {log.new_status}
                  </span>
                </div>
                <span className="log-zone badge badge-info">Zone {log.zone}</span>
                <span className="log-time">
                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
