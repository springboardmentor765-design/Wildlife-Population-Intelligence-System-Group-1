import api, { USE_MOCK } from './api';
import { platformStats, usageByDay, managedUsers, systemDevices } from '../mock/admin';
import { respond } from '../mock/_helpers';

let userCache = [...managedUsers];

export const adminService = {
  async overview() {
    if (USE_MOCK) {
      return respond({ stats: platformStats, usage: usageByDay, devices: systemDevices }, 700);
    }
    const { data } = await api.get('/admin/overview');
    return data;
  },

  async users(params = {}) {
    if (USE_MOCK) {
      let rows = [...userCache];
      if (params.q) {
        const q = params.q.toLowerCase();
        rows = rows.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }
      if (params.role) rows = rows.filter((u) => u.role === params.role);
      return respond(rows, 600);
    }
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  async updateUser(id, patch) {
    if (USE_MOCK) {
      userCache = userCache.map((u) => (u.id === id ? { ...u, ...patch } : u));
      return respond(userCache.find((u) => u.id === id), 450);
    }
    const { data } = await api.patch(`/admin/users/${id}`, patch);
    return data;
  },
};
