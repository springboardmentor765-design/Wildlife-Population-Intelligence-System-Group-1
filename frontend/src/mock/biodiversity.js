export const biodiversityIndices = [
  { key: 'shannon', label: 'Shannon index (H′)', value: 3.12, max: 4.5, delta: 0.08,
    hint: 'Species evenness across all analysed detections this quarter.' },
  { key: 'simpson', label: 'Simpson index (1−D)', value: 0.87, max: 1, delta: 0.02,
    hint: 'Probability two random detections belong to different species.' },
  { key: 'richness', label: 'Species richness (S)', value: 94, max: 120, delta: 5,
    hint: 'Distinct species confirmed at 0.75 confidence or above.' },
  { key: 'evenness', label: "Pielou's evenness (J′)", value: 0.79, max: 1, delta: -0.03,
    hint: 'How equally individuals are spread across the species present.' },
];

export const habitatPanels = [
  { id: 'h1', site: 'Kargudi Range, Mudumalai', type: 'Tropical dry deciduous',
    quality: 82, canopyCover: 64, vegetationIndex: 0.71, waterAvailability: 'Adequate',
    fragmentation: 'Low', trend: 'stable' },
  { id: 'h2', site: 'Valparai Plateau, Anamalai', type: 'Moist evergreen',
    quality: 74, canopyCover: 81, vegetationIndex: 0.78, waterAvailability: 'Abundant',
    fragmentation: 'Moderate', trend: 'improving' },
  { id: 'h3', site: 'Avalanche Shola, Nilgiris', type: 'Montane shola grassland',
    quality: 58, canopyCover: 42, vegetationIndex: 0.53, waterAvailability: 'Seasonal',
    fragmentation: 'High', trend: 'declining' },
  { id: 'h4', site: 'Moyar River Bank', type: 'Riverine / wetland',
    quality: 47, canopyCover: 29, vegetationIndex: 0.41, waterAvailability: 'Stressed',
    fragmentation: 'High', trend: 'declining' },
];

export const degradationAlerts = [
  { id: 'dg1', site: 'Moyar River Bank', severity: 'critical',
    detected: '2026-08-03T09:15:00Z', change: '−18% NDVI over 90 days',
    cause: 'Invasive Prosopis spread and riverbank grazing pressure' },
  { id: 'dg2', site: 'Avalanche Shola, Nilgiris', severity: 'high',
    detected: '2026-07-21T14:40:00Z', change: '−9% canopy cover',
    cause: 'Exotic plantation encroachment on shola edges' },
  { id: 'dg3', site: 'Gudalur Scrub Belt', severity: 'moderate',
    detected: '2026-07-09T08:00:00Z', change: '−4% vegetation index',
    cause: 'Fire scar detected from Sentinel-2 imagery' },
];

export const vegetationTimeline = [
  { month: 'Feb', ndvi: 0.62, canopy: 58 },
  { month: 'Mar', ndvi: 0.58, canopy: 57 },
  { month: 'Apr', ndvi: 0.54, canopy: 55 },
  { month: 'May', ndvi: 0.57, canopy: 55 },
  { month: 'Jun', ndvi: 0.66, canopy: 59 },
  { month: 'Jul', ndvi: 0.72, canopy: 62 },
  { month: 'Aug', ndvi: 0.74, canopy: 63 },
];
