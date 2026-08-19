export const mockAlerts = [
  {
    id: 'al-01', type: 'endangered_species', severity: 'critical', read: false,
    title: 'Critically low dhole pack size at Sathyamangalam',
    detail: 'Only three individuals detected across 14 nights, against a five-year mean of nine.',
    site: 'Moyar River Bank', species: 'Cuon alpinus', at: '2026-08-06T04:12:00Z',
  },
  {
    id: 'al-02', type: 'habitat_degradation', severity: 'critical', read: false,
    title: 'Riverbank vegetation loss crossed the 15% threshold',
    detail: 'Sentinel-2 composite shows an 18% NDVI drop over 90 days along a 2 km stretch.',
    site: 'Moyar River Bank', species: null, at: '2026-08-03T09:15:00Z',
  },
  {
    id: 'al-03', type: 'device_offline', severity: 'high', read: false,
    title: 'Camera trap CT-508 has not reported for 7 days',
    detail: 'Last sync 30 July, 22:05. Battery was at 11% on the final heartbeat.',
    site: 'Moyar River Bank', species: null, at: '2026-08-05T08:00:00Z',
  },
  {
    id: 'al-04', type: 'population_decline', severity: 'high', read: true,
    title: 'Leopard detections down 12% quarter on quarter',
    detail: 'Decline is consistent across four of six sites, so sampling effort is unlikely to explain it.',
    site: 'Landscape-wide', species: 'Panthera pardus fusca', at: '2026-08-01T06:30:00Z',
  },
  {
    id: 'al-05', type: 'endangered_species', severity: 'moderate', read: true,
    title: 'Purple frog chorus recorded outside the breeding window',
    detail: 'Acoustic match at 0.79 confidence on 18 June, three weeks later than the historical range.',
    site: 'Valparai Plateau, Anamalai', species: 'Nasikabatrachus sahyadrensis', at: '2026-07-19T23:11:00Z',
  },
  {
    id: 'al-06', type: 'habitat_degradation', severity: 'moderate', read: true,
    title: 'Fire scar detected in the Gudalur scrub belt',
    detail: 'Approximately 6 ha burned. No large-mammal detections in the affected cells since.',
    site: 'Gudalur Scrub Belt', species: null, at: '2026-07-09T08:00:00Z',
  },
  {
    id: 'al-07', type: 'device_offline', severity: 'low', read: true,
    title: 'Drone DR-009 grounded for scheduled maintenance',
    detail: 'Rotor service logged on 1 August. Avalanche Shola survey resumes 12 August.',
    site: 'Avalanche Shola, Nilgiris', species: null, at: '2026-08-01T11:25:00Z',
  },
];

export const alertTypeMeta = {
  endangered_species: { label: 'Endangered species', icon: 'ShieldAlert' },
  population_decline: { label: 'Population decline', icon: 'TrendingDown' },
  habitat_degradation: { label: 'Habitat degradation', icon: 'TreePine' },
  device_offline: { label: 'Device offline', icon: 'WifiOff' },
};
