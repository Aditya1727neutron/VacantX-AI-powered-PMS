/**
 * Utility helpers.
 */

export function formatTime(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function getStatusColor(status) {
  switch (status) {
    case 'available': return 'var(--status-available)';
    case 'occupied': return 'var(--status-occupied)';
    default: return 'var(--text-muted)';
  }
}

/**
 * Unified occupancy color thresholds:
 *   < 40% → green (available)
 *   40–70% → amber (filling up)
 *   > 70% → red (occupied/high)
 */
export function getOccupancyColor(pct) {
  if (pct < 40) return 'var(--status-available)';
  if (pct < 70) return 'var(--status-reserved)';
  return 'var(--status-occupied)';
}

export function getOccupancyLabel(pct) {
  if (pct < 40) return 'Low';
  if (pct < 70) return 'Moderate';
  return 'High';
}

/**
 * Badge CSS class for a given occupancy percentage.
 * Unified thresholds: <40% success, 40-70% warning, >70% danger.
 */
export function getOccupancyBadge(pct) {
  if (pct < 40) return 'badge-success';
  if (pct < 70) return 'badge-warning';
  return 'badge-danger';
}

/**
 * Sequential heatmap color scale for 0–100%.
 * Returns an actual color string (not a CSS variable) because
 * the heatmap needs direct interpolation for its data cells.
 */
export function getHeatmapColor(pct) {
  // Clamp to 0-100
  const v = Math.max(0, Math.min(100, pct));

  // 5-stop sequential scale:
  //   0%  → hsl(160, 45%, 32%)  deep teal-green
  //  25%  → hsl(130, 40%, 42%)  green
  //  50%  → hsl(45, 75%, 50%)   amber
  //  75%  → hsl(20, 65%, 48%)   orange
  // 100%  → hsl(5, 60%, 42%)    red
  const stops = [
    { pct: 0,   h: 160, s: 45, l: 32 },
    { pct: 25,  h: 130, s: 40, l: 42 },
    { pct: 50,  h: 45,  s: 75, l: 50 },
    { pct: 75,  h: 20,  s: 65, l: 48 },
    { pct: 100, h: 5,   s: 60, l: 42 },
  ];

  // Find surrounding stops
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i].pct && v <= stops[i + 1].pct) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }

  const t = hi.pct === lo.pct ? 0 : (v - lo.pct) / (hi.pct - lo.pct);
  const h = Math.round(lo.h + (hi.h - lo.h) * t);
  const s = Math.round(lo.s + (hi.s - lo.s) * t);
  const l = Math.round(lo.l + (hi.l - lo.l) * t);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Auto-contrast text color for heatmap cells.
 * Dark text for light backgrounds, white for dark.
 */
export function getHeatmapTextColor(pct) {
  // Values in the amber zone (30-60%) have lighter backgrounds
  if (pct >= 30 && pct <= 60) return '#1a1d23';
  // Low values (green) and high values (red) are dark enough for white text
  return '#ffffff';
}

export function todayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
