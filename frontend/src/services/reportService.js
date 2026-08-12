import api, { USE_MOCK } from './api';
import { reportTypes, recentReports } from '../mock/reports';
import { respond, delay } from '../mock/_helpers';

const download = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const reportService = {
  async catalogue() {
    if (USE_MOCK) return respond({ types: reportTypes, recent: recentReports }, 600);
    const { data } = await api.get('/reports');
    return data;
  },

  // format: 'pdf' | 'xlsx'
  async export(format, filters = {}) {
    if (USE_MOCK) {
      await delay(1200);
      const body =
        `Wildlife Population Intelligence System\n` +
        `Report type: ${filters.type || 'survey'}\n` +
        `Range: ${filters.from || '—'} to ${filters.to || '—'}\n` +
        `Site: ${filters.site || 'All sites'}\n\n` +
        `Mock export. Connect VITE_API_URL to generate the real ${format.toUpperCase()} file.`;
      download(new Blob([body], { type: 'text/plain' }), `wpis-report.${format}.txt`);
      return { ok: true, mock: true };
    }
    const res = await api.get(`/reports/export/${format}`, { params: filters, responseType: 'blob' });
    download(res.data, `wpis-report.${format}`);
    return { ok: true };
  },
};
