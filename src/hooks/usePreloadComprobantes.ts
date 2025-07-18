
import { useEffect } from 'react';
import { useComprobantes } from './useComprobantes';
import { useAuth } from '@/context/AuthContext';

// Hook para precargar comprobantes automáticamente cuando el usuario está autenticado
export const usePreloadComprobantes = () => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useComprobantes();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Precargando comprobantes para usuario autenticado...');
    }
  }, [isAuthenticated]);

  return {
    data,
    isLoading,
    error,
    isPreloaded: !!data && !isLoading
  };
};
