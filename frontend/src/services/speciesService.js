import api, { USE_MOCK } from './api';
import { mockSpecies } from '../mock/species';
import { respond } from '../mock/_helpers';

export const speciesService = {
  async list(params = {}) {
    if (USE_MOCK) {
      let rows = [...mockSpecies];
      if (params.q) {
        const q = params.q.toLowerCase();
        rows = rows.filter(
          (s) => s.common.toLowerCase().includes(q) || s.binomial.toLowerCase().includes(q) ||
                 s.family.toLowerCase().includes(q)
        );
      }
      if (params.group && params.group !== 'All groups') rows = rows.filter((s) => s.group === params.group);
      if (params.iucn) rows = rows.filter((s) => s.iucn === params.iucn);
      return respond(rows, 600);
    }
    const { data } = await api.get('/species', { params });
    return data;
  },

  async get(id) {
    if (USE_MOCK) return respond(mockSpecies.find((s) => s.id === id) || null);
    const { data } = await api.get(`/species/${id}`);
    return data;
  },
};
