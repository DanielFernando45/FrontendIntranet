// src/context/AuthContext.js
import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("authToken", action.payload.access_token);
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true,
      });

      if (res.status === 200 && res.data.user) {
        dispatch({ type: "LOGIN", payload: res.data.user });
      }
    } catch (err) {
      console.log("No autenticado", err);
    }
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchUser();
    }
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

