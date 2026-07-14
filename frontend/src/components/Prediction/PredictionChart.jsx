import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { getPredictions } from '../../api/parkingAPI';
import { formatTime, todayString } from '../../utils/helpers';
import './PredictionChart.css';

export default function PredictionChart() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('line'); // 'line' or 'area'

  useEffect(() => {
    fetchPredictions();
  }, [selectedDate]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const res = await getPredictions(selectedDate);
      const predictions = res.data.predictions;
      setSummary(res.data.summary);

      // Transform data for Recharts: group by hour
      const hourMap = {};
      predictions.forEach((p) => {
        if (!hourMap[p.hour]) {
          hourMap[p.hour] = { hour: p.hour, label: formatTime(p.hour) };
        }
        hourMap[p.hour][`zone_${p.zone}`] = p.occupancy_pct;
      });

      setData(Object.values(hourMap));
    } catch (err) {
      console.error('Prediction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const zoneColors = {
    A: '#2a7a4f',
    B: '#5a7fb8',
    C: '#c49a3c',
    D: '#b85c4a',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="chart-tooltip glass-card">
        <p className="tooltip-time">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="tooltip-row">
            <span className="tooltip-dot" style={{ background: entry.color }}></span>
            <span className="tooltip-zone">{entry.name.replace('zone_', 'Zone ')}</span>
            <span className="tooltip-value tabular-nums">{entry.value?.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="prediction-chart">
      <div className="chart-header">
        <div>
          <h3><TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: 'var(--space-xs)' }} /> Occupancy Forecast</h3>
          <p className="chart-subtitle">Predicted parking occupancy by zone</p>
        </div>
        <div className="chart-controls">
          <input
            type="date"
            className="input-field"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '160px' }}
          />
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'line' ? 'active' : ''}`}
              onClick={() => setViewMode('line')}
            >
              Line
            </button>
            <button
              className={`toggle-btn ${viewMode === 'area' ? 'active' : ''}`}
              onClick={() => setViewMode('area')}
            >
              Area
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="chart-loading">
          <div className="loader-spinner"></div>
          <p>Loading predictions...</p>
        </div>
      ) : data ? (
        <>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              {viewMode === 'line' ? (
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {Object.entries(zoneColors).map(([zone, color]) => (
                    <Line
                      key={zone}
                      type="monotone"
                      dataKey={`zone_${zone}`}
                      name={`zone_${zone}`}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: color }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {Object.entries(zoneColors).map(([zone, color]) => (
                    <Area
                      key={zone}
                      type="monotone"
                      dataKey={`zone_${zone}`}
                      name={`zone_${zone}`}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {summary && (
            <div className="chart-summary">
              <div className="summary-item">
                <span className="summary-label">Avg Occupancy</span>
                <span className="summary-value tabular-nums">{summary.average_occupancy}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Peak Hour</span>
                <span className="summary-value highlight-danger tabular-nums">{formatTime(summary.peak_hour)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Peak Occupancy</span>
                <span className="summary-value highlight-danger tabular-nums">{summary.peak_occupancy}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Best Time to Park</span>
                <span className="summary-value highlight-success tabular-nums">{formatTime(summary.best_hour)}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="chart-error">No prediction data available</p>
      )}
    </div>
  );
}
