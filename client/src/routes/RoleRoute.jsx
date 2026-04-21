import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/streamers" replace />;
  }

  return children;
}

export default RoleRoute;
