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

  if (currentUser.rol !== requiredRole) {
    const redirectPath = currentUser.rol === 'estudiante' ? '/inicio-estudiante' : '/inicio-empresa';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;