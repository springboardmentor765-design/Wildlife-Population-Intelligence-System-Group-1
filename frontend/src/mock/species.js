export const mockSpecies = [
  {
    id: 'sp-01', common: 'Bengal Tiger', binomial: 'Panthera tigris tigris',
    group: 'Mammals', family: 'Felidae', order: 'Carnivora', iucn: 'EN',
    observations: 412, sites: 5, trend: 'up', lastSeen: '2026-08-05T21:14:00Z',
    note: 'Apex predator; individual identification runs on stripe-pattern matching.',
  },
  {
    id: 'sp-02', common: 'Asian Elephant', binomial: 'Elephas maximus',
    group: 'Mammals', family: 'Elephantidae', order: 'Proboscidea', iucn: 'EN',
    observations: 1893, sites: 6, trend: 'flat', lastSeen: '2026-08-06T04:02:00Z',
    note: 'Herd counts drive the corridor-conflict model for Moyar and Gudalur.',
  },
  {
    id: 'sp-03', common: 'Nilgiri Tahr', binomial: 'Nilgiritragus hylocrius',
    group: 'Mammals', family: 'Bovidae', order: 'Artiodactyla', iucn: 'EN',
    observations: 246, sites: 2, trend: 'up', lastSeen: '2026-07-30T08:45:00Z',
    note: 'Restricted to montane shola grassland above 1,200 m.',
  },
  {
    id: 'sp-04', common: 'Indian Leopard', binomial: 'Panthera pardus fusca',
    group: 'Mammals', family: 'Felidae', order: 'Carnivora', iucn: 'VU',
    observations: 638, sites: 6, trend: 'down', lastSeen: '2026-08-04T02:31:00Z',
    note: 'Night-time captures dominate; rosette matching confidence averages 0.91.',
  },
  {
    id: 'sp-05', common: 'Dhole', binomial: 'Cuon alpinus',
    group: 'Mammals', family: 'Canidae', order: 'Carnivora', iucn: 'EN',
    observations: 174, sites: 3, trend: 'down', lastSeen: '2026-07-27T16:20:00Z',
    note: 'Pack sizes estimated from multi-frame association across trap bursts.',
  },
  {
    id: 'sp-06', common: 'Great Hornbill', binomial: 'Buceros bicornis',
    group: 'Birds', family: 'Bucerotidae', order: 'Bucerotiformes', iucn: 'VU',
    observations: 903, sites: 4, trend: 'up', lastSeen: '2026-08-06T06:12:00Z',
    note: 'Detected mainly by call; nest-tree fidelity tracked across seasons.',
  },
  {
    id: 'sp-07', common: 'Malabar Whistling Thrush', binomial: 'Myophonus horsfieldii',
    group: 'Birds', family: 'Muscicapidae', order: 'Passeriformes', iucn: 'LC',
    observations: 2410, sites: 5, trend: 'flat', lastSeen: '2026-08-06T05:58:00Z',
    note: 'Dawn-chorus anchor species for the bioacoustic baseline.',
  },
  {
    id: 'sp-08', common: 'Indian Gaur', binomial: 'Bos gaurus',
    group: 'Mammals', family: 'Bovidae', order: 'Artiodactyla', iucn: 'VU',
    observations: 1502, sites: 5, trend: 'up', lastSeen: '2026-08-05T17:40:00Z',
    note: 'Largest extant bovine; herd density feeds the grazing-pressure index.',
  },
  {
    id: 'sp-09', common: 'Purple Frog', binomial: 'Nasikabatrachus sahyadrensis',
    group: 'Amphibians', family: 'Nasikabatrachidae', order: 'Anura', iucn: 'EN',
    observations: 58, sites: 2, trend: 'down', lastSeen: '2026-06-18T23:11:00Z',
    note: 'Surfaces only during pre-monsoon breeding; acoustic detection only.',
  },
  {
    id: 'sp-10', common: 'King Cobra', binomial: 'Ophiophagus hannah',
    group: 'Reptiles', family: 'Elapidae', order: 'Squamata', iucn: 'VU',
    observations: 91, sites: 3, trend: 'flat', lastSeen: '2026-07-22T13:05:00Z',
    note: 'Encounter records mostly from manual transects near plantation edges.',
  },
  {
    id: 'sp-11', common: 'Chital', binomial: 'Axis axis',
    group: 'Mammals', family: 'Cervidae', order: 'Artiodactyla', iucn: 'LC',
    observations: 5820, sites: 6, trend: 'up', lastSeen: '2026-08-06T05:20:00Z',
    note: 'Primary prey base indicator; counts feed predator-density estimates.',
  },
  {
    id: 'sp-12', common: 'Lion-tailed Macaque', binomial: 'Macaca silenus',
    group: 'Mammals', family: 'Cercopithecidae', order: 'Primates', iucn: 'EN',
    observations: 327, sites: 2, trend: 'flat', lastSeen: '2026-08-02T10:33:00Z',
    note: 'Canopy-dependent; fragmentation index is the strongest predictor.',
  },
];

export const speciesGroups = ['All groups', 'Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Insects'];
