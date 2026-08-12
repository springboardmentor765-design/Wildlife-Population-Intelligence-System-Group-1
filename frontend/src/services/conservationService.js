import api, { USE_MOCK } from './api';
import { recommendations } from '../mock/conservation';
import { respond } from '../mock/_helpers';

export const conservationService = {
  async list(params = {}) {
    if (USE_MOCK) {
      let rows = [...recommendations];
      if (params.priority) rows = rows.filter((r) => r.priority === params.priority);
      return respond(rows, 650);
    }
    const { data } = await api.get('/conservation/recommendations', { params });
    return data;
  },

  async accept(id) {
    if (USE_MOCK) return respond({ id, status: 'accepted' }, 500);
    const { data } = await api.post(`/conservation/recommendations/${id}/accept`);
    return data;
  },
};
