import { useState } from 'react';
import { Compass, CarFront, Car, CarTaxiFront, Search, Loader2, CircleCheck, AlertTriangle } from 'lucide-react';
import { getRecommendation } from '../../api/parkingAPI';
import './GateSelector.css';

export default function GateSelector({ onRecommendation }) {
  const [selectedGate, setSelectedGate] = useState('');
  const [preferredZone, setPreferredZone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const gates = [
    { id: 'gate_1', name: 'Main Gate (West)', icon: CarFront },
    { id: 'gate_2', name: 'North Gate', icon: Car },
    { id: 'gate_3', name: 'South Gate', icon: CarTaxiFront },
  ];

  const handleFind = async () => {
    if (!selectedGate) return;
    setLoading(true);
    try {
      const res = await getRecommendation(selectedGate, preferredZone || null);
      setResult(res.data);
      onRecommendation?.(res.data);
    } catch (err) {
      console.error('Recommendation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gate-selector glass-card">
      <h3 className="gate-title"><Compass size={18} /> Find Nearest Parking</h3>
      <p className="gate-subtitle">Select your entry gate to get the closest available slot</p>

      <div className="gate-form">
        <div className="gate-options">
          {gates.map((gate) => {
            const IconComp = gate.icon;
            return (
              <button
                key={gate.id}
                className={`gate-option ${selectedGate === gate.id ? 'gate-selected' : ''}`}
                onClick={() => setSelectedGate(gate.id)}
              >
                <span className="gate-option-icon"><IconComp size={20} /></span>
                <span className="gate-option-name">{gate.name}</span>
              </button>
            );
          })}
        </div>

        <div className="gate-row">
          <select
            className="select-field"
            value={preferredZone}
            onChange={(e) => setPreferredZone(e.target.value)}
          >
            <option value="">Any Zone</option>
            <option value="A">Zone A</option>
            <option value="B">Zone B</option>
            <option value="C">Zone C</option>
            <option value="D">Zone D</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleFind}
            disabled={!selectedGate || loading}
          >
            {loading ? <><Loader2 size={14} className="spin-icon" /> Finding...</> : <><Search size={14} /> Find Slot</>}
          </button>
        </div>
      </div>

      {result && result.recommended_slot && (
        <div className="recommendation-result slide-up">
          <div className="rec-header">
            <span className="rec-icon-wrap"><CircleCheck size={20} /></span>
            <div>
              <strong className="rec-slot">{result.recommended_slot.label}</strong>
              <span className="rec-zone">Zone {result.recommended_slot.zone}</span>
            </div>
          </div>
          <p className="rec-message">{result.message}</p>
          {result.alternatives.length > 0 && (
            <div className="rec-alternatives">
              <span className="rec-alt-label">Alternatives:</span>
              {result.alternatives.map((alt, i) => (
                <span key={i} className="badge badge-info">{alt.label}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {result && !result.recommended_slot && (
        <div className="recommendation-result rec-empty slide-up">
          <span className="rec-icon-wrap rec-warn"><AlertTriangle size={20} /></span>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}
