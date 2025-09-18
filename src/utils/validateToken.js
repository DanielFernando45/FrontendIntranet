import { jwtDecode } from 'jwt-decode';

export const getUsuarioDesdeToken = () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded; // Asegúrate que el token contenga el ID del usuario/supervisor
  } catch (error) {
    return null;
  }
};

export const isTokenValid = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const decoded = jwtDecode(token);
    // console.log(decoded);

    const now = Date.now() / 1000;

    return decoded.exp > now;
  } catch (error) {
    return false;
  }
};
