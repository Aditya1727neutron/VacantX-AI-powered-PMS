import { Car, Check, Accessibility, Zap } from 'lucide-react';
import './ParkingSlot.css';

/**
 * Individual parking slot rendered as a small rectangular space.
 * Uses icon + color (not color alone) for accessibility.
 * Keyboard-navigable: Tab to focus, Enter/Space to select.
 */
export default function ParkingSlot({
  slot,
  isRecommended,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const statusClass = slot.status === 'available' ? 'slot-available' : 'slot-occupied';
  const recommendedClass = isRecommended ? 'slot-recommended' : '';
  const isHandicap = slot.slot_type === 'handicap';
  const isEV = slot.slot_type === 'ev';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={`parking-slot ${statusClass} ${recommendedClass} ${isHovered ? 'slot-hovered' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Slot ${slot.label}, ${slot.status}${isHandicap ? ', accessible' : ''}${isEV ? ', EV charging' : ''}${isRecommended ? ', recommended' : ''}`}
      title={`${slot.label} — ${slot.status}`}
    >
      <span className="slot-label font-mono-stencil">{slot.label.split('-')[1]}</span>
      {isHandicap && <span className="slot-type-icon"><Accessibility size={9} /></span>}
      {isEV && <span className="slot-type-icon"><Zap size={9} /></span>}
      <span className="slot-status-icon">
        {slot.status === 'available' ? <Check size={10} /> : <Car size={10} />}
      </span>
    </div>
  );
}
