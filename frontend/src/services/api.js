import axios from 'axios';

/*
|--------------------------------------------------------------------------
| Mock mode
|--------------------------------------------------------------------------
|
| Set VITE_USE_MOCK=true in .env if you want frontend mock data.
| For the real PostgreSQL + FastAPI + YOLO backend, keep this false.
|
*/

export const USE_MOCK =
  String(import.meta.env.VITE_USE_MOCK ?? 'false').toLowerCase() === 'true';


/*
|--------------------------------------------------------------------------
| Local storage keys
|--------------------------------------------------------------------------
*/

export const TOKEN_KEY = 'wpis_token';
export const USER_KEY = 'wpis_user';


/*
|--------------------------------------------------------------------------
| Backend API configuration
|--------------------------------------------------------------------------
|
| Your FastAPI backend is currently running on:
|
|     http://localhost:8000
|
| Examples of your actual backend routes:
|
|     POST /upload-image
|     GET  /images
|     GET  /images/{filename}
|
| Therefore DO NOT add /api/v1 here.
|
*/

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';


/*
|--------------------------------------------------------------------------
| Axios instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_BASE_URL,

  /*
   * 120 seconds because YOLO inference can take some time.
   */
  timeout: 120000,

  /*
   * IMPORTANT:
   *
   * Do NOT globally set:
   *
   *     Content-Type: application/json
   *
   * because image uploads use FormData / multipart/form-data.
   *
   * Axios/browser will automatically set the correct multipart
   * Content-Type including the required boundary.
   */
  headers: {
    Accept: 'application/json',
  },
});


/*
|--------------------------------------------------------------------------
| Request interceptor
|--------------------------------------------------------------------------
|
| Automatically attach JWT token when one exists.
|
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/*
|--------------------------------------------------------------------------
| Response interceptor
|--------------------------------------------------------------------------
|
| Convert backend errors into readable JavaScript Error objects.
|
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Try again.';

    return Promise.reject(new Error(message));
  }
);


export default api;