import api, { USE_MOCK } from './api';
import {
  populationTrend, speciesRichness, distributionMarkers,
  migrationCorridors, populationSummary,
} from '../mock/analytics';
import { respond } from '../mock/_helpers';

export const analyticsService = {
  async population(params = {}) {
    if (USE_MOCK) {
      return respond(
        { trend: populationTrend, richness: speciesRichness, markers: distributionMarkers,
          corridors: migrationCorridors, summary: populationSummary },
        750
      );
    }
    const { data } = await api.get('/analytics/population', { params });
    return data;
  },
};
