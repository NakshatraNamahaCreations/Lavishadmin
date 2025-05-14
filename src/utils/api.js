import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get the auth token from session storage
 * @returns {string|null} The auth token or null if not found
 */
export const getAuthToken = () => {
  return sessionStorage.getItem('accessToken');
};

/**
 * Create an axios instance with authorization headers
 * @returns {import('axios').AxiosInstance} Axios instance with auth headers
 */
export const getAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    withCredentials: true
  });
};

/**
 * Create an axios instance for file uploads with authorization headers
 * @returns {import('axios').AxiosInstance} Axios instance for file uploads
 */
export const getUploadAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    withCredentials: true
  });
};

export default {
  getAuthToken,
  getAuthAxios,
  getUploadAxios
}; 