import { Navigate, Outlet, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ROUTES } from '../constants';

export const isAuthenticated = () => Boolean(localStorage.getItem('auth'));

/**
 * Gate for every signed-in screen. It replaces the inline `W` wrapper that
 * used to be repeated around all twenty-odd routes in App.tsx: the layout is
 * applied once here and children render through <Outlet/>.
 *
 * The attempted URL is remembered so login can send the user back to it.
 */
export default function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
