export const ROLES = {
  RESEARCHER: 'researcher',
  CONSERVATION: 'conservation_officer',
  FOREST: 'forest_officer',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.RESEARCHER]: 'Wildlife Researcher',
  [ROLES.CONSERVATION]: 'Conservation Officer',
  [ROLES.FOREST]: 'Forest Department Officer',
  [ROLES.ADMIN]: 'Administrator',
};

export const HABITAT_TYPES = [
  'Tropical dry deciduous',
  'Moist evergreen',
  'Montane shola grassland',
  'Riverine / wetland',
  'Scrub and thorn forest',
  'Mangrove',
  'Grassland savanna',
];

export const DEVICE_TYPES = ['Camera trap', 'Acoustic sensor', 'Drone survey', 'Line transect (manual)'];

// Official IUCN Red List categories, in order of increasing extinction risk
export const IUCN = {
  LC: { code: 'LC', label: 'Least Concern', dot: 'bg-iucn-lc', text: 'text-emerald-800', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
  NT: { code: 'NT', label: 'Near Threatened', dot: 'bg-iucn-nt', text: 'text-lime-900', bg: 'bg-lime-50', ring: 'ring-lime-200' },
  VU: { code: 'VU', label: 'Vulnerable', dot: 'bg-iucn-vu', text: 'text-yellow-900', bg: 'bg-yellow-50', ring: 'ring-yellow-200' },
  EN: { code: 'EN', label: 'Endangered', dot: 'bg-iucn-en', text: 'text-orange-900', bg: 'bg-orange-50', ring: 'ring-orange-200' },
  CR: { code: 'CR', label: 'Critically Endangered', dot: 'bg-iucn-cr', text: 'text-red-900', bg: 'bg-red-50', ring: 'ring-red-200' },
};

// Weighted model from the platform spec (must total 100)
export const HEALTH_WEIGHTS = [
  { key: 'species_diversity', label: 'Species diversity', weight: 30 },
  { key: 'population_stability', label: 'Population stability', weight: 25 },
  { key: 'habitat_quality', label: 'Habitat quality', weight: 20 },
  { key: 'endangered_status', label: 'Endangered species status', weight: 15 },
  { key: 'environmental_conditions', label: 'Environmental conditions', weight: 10 },
];

export const HEALTH_BANDS = [
  { min: 85, label: 'Excellent', color: '#2C7A5B', chip: 'bg-moss-100 text-moss-700 ring-moss-200' },
  { min: 70, label: 'Healthy', color: '#4E9E7A', chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
  { min: 55, label: 'Moderate Concern', color: '#C4854C', chip: 'bg-amber-50 text-amber-900 ring-amber-200' },
  { min: 40, label: 'Vulnerable', color: '#FC7F3F', chip: 'bg-orange-50 text-orange-900 ring-orange-200' },
  { min: 0, label: 'Critical', color: '#D81E05', chip: 'bg-red-50 text-red-900 ring-red-200' },
];

export const CHART_COLORS = ['#2C7A5B', '#B4763A', '#4E9E7A', '#8A6742', '#79BC9C', '#D9A473'];
