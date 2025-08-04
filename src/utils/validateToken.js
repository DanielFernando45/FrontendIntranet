import { jwtDecode } from 'jwt-decode';

export const isTokenValid = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    console.log(decoded);
    
    const now = Date.now() / 1000;

    return decoded.exp > now;
  } catch (error) {
    return false;
  }
};
