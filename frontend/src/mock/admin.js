import { ROLES } from '../utils/constants';

export const platformStats = {
  users: 48, activeSurveys: 12, devices: 96, devicesOnline: 89,
  imagesProcessed: 184320, audioHours: 2410, apiCalls24h: 51280,
  avgImageLatencyMs: 412, avgAudioLatencyMs: 890, uptime: 99.94, storageUsedTb: 3.7,
};

export const usageByDay = [
  { day: 'Thu', images: 2140, audio: 310 },
  { day: 'Fri', images: 2480, audio: 366 },
  { day: 'Sat', images: 3110, audio: 402 },
  { day: 'Sun', images: 2960, audio: 388 },
  { day: 'Mon', images: 3420, audio: 441 },
  { day: 'Tue', images: 3180, audio: 420 },
  { day: 'Wed', images: 3605, audio: 468 },
];

export const managedUsers = [
  { id: 'u-01', name: 'Dr. Anitha Raghavan', email: 'anitha@wildlife.org', role: ROLES.RESEARCHER, org: 'Salim Ali Centre', status: 'active', lastActive: '2026-08-06T06:10:00Z' },
  { id: 'u-02', name: 'Karthik Menon', email: 'karthik@conserve.in', role: ROLES.CONSERVATION, org: 'WG Conservation Trust', status: 'active', lastActive: '2026-08-06T05:02:00Z' },
  { id: 'u-03', name: 'R. Selvaraj IFS', email: 'selvaraj@tnforest.gov.in', role: ROLES.FOREST, org: 'TN Forest Department', status: 'active', lastActive: '2026-08-05T19:31:00Z' },
  { id: 'u-04', name: 'Priya Nair', email: 'priya@wildlife.org', role: ROLES.ADMIN, org: 'WPIS Platform Team', status: 'active', lastActive: '2026-08-06T06:44:00Z' },
  { id: 'u-05', name: 'Meera Iyer', email: 'meera@wildlife.org', role: ROLES.RESEARCHER, org: 'ATREE', status: 'invited', lastActive: null },
  { id: 'u-06', name: 'Joseph Thomas', email: 'joseph@keralaforest.gov.in', role: ROLES.FOREST, org: 'Kerala Forest Department', status: 'suspended', lastActive: '2026-06-14T12:00:00Z' },
  { id: 'u-07', name: 'Nandita Bose', email: 'nandita@conserve.in', role: ROLES.CONSERVATION, org: 'WG Conservation Trust', status: 'active', lastActive: '2026-08-04T15:20:00Z' },
];

export const systemDevices = [
  { id: 'CT-441', type: 'Camera trap', site: 'Kargudi Range', battery: 78, status: 'online', firmware: 'v3.2.1' },
  { id: 'AS-118', type: 'Acoustic sensor', site: 'Valparai Plateau', battery: 64, status: 'online', firmware: 'v2.9.0' },
  { id: 'DR-009', type: 'Drone', site: 'Avalanche Shola', battery: 100, status: 'maintenance', firmware: 'v1.7.4' },
  { id: 'CT-508', type: 'Camera trap', site: 'Moyar River Bank', battery: 11, status: 'offline', firmware: 'v3.1.8' },
  { id: 'CT-233', type: 'Camera trap', site: 'Thekkady Fringe', battery: 91, status: 'online', firmware: 'v3.2.1' },
];
