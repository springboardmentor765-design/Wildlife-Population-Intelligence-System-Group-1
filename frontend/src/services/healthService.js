import api, { USE_MOCK } from './api';
import { ecosystemHealth } from '../mock/health';
import { respond } from '../mock/_helpers';
import { HEALTH_WEIGHTS } from '../utils/constants';

// Recomputes the weighted score client-side so the displayed total always
// matches the component bars, even if the API sends a stale aggregate.
export const computeWeightedScore = (components = {}) =>
  Math.round(
    HEALTH_WEIGHTS.reduce((sum, w) => sum + (components[w.key] ?? 0) * (w.weight / 100), 0)
  );

export const healthService = {
  async get(params = {}) {
    if (USE_MOCK) {
      const data = await respond(ecosystemHealth, 800);
      return { ...data, score: computeWeightedScore(data.components) };
    }
    const { data } = await api.get('/health/ecosystem', { params });
    return { ...data, score: computeWeightedScore(data.components) };
  },
};
