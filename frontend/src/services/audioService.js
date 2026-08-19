import api from './api';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const audioService = {

  // ---------------------------------------------------------
  // Get previously uploaded audio files
  // ---------------------------------------------------------
  async list() {
    const { data } = await api.get('/audio');

    return (Array.isArray(data) ? data : []).map((audio) => ({
      ...audio,
      audioUrl: audio.url?.startsWith('http')
        ? audio.url
        : `${API_URL}${audio.url}`,
    }));
  },


  // ---------------------------------------------------------
  // Upload audio + run model
  // ---------------------------------------------------------
  async upload(file, { onProgress } = {}) {

    const form = new FormData();

    form.append('file', file);

    const { data } = await api.post(
      '/upload-audio',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },

        onUploadProgress: (event) => {
          if (!event.total) return;

          const percent = Math.round(
            (event.loaded / event.total) * 100
          );

          onProgress?.(percent);
        },
      }
    );

    return {
      ...data,

      audioUrl:
        data.audioUrl ||
        (
          data.url?.startsWith('http')
            ? data.url
            : `${API_URL}${data.url || `/audio/${encodeURIComponent(data.filename)}`}`
        ),
    };
  },
};