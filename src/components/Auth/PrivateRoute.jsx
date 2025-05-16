import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();

  console.log(currentUser);
  console.log(requiredRole);
  // If there's no user, redirect to login
  if (currentUser === false) {
    console.log("no user");
    return <Navigate to={`/login-${requiredRole}`} />;
  }

  // If user role doesn't match required role, redirect to appropriate login
  if (currentUser.tipo !== requiredRole) {
    console.log("no role");
    return <Navigate to={`/login-${requiredRole}`} />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default PrivateRoute;