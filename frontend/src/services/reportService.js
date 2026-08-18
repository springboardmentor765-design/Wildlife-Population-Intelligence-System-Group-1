import api, { USE_MOCK } from './api';
import { reportTypes, recentReports } from '../mock/reports';
import { respond, delay } from '../mock/_helpers';

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

const filenameFromDisposition = (
  disposition,
  fallback
) => {
  if (!disposition) {
    return fallback;
  }

  const match =
    /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(
      disposition
    );

  return match
    ? decodeURIComponent(match[1])
    : fallback;
};

export const reportService = {

  // ==========================================================
  // GET REPORT TYPES + RECENT REPORTS
  // ==========================================================

  async catalogue() {

    if (USE_MOCK) {
      return respond(
        {
          types: reportTypes,
          recent: recentReports,
        },
        600
      );
    }

    const { data } = await api.get('/reports');

    return data;
  },


  // ==========================================================
  // GENERATE REPORT
  // ==========================================================

  async export(format, filters = {}) {

    if (USE_MOCK) {

      await delay(1200);

      const body =
        `Wildlife Population Intelligence System\n\n` +
        `Report type: ${filters.type || 'survey'}\n` +
        `Range: ${filters.from || 'All'} to ${filters.to || 'All'}\n` +
        `Species: ${filters.species || 'All species'}\n\n` +
        `Mock export. Connect the live API to generate the actual ${format.toUpperCase()} report.`;

      downloadBlob(
        new Blob(
          [body],
          {
            type: 'text/plain',
          }
        ),
        `wpis-report.${format}.txt`
      );

      return {
        ok: true,
        mock: true,
      };
    }

    const { data } = await api.post(
      '/reports/generate',
      {
        type: filters.type || 'survey',

        from: filters.from || null,

        to: filters.to || null,

        species: filters.species || null,

        format,
      }
    );

    /*
     * The backend generates and stores the report.
     * Download it immediately after generation.
     */

    if (data?.report?.id) {

      await reportService.download(
        data.report.id,
        data.report.name
      );
    }

    return data;
  },


  // ==========================================================
  // DOWNLOAD EXISTING REPORT
  // ==========================================================

  async download(
    id,
    name = 'wpis-report'
  ) {

    if (USE_MOCK) {

      await delay(500);

      const body =
        `Wildlife Population Intelligence System\n\n` +
        `Mock report: ${id}`;

      downloadBlob(
        new Blob(
          [body],
          {
            type: 'text/plain',
          }
        ),
        `wpis-report-${id}.txt`
      );

      return {
        ok: true,
        mock: true,
      };
    }

    const response = await api.get(
      `/reports/${id}/download`,
      {
        responseType: 'blob',
      }
    );

    const fallback = `${
      name
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase()
    }.${response.headers[
      'content-type'
    ]?.includes('spreadsheet')
      ? 'xlsx'
      : 'pdf'
    }`;

    const filename =
      filenameFromDisposition(
        response.headers[
          'content-disposition'
        ],
        fallback
      );

    downloadBlob(
      response.data,
      filename
    );

    return {
      ok: true,
    };
  },
};