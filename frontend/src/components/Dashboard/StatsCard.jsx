import './StatsCard.css';

export default function StatsCard({ icon, label, value, subtext }) {
  return (
    <div className="stats-card card">
      <div className="stats-icon-wrap">
        {icon}
      </div>
      <div className="stats-info">
        <span className="stats-label text-eyebrow">{label}</span>
        <span className="stats-value tabular-nums">{value}</span>
        {subtext && <span className="stats-subtext">{subtext}</span>}
      </div>
    </div>
  );
}
