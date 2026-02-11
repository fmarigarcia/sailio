import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '@/modules/auth';
import { Spinner } from '@/ui/icons';
import './loading-screen.css';

/**
 * Componente que protege rutas de autenticación.
 * Si ya hay un usuario autenticado, redirige al dashboard.
 */
const PublicRoute = () => {
  const { data: user, isLoading } = useProfile();
  console.log('🚀 ~ PublicRoute ~ user:', user);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <Spinner size={48} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense
      fallback={
        <div className="loading-screen">
          <Spinner size={48} />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
};

export { PublicRoute };
