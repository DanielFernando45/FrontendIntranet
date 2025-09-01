

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/validateToken';

const PublicRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  const isAuthenticatedAndValid = auth.isAuthenticated && isTokenValid();
 
  if (isAuthenticatedAndValid) {
    switch (auth.user.role.nombre) {
      case 'estudiante':
        return <Navigate to="/estudiante/home" replace />;
      case 'admin':
        return <Navigate to="/admin/gestionar-usuarios" replace />;
      case 'asesor':
        return <Navigate to="/asesor/home" replace />;
      case 'jefe_operaciones':
        return <Navigate to="/jefe-operaciones/gestionar-usuarios" replace />;
      case 'supervisor':
        return <Navigate to="/supervisor/asignaciones" replace />;  
      case 'contrato_pago':
        return <Navigate to="/cont-pago/contratos" replace />;
      case 'marketing':
        return <Navigate to="/marketing/ConfigIntra" replace />;
      case 'soporte':
        return <Navigate to="/soporte-ti" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }
  return children;
};

export default PublicRoute;
