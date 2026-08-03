import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, BarChart3, ParkingCircle, CircleCheck, Car, Compass, BrainCircuit, Zap, Smartphone, Lock, Clock, ShieldAlert, X } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import LiveCounter from '../components/Dashboard/LiveCounter';
import { useParking } from '../hooks/useParking';
import { getOccupancyBadge } from '../utils/helpers';
import './HomePage.css';

export default function HomePage() {
  const { stats, loading } = useParking();
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show "Access Denied" toast when redirected from admin page
  useEffect(() => {
    if (location.state?.accessDenied) {
      setAccessDenied(true);
      // Clear the navigation state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setAccessDenied(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="home-page page-container">
      {/* Access Denied Toast */}
      {accessDenied && (
        <div className="access-denied-toast fade-in">
          <ShieldAlert size={18} />
          <span>Access Denied — You do not have admin privileges to view that page.</span>
          <button className="toast-close" onClick={() => setAccessDenied(false)} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}
      {/* Hero */}
      <section className="hero fade-in">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            University Campus Parking System
          </div>
          <h1 className="hero-title">
            Smart Parking<br />
            <span className="hero-gradient">Made Effortless</span>
          </h1>
          <p className="hero-description">
            Real-time parking availability, AI-powered occupancy predictions, and
            intelligent slot recommendations — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/map" className="btn btn-primary btn-lg">
              <Map size={16} /> View Parking Map
            </Link>
            <Link to="/predictions" className="btn btn-ghost btn-lg">
              <BarChart3 size={16} /> View Predictions
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <LiveCounter stats={stats} />
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="stats-section">
          <div className="grid-4">
            <div className="stagger-in" style={{ animationDelay: '0s' }}>
              <StatsCard
                icon={<ParkingCircle size={20} />}
                label="Total Slots"
                value={stats.total_slots}
                subtext="Across 4 zones"
              />
            </div>
            <div className="stagger-in" style={{ animationDelay: '0.08s' }}>
              <StatsCard
                icon={<CircleCheck size={20} />}
                label="Available"
                value={stats.available}
                subtext="Ready to park"
              />
            </div>
            <div className="stagger-in" style={{ animationDelay: '0.16s' }}>
              <StatsCard
                icon={<Car size={20} />}
                label="Occupied"
                value={stats.occupied}
                subtext="Currently in use"
              />
            </div>
            <div className="stagger-in" style={{ animationDelay: '0.24s' }}>
              <StatsCard
                icon={<BarChart3 size={20} />}
                label="Occupancy Rate"
                value={`${stats.occupancy_rate}%`}
                subtext={stats.occupancy_rate > 70 ? 'High demand' : 'Normal'}
              />
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">
          Everything you need for efficient parking management
        </p>
        <div className="grid-3">
          <div className="feature-card glass-card">
            <span className="feature-icon-wrap"><Map size={22} /></span>
            <h3>Real-Time Map</h3>
            <p>
              Interactive parking map with color-coded slots updated in real-time
              via WebSocket connections.
            </p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon-wrap"><Compass size={22} /></span>
            <h3>Smart Navigation</h3>
            <p>
              Select your entry gate and instantly get the nearest available
              parking slot recommendation.
            </p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon-wrap"><BrainCircuit size={22} /></span>
            <h3>AI Predictions</h3>
            <p>
              Machine learning model predicts occupancy trends, peak hours, and
              the best times to find parking.
            </p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon-wrap"><Zap size={22} /></span>
            <h3>Instant Updates</h3>
            <p>
              WebSocket-powered live updates ensure you always see the latest
              slot availability without refreshing.
            </p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon-wrap"><Smartphone size={22} /></span>
            <h3>Responsive Design</h3>
            <p>
              Access the parking system from any device — desktop, tablet, or
              mobile phone.
            </p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon-wrap"><Lock size={22} /></span>
            <h3>Secure Access</h3>
            <p>
              JWT-based authentication with role-based access for users and
              administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Zone Overview */}
      {stats?.zones && (
        <section className="zones-section slide-up">
          <h2 className="section-title">Zone Overview</h2>
          <div className="grid-4">
            {Object.entries(stats.zones).map(([zone, zoneData]) => (
              <div key={zone} className="zone-card glass-card">
                <div className="zone-card-header">
                  <h4>Zone {zone}</h4>
                  <span className={`badge ${getOccupancyBadge(zoneData.occupancy_rate)}`}>
                    {zoneData.occupancy_rate}%
                  </span>
                </div>
                <div className="zone-card-bar">
                  <div
                    className="zone-card-bar-fill"
                    style={{ width: `${zoneData.occupancy_rate}%` }}
                  ></div>
                </div>
                <div className="zone-card-stats">
                  <span className="tabular-nums">{zoneData.available} available</span>
                  <span className="tabular-nums">{zoneData.occupied} occupied</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section glass-card">
        <div className="cta-content">
          <h2>Ready to find your spot?</h2>
          <p>Open the parking map to see real-time availability and get directions.</p>
          <Link to="/map" className="btn btn-primary btn-lg">
            Open Parking Map →
          </Link>
        </div>
        <div className="cta-time">
          <span className="cta-clock"><Clock size={28} /></span>
          <span className="cta-time-text tabular-nums">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span className="cta-date-text">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </section>
    </div>
  );
}
