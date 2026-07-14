import { useState } from 'react';
import { Map, AlertCircle, Accessibility, Zap, Car, Loader2, Lock, LockOpen } from 'lucide-react';
import ParkingMap from '../components/ParkingMap/ParkingMap';
import GateSelector from '../components/GateSelector/GateSelector';
import LiveCounter from '../components/Dashboard/LiveCounter';
import Loader from '../components/common/Loader';
import { useParking } from '../hooks/useParking';
import { updateSlotStatus } from '../api/parkingAPI';
import './MapPage.css';

export default function MapPage() {
  const { slots, stats, loading, error, refetch } = useParking();
  const [recommendedSlotId, setRecommendedSlotId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleRecommendation = (result) => {
    if (result.recommended_slot) {
      setRecommendedSlotId(result.recommended_slot.id);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleToggleStatus = async () => {
    if (!selectedSlot || updating) return;
    setUpdating(true);
    const newStatus = selectedSlot.status === 'available' ? 'occupied' : 'available';
    try {
      await updateSlotStatus(selectedSlot.id, newStatus);
      setSelectedSlot((prev) => ({ ...prev, status: newStatus }));
      refetch();
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader text="Loading parking map..." />;
  if (error) return <div className="page-container"><p className="error-text"><AlertCircle size={16} style={{ verticalAlign: 'middle' }} /> {error}</p></div>;

  return (
    <div className="map-page page-container">
      <div className="page-header">
        <h1><Map size={24} /> Parking Map</h1>
        <p>Real-time parking slot availability across all zones</p>
      </div>

      <div className="map-layout">
        <div className="map-main">
          <ParkingMap
            slots={slots}
            recommendedSlotId={recommendedSlotId}
            onSlotClick={handleSlotClick}
          />
        </div>

        <div className="map-sidebar">
          <LiveCounter stats={stats} />
          <GateSelector onRecommendation={handleRecommendation} />

          {selectedSlot && (
            <div className="slot-detail glass-card slide-up">
              <h4>Slot Details</h4>
              <div className="slot-detail-grid">
                <div className="detail-row">
                  <span className="detail-key">Label</span>
                  <span className="detail-val font-mono-stencil">{selectedSlot.label}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Zone</span>
                  <span className="detail-val">Zone {selectedSlot.zone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Status</span>
                  <span className={`badge ${selectedSlot.status === 'available' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedSlot.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Type</span>
                  <span className="detail-val">
                    {selectedSlot.slot_type === 'handicap' ? <><Accessibility size={12} /> Accessible</> :
                     selectedSlot.slot_type === 'ev' ? <><Zap size={12} /> EV Charging</> :
                     <><Car size={12} /> Standard</>}
                  </span>
                </div>
              </div>
              <button
                className={`btn ${selectedSlot.status === 'available' ? 'btn-danger' : 'btn-success'} btn-sm`}
                onClick={handleToggleStatus}
                disabled={updating}
                style={{ width: '100%', marginTop: 'var(--space-md)' }}
              >
                {updating
                  ? <><Loader2 size={14} className="spin-icon" /> Updating...</>
                  : selectedSlot.status === 'available'
                  ? <><Lock size={14} /> Mark Occupied</>
                  : <><LockOpen size={14} /> Mark Available</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
