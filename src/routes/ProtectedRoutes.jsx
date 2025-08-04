import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid } from '../utils/validateToken';

const ProtectedRoutes = ({ allowedRoles }) => {
  const auth = useSelector((state) => state.auth);

  const isAuthenticatedAndValid = auth.isAuthenticated && isTokenValid();

  if (!isAuthenticatedAndValid) {
    // Limpieza opcional
    localStorage.removeItem('token');
    // Aquí podrías también resetear el estado en Redux con un logout si tienes action
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
