import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.datos_usuario;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.datos_usuario));
      localStorage.setItem("authToken", JSON.stringify(action.payload.access_token));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");

    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
