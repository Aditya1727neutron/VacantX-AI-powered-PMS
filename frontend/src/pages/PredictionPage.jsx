import { BarChart3, BrainCircuit, Lightbulb, Sunrise, CalendarDays, ParkingCircle, Clock } from 'lucide-react';
import PredictionChart from '../components/Prediction/PredictionChart';
import OccupancyHeatmap from '../components/Prediction/OccupancyHeatmap';
import './PredictionPage.css';

export default function PredictionPage() {
  return (
    <div className="prediction-page page-container">
      <div className="page-header">
        <h1><BarChart3 size={24} /> Occupancy Predictions</h1>
        <p>AI-powered parking occupancy forecasts and trend analysis</p>
      </div>

      <div className="prediction-info glass-card fade-in">
        <div className="info-icon-wrap">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h4>How it works</h4>
          <p>
            Our AI model analyzes historical parking data — including time of day, day of week,
            semester periods, and zone proximity — to predict occupancy trends. Use these insights
            to plan your parking and avoid peak hours.
          </p>
        </div>
      </div>

      <div className="prediction-grid">
        <div className="slide-up">
          <PredictionChart />
        </div>
        <div className="slide-up" style={{ animationDelay: '0.15s' }}>
          <OccupancyHeatmap />
        </div>
      </div>

      <div className="prediction-tips glass-card slide-up" style={{ animationDelay: '0.3s' }}>
        <h3><Lightbulb size={18} /> Parking Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon-wrap"><Sunrise size={20} /></span>
            <h4>Arrive Early</h4>
            <p>Parking before 8 AM guarantees spots in all zones.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon-wrap"><CalendarDays size={20} /></span>
            <h4>Avoid Tuesdays</h4>
            <p>Midweek days typically see the highest occupancy.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon-wrap"><ParkingCircle size={20} /></span>
            <h4>Try Zone D</h4>
            <p>Zone D near the South Gate is usually the least crowded.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon-wrap"><Clock size={20} /></span>
            <h4>After 5 PM</h4>
            <p>Evening slots free up quickly — great for library sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
