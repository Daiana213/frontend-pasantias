export const API_URL = 'http://localhost:3000';

export const getAuthHeader = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});