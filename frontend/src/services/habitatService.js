import api, { USE_MOCK } from './api';
import {
  biodiversityIndices, habitatPanels, degradationAlerts, vegetationTimeline,
} from '../mock/biodiversity';
import { respond } from '../mock/_helpers';

export const habitatService = {
  async biodiversity(params = {}) {
    if (USE_MOCK) {
      return respond(
        { indices: biodiversityIndices, habitats: habitatPanels,
          degradation: degradationAlerts, vegetation: vegetationTimeline },
        700
      );
    }
    const { data } = await api.get('/biodiversity/overview', { params });
    return data;
  },
};
