export const API_URL = 'https://backend-pasantias.onrender.com';

export const getAuthHeader = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});