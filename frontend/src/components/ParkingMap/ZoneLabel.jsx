import { getOccupancyColor } from '../../utils/helpers';
import './ZoneLabel.css';

export default function ZoneLabel({ label, subtitle, slotCount, availableCount }) {
  const occupancy = slotCount > 0 ? Math.round(((slotCount - availableCount) / slotCount) * 100) : 0;
  const barColor = getOccupancyColor(occupancy);

  return (
    <div className="zone-label">
      <div className="zone-label-left">
        <h4 className="zone-name">{label}</h4>
        <span className="zone-subtitle">{subtitle}</span>
      </div>
      <div className="zone-label-right">
        <span className="zone-count">{availableCount}/{slotCount}</span>
        <div className="zone-bar">
          <div className="zone-bar-fill" style={{ width: `${occupancy}%`, background: barColor }}></div>
        </div>
      </div>
    </div>
  );
}
