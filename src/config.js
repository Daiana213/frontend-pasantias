export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found in localStorage');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const API_URL = 'https://backend-pasantias.onrender.com';
// export const API_URL = 'http://localhost:3000';
