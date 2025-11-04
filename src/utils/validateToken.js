import { jwtDecode } from "jwt-decode";

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
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("Token no encontrado");
    return false;
  }

  try {
    const decodedToken = jwtDecode(token); // Decodificamos el JWT
    console.log("Token decodificado:", decodedToken);

    // Verificamos si el token ya ha expirado
    const expirationTime = decodedToken.exp * 1000; // Expiración en milisegundos
    const currentTime = Date.now();

    if (currentTime > expirationTime) {
      console.log("El token ha expirado.");
      return false;
    }

    // Si el token aún es válido, lo retornamos como válido
    return true;
  } catch (error) {
    console.log("Error decodificando el token:", error);
    return false;
  }
};

// Guardar el tiempo de creación del token cuando el usuario inicia sesión
export const saveTokenCreationTime = () => {
  localStorage.setItem("tokenCreationTime", Date.now().toString());
};
