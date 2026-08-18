import api from './api';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const imageService = {
  async list() {
    const { data } = await api.get('/images');

    return Array.isArray(data) ? data : [];
  },

  async upload(files, { onProgress } = {}) {
    const results = [];

    for (const file of files) {
      const form = new FormData();
      form.append('file', file);

      const { data } = await api.post('/upload-image', form, {
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
      });

      results.push({
        ...data,

        imageUrl: `${API_URL}/media/images/${encodeURIComponent(
          data.filename
        )}`,
      });
    }

    return results;
  },

  imageUrl(filename) {
    return `${API_URL}/media/images/${encodeURIComponent(filename)}`;
  },
};