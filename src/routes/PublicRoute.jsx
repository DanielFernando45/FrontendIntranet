import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/validateToken';

const PublicRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  const isAuthenticatedAndValid = auth.isAuthenticated && isTokenValid();

  if (isAuthenticatedAndValid) {
    switch (auth.user.role) {
      case 'estudiante':
        return <Navigate to="/estudiante/home" replace />;
      case 'admin':
        return <Navigate to="/admin/gestionar-usuarios" replace />;
      case 'asesor':
        return <Navigate to="/asesor/home" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default PublicRoute;
