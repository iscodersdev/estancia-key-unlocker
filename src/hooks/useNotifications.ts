
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    enabled: isAuthenticated,
    staleTime: 0, // No usar cache de React Query, usar nuestro cache personalizado
    refetchOnWindowFocus: false, // Evitar refetch automático
  });
};
