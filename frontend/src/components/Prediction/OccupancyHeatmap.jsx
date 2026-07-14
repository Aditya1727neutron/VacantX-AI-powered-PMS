import { useState, useEffect } from 'react';
import { Thermometer } from 'lucide-react';
import { getPredictions } from '../../api/parkingAPI';
import { formatTime, todayString, getHeatmapColor, getHeatmapTextColor } from '../../utils/helpers';
import './OccupancyHeatmap.css';

export default function OccupancyHeatmap() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPredictions(selectedDate, 6, 21);
      setData(res.data.predictions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const zones = ['A', 'B', 'C', 'D'];
  const hours = [...new Set(data.map((d) => d.hour))].sort((a, b) => a - b);

  const getCell = (zone, hour) => {
    const cell = data.find((d) => d.zone === zone && d.hour === hour);
    return cell ? cell.occupancy_pct : 0;
  };

  return (
    <div className="heatmap glass-card">
      <div className="heatmap-header">
        <div>
          <h3><Thermometer size={18} /> Occupancy Heatmap</h3>
          <p className="heatmap-subtitle">Hourly occupancy intensity by zone</p>
        </div>
        <input
          type="date"
          className="input-field"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ width: '160px' }}
        />
      </div>

      {loading ? (
        <div className="chart-loading">
          <div className="loader-spinner"></div>
        </div>
      ) : (
        <div className="heatmap-scroll">
          <table className="heatmap-table">
            <thead>
              <tr>
                <th className="heatmap-corner"></th>
                {hours.map((h) => (
                  <th key={h} className="heatmap-hour-label">
                    {formatTime(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone}>
                  <td className="heatmap-zone-label">Zone {zone}</td>
                  {hours.map((hour) => {
                    const val = getCell(zone, hour);
                    const bgColor = getHeatmapColor(val);
                    const textColor = getHeatmapTextColor(val);
                    return (
                      <td
                        key={`${zone}-${hour}`}
                        className="heatmap-data"
                        style={{
                          background: bgColor,
                          color: textColor,
                        }}
                        title={`Zone ${zone} at ${formatTime(hour)}: ${val}%`}
                      >
                        <span className="heatmap-val">{Math.round(val)}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Low</span>
        <div className="heatmap-gradient"></div>
        <span className="heatmap-legend-label">High</span>
      </div>
    </div>
  );
}
