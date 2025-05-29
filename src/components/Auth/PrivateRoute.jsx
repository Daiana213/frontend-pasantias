import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un componente de carga
  }

  if (!currentUser) {
    return <Navigate to={`/login-${requiredRole}`} replace />;  
  }

  if (currentUser.role !== requiredRole) { // Cambiar rol a role
    const redirectPath = currentUser.role === 'estudiante' ? '/inicio-estudiante' : '/inicio-empresa'; // Cambiar rol a role
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;