import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '@/modules/auth';
import { Spinner } from '@/ui/icons';
import './loading-screen.css';

/**
 * Componente que protege rutas requiriendo autenticación.
 * Si no hay usuario, redirige al login.
 */
const ProtectedRoute = () => {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <Spinner size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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

export { ProtectedRoute };
