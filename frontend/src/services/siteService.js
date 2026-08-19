import api, { USE_MOCK } from './api';
import { mockSites } from '../mock/sites';
import { respond } from '../mock/_helpers';

let cache = [...mockSites];

export const siteService = {
  async list(params = {}) {
    if (USE_MOCK) {
      let rows = [...cache];
      if (params.q) {
        const q = params.q.toLowerCase();
        rows = rows.filter(
          (s) => s.location.toLowerCase().includes(q) || s.surveyId.toLowerCase().includes(q)
        );
      }
      if (params.habitatType) rows = rows.filter((s) => s.habitatType === params.habitatType);
      if (params.status) rows = rows.filter((s) => s.status === params.status);
      return respond(rows);
    }
    const { data } = await api.get('/monitoring/sites', { params });
    return data;
  },

  async get(id) {
    if (USE_MOCK) return respond(cache.find((s) => s.id === id) || null);
    const { data } = await api.get(`/monitoring/sites/${id}`);
    return data;
  },

  async create(payload) {
    if (USE_MOCK) {
      const site = {
        ...payload,
        id: `site-${Math.random().toString(36).slice(2, 7)}`,
        lat: Number(payload.lat), lng: Number(payload.lng),
        detections: 0, status: 'active', lastSync: new Date().toISOString(),
      };
      cache = [site, ...cache];
      return respond(site, 700);
    }
    const { data } = await api.post('/monitoring/sites', payload);
    return data;
  },

  async remove(id) {
    if (USE_MOCK) {
      cache = cache.filter((s) => s.id !== id);
      return respond({ ok: true }, 400);
    }
    await api.delete(`/monitoring/sites/${id}`);
    return { ok: true };
  },
};
