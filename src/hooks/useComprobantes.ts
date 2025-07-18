
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { obtenerComprobantes } from '@/services/comprobantesService';
import { useAuth } from '@/context/AuthContext';

export const useComprobantes = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Obtener el UAT del localStorage donde se almacena como authToken
  const currentToken = localStorage.getItem('authToken');
  
  // Crear una query key única por usuario usando el token UAT
  const queryKey = ['comprobantes', currentToken];
  
  const query = useQuery({
    queryKey,
    queryFn: obtenerComprobantes,
    staleTime: 5 * 60 * 1000, // 5 minutos
    // Cambio principal: activar la query inmediatamente cuando hay usuario autenticado
    enabled: !!isAuthenticated && !!currentToken, // Se ejecuta automáticamente al estar autenticado
  });

  // Función para invalidar manualmente la query de comprobantes
  const invalidateComprobantes = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    invalidateComprobantes,
  };
};
