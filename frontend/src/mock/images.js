// Camera-trap captures. `boxes` are percentages of frame width/height so they
// scale with whatever container the frame is rendered into.
export const mockImages = [
  {
    id: 'img-001', filename: 'CT441_20260805_2114.jpg', siteId: 'site-01',
    site: 'Kargudi Range, Mudumalai', capturedAt: '2026-08-05T21:14:00Z',
    mode: 'infrared', scene: 'trail', quality: 0.94, animalCount: 1, status: 'analyzed',
    behaviour: 'Walking / patrolling', temperature: '24°C', moon: 'Waxing gibbous',
    boxes: [{ label: 'Panthera tigris tigris', common: 'Bengal Tiger', confidence: 0.97, x: 34, y: 44, w: 38, h: 34, iucn: 'EN' }],
  },
  {
    id: 'img-002', filename: 'CT233_20260805_1740.jpg', siteId: 'site-05',
    site: 'Thekkady Fringe, Periyar', capturedAt: '2026-08-05T17:40:00Z',
    mode: 'daylight', scene: 'clearing', quality: 0.88, animalCount: 3, status: 'analyzed',
    behaviour: 'Grazing', temperature: '27°C', moon: '—',
    boxes: [
      { label: 'Bos gaurus', common: 'Indian Gaur', confidence: 0.95, x: 12, y: 42, w: 30, h: 36, iucn: 'VU' },
      { label: 'Bos gaurus', common: 'Indian Gaur', confidence: 0.91, x: 46, y: 48, w: 26, h: 30, iucn: 'VU' },
      { label: 'Axis axis', common: 'Chital', confidence: 0.83, x: 76, y: 54, w: 16, h: 22, iucn: 'LC' },
    ],
  },
  {
    id: 'img-003', filename: 'CT441_20260804_0231.jpg', siteId: 'site-01',
    site: 'Kargudi Range, Mudumalai', capturedAt: '2026-08-04T02:31:00Z',
    mode: 'infrared', scene: 'trail', quality: 0.71, animalCount: 1, status: 'analyzed',
    behaviour: 'Stalking', temperature: '21°C', moon: 'Waxing gibbous',
    boxes: [{ label: 'Panthera pardus fusca', common: 'Indian Leopard', confidence: 0.89, x: 50, y: 50, w: 30, h: 28, iucn: 'VU' }],
  },
  {
    id: 'img-004', filename: 'CT508_20260730_1905.jpg', siteId: 'site-04',
    site: 'Moyar River Bank', capturedAt: '2026-07-30T19:05:00Z',
    mode: 'infrared', scene: 'water', quality: 0.66, animalCount: 4, status: 'analyzed',
    behaviour: 'Drinking', temperature: '26°C', moon: 'First quarter',
    boxes: [
      { label: 'Elephas maximus', common: 'Asian Elephant', confidence: 0.98, x: 8, y: 30, w: 40, h: 48, iucn: 'EN' },
      { label: 'Elephas maximus', common: 'Asian Elephant', confidence: 0.93, x: 44, y: 40, w: 26, h: 34, iucn: 'EN' },
      { label: 'Elephas maximus', common: 'Asian Elephant', confidence: 0.79, x: 68, y: 46, w: 18, h: 24, iucn: 'EN' },
      { label: 'Unidentified', common: 'Unknown', confidence: 0.42, x: 86, y: 58, w: 10, h: 14, iucn: null },
    ],
  },
  {
    id: 'img-005', filename: 'CT233_20260728_0612.jpg', siteId: 'site-05',
    site: 'Thekkady Fringe, Periyar', capturedAt: '2026-07-28T06:12:00Z',
    mode: 'daylight', scene: 'canopy', quality: 0.91, animalCount: 2, status: 'analyzed',
    behaviour: 'Foraging', temperature: '22°C', moon: '—',
    boxes: [
      { label: 'Macaca silenus', common: 'Lion-tailed Macaque', confidence: 0.92, x: 22, y: 20, w: 22, h: 30, iucn: 'EN' },
      { label: 'Macaca silenus', common: 'Lion-tailed Macaque', confidence: 0.86, x: 58, y: 26, w: 20, h: 26, iucn: 'EN' },
    ],
  },
  {
    id: 'img-006', filename: 'DR009_20260630_1120.jpg', siteId: 'site-03',
    site: 'Avalanche Shola, Nilgiris', capturedAt: '2026-06-30T11:20:00Z',
    mode: 'daylight', scene: 'grassland', quality: 0.79, animalCount: 6, status: 'analyzed',
    behaviour: 'Herd movement', temperature: '17°C', moon: '—',
    boxes: [
      { label: 'Nilgiritragus hylocrius', common: 'Nilgiri Tahr', confidence: 0.9, x: 14, y: 52, w: 14, h: 18, iucn: 'EN' },
      { label: 'Nilgiritragus hylocrius', common: 'Nilgiri Tahr', confidence: 0.88, x: 34, y: 56, w: 13, h: 17, iucn: 'EN' },
      { label: 'Nilgiritragus hylocrius', common: 'Nilgiri Tahr', confidence: 0.81, x: 54, y: 50, w: 12, h: 16, iucn: 'EN' },
      { label: 'Nilgiritragus hylocrius', common: 'Nilgiri Tahr', confidence: 0.76, x: 70, y: 58, w: 12, h: 15, iucn: 'EN' },
    ],
  },
  {
    id: 'img-007', filename: 'CT441_20260726_0348.jpg', siteId: 'site-01',
    site: 'Kargudi Range, Mudumalai', capturedAt: '2026-07-26T03:48:00Z',
    mode: 'infrared', scene: 'trail', quality: 0.38, animalCount: 0, status: 'review',
    behaviour: 'None detected', temperature: '20°C', moon: 'New moon',
    boxes: [],
  },
  {
    id: 'img-008', filename: 'CT508_20260722_1305.jpg', siteId: 'site-04',
    site: 'Moyar River Bank', capturedAt: '2026-07-22T13:05:00Z',
    mode: 'daylight', scene: 'clearing', quality: 0.84, animalCount: 1, status: 'analyzed',
    behaviour: 'Resting', temperature: '31°C', moon: '—',
    boxes: [{ label: 'Cuon alpinus', common: 'Dhole', confidence: 0.87, x: 40, y: 52, w: 24, h: 24, iucn: 'EN' }],
  },
];
