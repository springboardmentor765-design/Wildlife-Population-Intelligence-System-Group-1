// Amplitude envelopes are pre-baked (0–1) so the waveform renders without
// decoding real audio in mock mode.
const envelope = (seed, n = 120) =>
  Array.from({ length: n }, (_, i) => {
    const x = (i / n) * Math.PI * 2 * 3 + seed;
    return Math.abs(Math.sin(x) * 0.5 + Math.sin(x * 2.7 + seed) * 0.3 + Math.sin(x * 5.1) * 0.2);
  });

export const mockRecordings = [
  {
    id: 'aud-001', filename: 'AS118_20260806_0545.wav', siteId: 'site-02',
    site: 'Valparai Plateau, Anamalai', recordedAt: '2026-08-06T05:45:00Z',
    duration: 184, sampleRate: '48 kHz', channels: 'Stereo', status: 'analyzed',
    noiseFloor: -52, noiseFiltered: true, waveform: envelope(0.4),
    detections: [
      { id: 'd1', species: 'Great Hornbill', binomial: 'Buceros bicornis', iucn: 'VU', confidence: 0.96, start: 12.4, end: 15.1, type: 'Bird call' },
      { id: 'd2', species: 'Malabar Whistling Thrush', binomial: 'Myophonus horsfieldii', iucn: 'LC', confidence: 0.93, start: 31.0, end: 36.8, type: 'Bird song' },
      { id: 'd3', species: 'Lion-tailed Macaque', binomial: 'Macaca silenus', iucn: 'EN', confidence: 0.81, start: 74.2, end: 78.0, type: 'Mammal vocalisation' },
      { id: 'd4', species: 'Unidentified insect chorus', binomial: null, iucn: null, confidence: 0.55, start: 120.0, end: 184.0, type: 'Insect sound' },
    ],
  },
  {
    id: 'aud-002', filename: 'AS118_20260804_1930.wav', siteId: 'site-02',
    site: 'Valparai Plateau, Anamalai', recordedAt: '2026-08-04T19:30:00Z',
    duration: 240, sampleRate: '48 kHz', channels: 'Mono', status: 'analyzed',
    noiseFloor: -44, noiseFiltered: true, waveform: envelope(1.9),
    detections: [
      { id: 'd1', species: 'Asian Elephant', binomial: 'Elephas maximus', iucn: 'EN', confidence: 0.88, start: 45.6, end: 52.3, type: 'Mammal vocalisation' },
      { id: 'd2', species: 'Indian Nightjar', binomial: 'Caprimulgus asiaticus', iucn: 'LC', confidence: 0.9, start: 101.2, end: 108.4, type: 'Bird call' },
    ],
  },
  {
    id: 'aud-003', filename: 'AS118_20260618_2311.wav', siteId: 'site-02',
    site: 'Valparai Plateau, Anamalai', recordedAt: '2026-06-18T23:11:00Z',
    duration: 96, sampleRate: '44.1 kHz', channels: 'Mono', status: 'analyzed',
    noiseFloor: -61, noiseFiltered: false, waveform: envelope(3.2),
    detections: [
      { id: 'd1', species: 'Purple Frog', binomial: 'Nasikabatrachus sahyadrensis', iucn: 'EN', confidence: 0.79, start: 8.0, end: 14.6, type: 'Amphibian call' },
      { id: 'd2', species: 'Rain / wind', binomial: null, iucn: null, confidence: 0.99, start: 0, end: 96, type: 'Environmental noise' },
    ],
  },
  {
    id: 'aud-004', filename: 'AS118_20260801_0602.wav', siteId: 'site-02',
    site: 'Valparai Plateau, Anamalai', recordedAt: '2026-08-01T06:02:00Z',
    duration: 152, sampleRate: '48 kHz', channels: 'Stereo', status: 'processing',
    noiseFloor: -49, noiseFiltered: true, waveform: envelope(5.5), detections: [],
  },
];
