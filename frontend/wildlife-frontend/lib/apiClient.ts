const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // On client side, dynamically resolve backend host if accessed on port 3000
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    if (window.location.port === '3000') {
      return `${protocol}//${hostname}:8000`;
    }
    return `${protocol}//${hostname}`;
  }
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Add authentication tokens here later if needed
    },
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  // If sending form data (e.g., images/audio uploads), remove Content-Type 
  // so the browser sets it automatically with the correct boundary
  if (options.body instanceof FormData) {
    if (finalOptions.headers) {
      delete (finalOptions.headers as Record<string, string>)['Content-Type'];
    }
  }

  const response = await fetch(url, finalOptions);

  if (!response.ok) {
    // Attempt to parse backend error message
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMessage = errorData.detail;
    } catch (e) {
      // Ignore JSON parse errors for non-JSON responses
    }
    throw new Error(`API Error: ${errorMessage}`);
  }

  return response.json();
};
