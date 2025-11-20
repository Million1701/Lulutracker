import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export const ProtectedRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
