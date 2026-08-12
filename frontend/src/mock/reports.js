export const reportTypes = [
  { id: 'survey', label: 'Wildlife survey report', desc: 'Effort, detections and site coverage for a chosen survey window.' },
  { id: 'population', label: 'Species population report', desc: 'Counts, density estimates and trend lines per species.' },
  { id: 'biodiversity', label: 'Biodiversity report', desc: 'Shannon, Simpson and richness indices with site comparison.' },
  { id: 'habitat', label: 'Habitat assessment report', desc: 'Vegetation, fragmentation and degradation findings.' },
  { id: 'conservation', label: 'Conservation report', desc: 'Ranked recommendations with impact and effort estimates.' },
];

export const recentReports = [
  { id: 'rp-01', name: 'Mudumalai quarterly survey — Q2 2026', type: 'survey', format: 'PDF', size: '4.2 MB', generatedAt: '2026-07-04T10:20:00Z', by: 'Dr. Anitha Raghavan' },
  { id: 'rp-02', name: 'Landscape biodiversity indices — Jul 2026', type: 'biodiversity', format: 'XLSX', size: '812 KB', generatedAt: '2026-08-01T07:45:00Z', by: 'Karthik Menon' },
  { id: 'rp-03', name: 'Moyar habitat degradation assessment', type: 'habitat', format: 'PDF', size: '6.8 MB', generatedAt: '2026-08-04T16:02:00Z', by: 'R. Selvaraj IFS' },
  { id: 'rp-04', name: 'Elephant population trend — 12 months', type: 'population', format: 'XLSX', size: '1.1 MB', generatedAt: '2026-07-28T09:11:00Z', by: 'Dr. Anitha Raghavan' },
];
