import { apiClient } from '../lib/apiClient';

export const getDashboardStats = async () => {
  return apiClient('/api/dashboard/');
};

export const getMapMarkers = async () => {
  return apiClient('/api/map/markers');
};

export const getReports = async () => {
  return apiClient('/api/reports/');
};

export const createReport = async (reportData: { title: string; content: string; user_id: number }) => {
  return apiClient('/api/reports/', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
};

export const uploadImageForDetection = async (file: File, sourceType: string = 'Camera Trap Image') => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (sourceType === 'Audio Recording') {
    return apiClient('/api/audio/upload', {
      method: 'POST',
      body: formData,
    });
  }

  formData.append('source_type', sourceType);
  return apiClient('/api/detection/image', {
    method: 'POST',
    body: formData,
  });
};

export const uploadVideoForDetection = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient('/api/detection/video', {
    method: 'POST',
    body: formData,
  });
};

export const uploadAudioForAnalysis = async (audioFile: File) => {
  const formData = new FormData();
  formData.append('file', audioFile);

  return apiClient('/api/audio/upload', {
    method: 'POST',
    body: formData,
  });
};

export const getAllDetections = async () => {
  return apiClient('/api/detection/all');
};

export const getAllAudioPredictions = async () => {
  return apiClient('/api/audio/all');
};

export const deleteDetection = async (id: number) => {
  return apiClient(`/api/detection/${id}`, { method: 'DELETE' });
};

export const deleteAudioPrediction = async (id: number) => {
  return apiClient(`/api/audio/${id}`, { method: 'DELETE' });
};

export const getPopulationTrends = async () => {
  return apiClient('/api/population/trends');
};

export const getPopulationForecast = async () => {
  return apiClient('/api/population/forecast');
};

export const getPopulationAnomalies = async () => {
  return apiClient('/api/population/anomalies');
};

export const getAlerts = async (skip: number = 0, limit: number = 100) => {
  return apiClient(`/api/alerts/?skip=${skip}&limit=${limit}`);
};

export const createAlert = async (alertData: { alert_type: string; recipient: string; message: string; severity: string }) => {
  return apiClient('/api/alerts/send', {
    method: 'POST',
    body: JSON.stringify(alertData),
  });
};

export const loginUser = async (credentials: any) => {
  return apiClient('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData: any) => {
  return apiClient('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};
