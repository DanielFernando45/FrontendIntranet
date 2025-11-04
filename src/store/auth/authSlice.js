import { createSlice } from "@reduxjs/toolkit";
import { isTokenValid } from "../../utils/validateToken";

// Cargar el usuario desde localStorage
const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage && isTokenValid(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.datos_usuario;
      state.isAuthenticated = true;

      // Guardamos los datos del usuario y el token en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.datos_usuario)
      );
      localStorage.setItem("authToken", action.payload.access_token); // El token como cadena, no como JSON
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Limpiar el localStorage al hacer logout
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
    checkAuth: (state) => {
      // Verifica si el token es válido en cada sesión de la app
      if (!isTokenValid()) {
        // Si el token ha expirado o no es válido, hacemos logout
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    },
  },
});

// Exportar las acciones del slice
export const { loginSuccess, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
