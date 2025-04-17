import { Navigate, Outlet } from 'react-router-dom';
import { useVerify } from '../../hooks/useVerify';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useVerify();
  
  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};