import { useEffect, useState } from 'react';
import { CircleCheck, CircleX, Hash } from 'lucide-react';
import './LiveCounter.css';

export default function LiveCounter({ stats }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 600);
    return () => clearTimeout(timer);
  }, [stats?.available, stats?.occupied]);

  if (!stats) return null;

  const percentage = stats.occupancy_rate || 0;

  // Unified thresholds: >70 red, >40 amber, else green
  const ringColor = percentage > 70
    ? 'var(--status-occupied)'
    : percentage > 40
    ? 'var(--status-reserved)'
    : 'var(--status-available)';

  // Tick marks at 0%, 25%, 50%, 75%, 100%
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="live-counter card">
      <div className="counter-header">
        <h4>Live Occupancy</h4>
        <span className="live-dot-container">
          <span className="live-dot"></span>
          <span className="text-eyebrow">LIVE</span>
        </span>
      </div>

      <div className="counter-ring-container">
        {/* Sensor-sweep pulse ring */}
        <svg className="counter-ring-pulse" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" className="ring-sweep" />
        </svg>
        <svg className="counter-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" className="ring-bg" />
          {/* Tick marks */}
          {ticks.map((t) => {
            const angle = (t / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 60 + 44 * Math.cos(rad);
            const y1 = 60 + 44 * Math.sin(rad);
            const x2 = 60 + 50 * Math.cos(rad);
            const y2 = 60 + 50 * Math.sin(rad);
            return (
              <line
                key={t}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          <circle
            cx="60" cy="60" r="50"
            className="ring-fill"
            style={{
              strokeDasharray: `${percentage * 3.14} 314`,
              stroke: ringColor,
            }}
          />
        </svg>
        <div className="counter-ring-text">
          <span className={`counter-pct tabular-nums ${animate ? 'counter-bump' : ''}`}>
            {Math.round(percentage)}%
          </span>
          <span className="counter-pct-label text-eyebrow">Occupied</span>
        </div>
      </div>

      <div className="counter-details">
        <div className="counter-detail">
          <CircleCheck size={12} className="detail-icon available" />
          <span className="detail-label">Available</span>
          <span className="detail-value tabular-nums">{stats.available}</span>
        </div>
        <div className="counter-detail">
          <CircleX size={12} className="detail-icon occupied" />
          <span className="detail-label">Occupied</span>
          <span className="detail-value tabular-nums">{stats.occupied}</span>
        </div>
        <div className="counter-detail">
          <Hash size={12} className="detail-icon total" />
          <span className="detail-label">Total</span>
          <span className="detail-value tabular-nums">{stats.total_slots}</span>
        </div>
      </div>
    </div>
  );
}
