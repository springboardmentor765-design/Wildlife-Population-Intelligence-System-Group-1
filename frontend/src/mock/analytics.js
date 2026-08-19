export const populationTrend = [
  { month: 'Sep 25', tiger: 38, elephant: 412, gaur: 286, tahr: 96 },
  { month: 'Oct 25', tiger: 39, elephant: 428, gaur: 291, tahr: 99 },
  { month: 'Nov 25', tiger: 41, elephant: 455, gaur: 305, tahr: 104 },
  { month: 'Dec 25', tiger: 41, elephant: 470, gaur: 312, tahr: 108 },
  { month: 'Jan 26', tiger: 43, elephant: 462, gaur: 318, tahr: 112 },
  { month: 'Feb 26', tiger: 44, elephant: 441, gaur: 322, tahr: 118 },
  { month: 'Mar 26', tiger: 44, elephant: 430, gaur: 316, tahr: 121 },
  { month: 'Apr 26', tiger: 46, elephant: 448, gaur: 331, tahr: 126 },
  { month: 'May 26', tiger: 47, elephant: 476, gaur: 344, tahr: 129 },
  { month: 'Jun 26', tiger: 48, elephant: 495, gaur: 351, tahr: 133 },
  { month: 'Jul 26', tiger: 49, elephant: 502, gaur: 358, tahr: 138 },
  { month: 'Aug 26', tiger: 51, elephant: 511, gaur: 364, tahr: 141 },
];

export const speciesRichness = [
  { site: 'Mudumalai', richness: 78, endemic: 12 },
  { site: 'Anamalai', richness: 94, endemic: 21 },
  { site: 'Nilgiris', richness: 61, endemic: 18 },
  { site: 'Moyar', richness: 52, endemic: 6 },
  { site: 'Periyar', richness: 86, endemic: 17 },
  { site: 'Gudalur', richness: 34, endemic: 3 },
];

export const distributionMarkers = [
  { id: 'm1', name: 'Kargudi Range', lat: 11.5964, lng: 76.5347, population: 1284, dominant: 'Panthera tigris tigris', density: 4.1, status: 'active' },
  { id: 'm2', name: 'Valparai Plateau', lat: 10.3270, lng: 76.9510, population: 3910, dominant: 'Macaca silenus', density: 6.8, status: 'active' },
  { id: 'm3', name: 'Avalanche Shola', lat: 11.2610, lng: 76.5820, population: 402, dominant: 'Nilgiritragus hylocrius', density: 2.2, status: 'maintenance' },
  { id: 'm4', name: 'Moyar River Bank', lat: 11.5450, lng: 76.8790, population: 876, dominant: 'Elephas maximus', density: 3.4, status: 'offline' },
  { id: 'm5', name: 'Thekkady Fringe', lat: 9.5850, lng: 77.1600, population: 2140, dominant: 'Bos gaurus', density: 5.6, status: 'active' },
  { id: 'm6', name: 'Gudalur Scrub Belt', lat: 11.5010, lng: 76.4900, population: 233, dominant: 'Axis axis', density: 1.3, status: 'active' },
];

export const migrationCorridors = [
  { id: 'c1', name: 'Moyar–Sigur corridor', species: 'Asian Elephant', movement: 'Seasonal, Jun–Sep', pressure: 'High', width: '1.2 km' },
  { id: 'c2', name: 'Anamalai–Parambikulam link', species: 'Indian Gaur', movement: 'Year-round', pressure: 'Moderate', width: '3.8 km' },
  { id: 'c3', name: 'Nilgiri shola patch network', species: 'Nilgiri Tahr', movement: 'Altitudinal, Nov–Feb', pressure: 'Low', width: 'Fragmented' },
];

export const populationSummary = {
  totalPopulation: 8845, growthRate: 3.4, speciesRichness: 94,
  endangeredCount: 6, densityPerSqKm: 4.2, surveyedArea: 2108,
};
