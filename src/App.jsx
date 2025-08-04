// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import spinner from "./assets/icons/spinner.svg";
import Login from "./pages/LoginUser";
import RouterApp from "./routes/RouterApp";
import { AuthProvider } from "./context/authContext";
import PublicRoute from "./routes/PublicRoute";

export const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="bg-[#ffff] min-h-screen flex items-center justify-center">
            <img
              src={spinner}
              className="w-[100px] h-[200px] animate-spin"
              alt="spinner"
            />
          </div>
        }
      >
        <Routes>
          <Route path="/*" element={<RouterApp />} />
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
            {/* <Route path="/" element={<Login />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
