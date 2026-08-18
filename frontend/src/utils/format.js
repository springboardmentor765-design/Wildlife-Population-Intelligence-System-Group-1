import { HEALTH_BANDS } from './constants';

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

export const timeAgo = (iso) => {
  const mins = Math.round((Date.now() - new Date(iso)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
};

export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n);

export const formatCoords = (lat, lng) =>
  `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`;

export const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const healthBand = (score) => HEALTH_BANDS.find((b) => score >= b.min) ?? HEALTH_BANDS.at(-1);

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export const confidenceTone = (c) =>
  c >= 0.9 ? 'text-moss-600' : c >= 0.75 ? 'text-clay-500' : 'text-orange-600';
