import api, { USE_MOCK } from './api';
import { mockAlerts } from '../mock/alerts';
import { respond } from '../mock/_helpers';

let cache = [...mockAlerts];

export const alertService = {
  async list(params = {}) {
    if (USE_MOCK) {
      let rows = [...cache];
      if (params.type) rows = rows.filter((a) => a.type === params.type);
      if (params.unreadOnly) rows = rows.filter((a) => !a.read);
      return respond(rows, 550);
    }
    const { data } = await api.get('/api/v1/alerts', { params });
    return data;
  },

  async markRead(id) {
    if (USE_MOCK) {
      cache = cache.map((a) => (a.id === id ? { ...a, read: true } : a));
      return respond({ ok: true }, 250);
    }
    await api.patch(`/api/v1/alerts/${id}`, { read: true });
    return { ok: true };
  },

  async markAllRead() {
    if (USE_MOCK) {
      cache = cache.map((a) => ({ ...a, read: true }));
      return respond({ ok: true }, 350);
    }
    await api.post('/api/v1/alerts/read-all');
    return { ok: true };
  },
};
