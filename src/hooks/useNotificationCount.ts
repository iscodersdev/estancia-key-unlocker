
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import { pushNotificationService } from '@/services/pushNotificationService';
import { useEffect } from 'react';

export const useNotificationCount = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notification-count'],
    queryFn: async () => {
      const result = await notificationService.getNotifications();
      return {
        total: result.CantidadNotificaciones,
        unread: result.CantidadNotificacionesNoLeida,
        hasUnread: result.NotificacionNoLeida
      };
    },
    enabled: isAuthenticated,
    staleTime: 0, // No usar cache de React Query
    refetchInterval: 60 * 1000, // Refetch cada minuto desde la API
    refetchOnWindowFocus: false,
  });

  // Solicitar permisos de notificación cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      pushNotificationService.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permisos de notificación concedidos');
        }
      });
    }
  }, [isAuthenticated]);

  return {
    unreadCount: data?.unread || 0, // Solo las no leídas
    totalCount: data?.total || 0,
    hasUnread: data?.hasUnread || false,
    isLoading,
    error,
    refetch
  };
};
