import api, { USE_MOCK } from './api';
import {
  researcherSummary,
  conservationSummary,
  forestSummary,
} from '../mock/dashboards';
import { respond } from '../mock/_helpers';
import { ROLES } from '../utils/constants';

const byRole = {
  [ROLES.RESEARCHER]: researcherSummary,
  [ROLES.CONSERVATION]: conservationSummary,
  [ROLES.FOREST]: forestSummary,
};

export const dashboardService = {
  async summary(role) {
    /*
     * Mock mode is still available for development.
     *
     * Set VITE_USE_MOCK=true if you intentionally want
     * to use mock dashboard data.
     */
    if (USE_MOCK) {
      return respond(
        byRole[role] ?? researcherSummary,
        700
      );
    }

    /*
     * Real backend endpoint:
     *
     * http://127.0.0.1:8000/api/v1/dashboard?role=researcher
     *
     * api.js provides the host.
     */
    const { data } = await api.get('/api/v1/dashboard', {
      params: {
        role,
      },
    });

    return data;
  },
};