export const researcherSummary = {
  tiles: [
    { key: 'observations', label: 'Observations this month', value: 4820, delta: 12.4, unit: '' },
    { key: 'species', label: 'Species confirmed', value: 94, delta: 5.6, unit: '' },
    { key: 'pending', label: 'Captures awaiting review', value: 37, delta: -18.2, unit: '' },
    { key: 'accuracy', label: 'Model confidence (mean)', value: 91.2, delta: 1.1, unit: '%' },
  ],
  recentObservations: [
    { id: 'o1', species: 'Bengal Tiger', binomial: 'Panthera tigris tigris', iucn: 'EN', site: 'Kargudi Range', at: '2026-08-05T21:14:00Z', confidence: 0.97, source: 'Camera trap' },
    { id: 'o2', species: 'Great Hornbill', binomial: 'Buceros bicornis', iucn: 'VU', site: 'Valparai Plateau', at: '2026-08-06T06:12:00Z', confidence: 0.96, source: 'Acoustic' },
    { id: 'o3', species: 'Indian Gaur', binomial: 'Bos gaurus', iucn: 'VU', site: 'Thekkady Fringe', at: '2026-08-05T17:40:00Z', confidence: 0.95, source: 'Camera trap' },
    { id: 'o4', species: 'Asian Elephant', binomial: 'Elephas maximus', iucn: 'EN', site: 'Moyar River Bank', at: '2026-08-04T19:05:00Z', confidence: 0.98, source: 'Camera trap' },
    { id: 'o5', species: 'Lion-tailed Macaque', binomial: 'Macaca silenus', iucn: 'EN', site: 'Valparai Plateau', at: '2026-08-02T10:33:00Z', confidence: 0.92, source: 'Camera trap' },
  ],
};

export const conservationSummary = {
  tiles: [
    { key: 'threats', label: 'Open threats', value: 7, delta: 16.7, unit: '' },
    { key: 'endangered', label: 'Endangered species tracked', value: 6, delta: 0, unit: '' },
    { key: 'priority', label: 'Priority actions queued', value: 5, delta: -12.5, unit: '' },
    { key: 'health', label: 'Ecosystem health score', value: 73, delta: 5.8, unit: '' },
  ],
  threatBreakdown: [
    { name: 'Habitat loss', value: 34 },
    { name: 'Human–wildlife conflict', value: 26 },
    { name: 'Invasive species', value: 18 },
    { name: 'Poaching pressure', value: 12 },
    { name: 'Fire', value: 10 },
  ],
};

export const forestSummary = {
  tiles: [
    { key: 'area', label: 'Protected area monitored', value: 2108, delta: 0, unit: ' km²' },
    { key: 'patrols', label: 'Patrols logged this week', value: 34, delta: 9.7, unit: '' },
    { key: 'incidents', label: 'Open incidents', value: 4, delta: -20, unit: '' },
    { key: 'devices', label: 'Devices online', value: 89, delta: -2.2, unit: '/96' },
  ],
  incidents: [
    { id: 'inc1', type: 'Crop raiding', location: 'Sigur fringe village', species: 'Asian Elephant', reported: '2026-08-05T20:40:00Z', status: 'Response dispatched' },
    { id: 'inc2', type: 'Livestock predation', location: 'Masinagudi', species: 'Indian Leopard', reported: '2026-08-04T05:15:00Z', status: 'Under investigation' },
    { id: 'inc3', type: 'Snare recovered', location: 'Moyar east bank', species: null, reported: '2026-08-02T11:00:00Z', status: 'Closed' },
    { id: 'inc4', type: 'Unauthorised entry', location: 'Kargudi trail head', species: null, reported: '2026-07-31T16:22:00Z', status: 'Open' },
  ],
  patrolCoverage: [
    { zone: 'North', covered: 82 }, { zone: 'East', covered: 64 },
    { zone: 'South', covered: 91 }, { zone: 'West', covered: 47 },
  ],
};
