import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

export const ProtectedRoute = () => {
    const isAuthenticated = !!Cookies.get('auth_token');
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    // renders the child route elms
    return <Outlet />;
  };