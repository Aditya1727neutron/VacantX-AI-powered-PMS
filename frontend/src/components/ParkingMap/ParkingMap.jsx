import { useState } from 'react';
import { CarFront, LogIn, Accessibility, Zap } from 'lucide-react';
import ParkingSlot from './ParkingSlot';
import ZoneLabel from './ZoneLabel';
import './ParkingMap.css';

/**
 * Interactive parking map showing all slots in a campus layout.
 * Slots are color-coded: green (available), red (occupied).
 * Supports highlighting a recommended slot.
 */
export default function ParkingMap({ slots, recommendedSlotId, onSlotClick }) {
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Group slots by zone
  const zones = {};
  slots.forEach((slot) => {
    if (!zones[slot.zone]) zones[slot.zone] = [];
    zones[slot.zone].push(slot);
  });

  const zonePositions = {
    A: { label: 'Zone A', subtitle: 'Near Main Gate', gridArea: 'zA' },
    B: { label: 'Zone B', subtitle: 'Near North Gate', gridArea: 'zB' },
    C: { label: 'Zone C', subtitle: 'Faculty Parking', gridArea: 'zC' },
    D: { label: 'Zone D', subtitle: 'Near South Gate', gridArea: 'zD' },
  };

  // Gate positions — using Lucide icons instead of emojis
  const gates = [
    { id: 'gate_1', label: 'Main Gate', icon: CarFront, style: { left: '-40px', top: '50%', transform: 'translateY(-50%)' } },
    { id: 'gate_2', label: 'North Gate', icon: LogIn, style: { top: '-36px', right: '20%' } },
    { id: 'gate_3', label: 'South Gate', icon: LogIn, style: { bottom: '-36px', right: '20%' } },
  ];

  return (
    <div className="parking-map-wrapper">
      {/* Map header */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot occupied"></span>
          <span>Occupied</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot recommended"></span>
          <span>Recommended</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot handicap"></span>
          <span>Accessible</span>
        </div>
      </div>

      {/* The parking map */}
      <div className="parking-map">
        {/* Gates */}
        {gates.map((gate) => {
          const IconComp = gate.icon;
          return (
            <div key={gate.id} className="gate-marker" style={gate.style}>
              <span className="gate-icon"><IconComp size={14} /></span>
              <span className="gate-label">{gate.label}</span>
            </div>
          );
        })}

        {/* Road markings */}
        <div className="road road-horizontal"></div>
        <div className="road road-vertical"></div>

        {/* Zone grids */}
        {Object.entries(zones).map(([zone, zoneSlots]) => (
          <div key={zone} className={`zone-area zone-${zone.toLowerCase()}`}>
            <ZoneLabel
              label={zonePositions[zone]?.label || zone}
              subtitle={zonePositions[zone]?.subtitle || ''}
              slotCount={zoneSlots.length}
              availableCount={zoneSlots.filter(s => s.status === 'available').length}
            />
            <div className="zone-grid">
              {zoneSlots.map((slot) => (
                <ParkingSlot
                  key={slot.id}
                  slot={slot}
                  isRecommended={slot.id === recommendedSlotId}
                  isHovered={hoveredSlot === slot.id}
                  onMouseEnter={() => setHoveredSlot(slot.id)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  onClick={() => onSlotClick?.(slot)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hovered slot info */}
      {hoveredSlot && (
        <div className="slot-tooltip">
          {(() => {
            const s = slots.find(sl => sl.id === hoveredSlot);
            if (!s) return null;
            return (
              <>
                <strong>{s.label}</strong> · Zone {s.zone} ·{' '}
                <span className={s.status === 'available' ? 'text-success' : 'text-danger'}>
                  {s.status === 'available' ? '✓ Available' : '✗ Occupied'}
                </span>
                {s.slot_type === 'handicap' && (
                  <span className="slot-type-badge"> <Accessibility size={12} /></span>
                )}
                {s.slot_type === 'ev' && (
                  <span className="slot-type-badge"> <Zap size={12} /></span>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
