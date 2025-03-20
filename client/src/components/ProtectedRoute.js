import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const userRole = sessionStorage.getItem('userRole');
  const userId = sessionStorage.getItem('userId');

  if (!userId || !userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;