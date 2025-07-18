
import React, { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, ArrowRight, Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import { notificationService } from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';
import { NotificacionModel } from '@/types/notificacion';

interface NotificationMiniModalProps {
  children: React.ReactNode;
  unreadCount: number;
}

const NotificationMiniModal: React.FC<NotificationMiniModalProps> = ({ children, unreadCount }) => {
  const { data, refetch } = useNotifications();
  const { refetch: refetchCount } = useNotificationCount();
  const navigate = useNavigate();
  const [loadingStates, setLoadingStates] = React.useState<Record<number, boolean>>({});
  const [isOpen, setIsOpen] = React.useState(false);

  // Mostrar solo las últimas 5 notificaciones
  const recentNotifications = data?.ListNotificaciones.slice(0, 5) || [];

  // Marcar como leídas las notificaciones no leídas cuando se abre el modal
  useEffect(() => {
    if (isOpen && recentNotifications.length > 0) {
      const unreadNotifications = recentNotifications.filter(n => !n.Leido);
      if (unreadNotifications.length > 0) {
        // Marcar como leídas todas las notificaciones no leídas visibles
        Promise.all(
          unreadNotifications.map(notification => 
            notificationService.markAsRead(notification.Id, true)
          )
        ).then(() => {
          refetch();
          refetchCount();
        }).catch(error => {
          console.error('Error al marcar notificaciones como leídas:', error);
        });
      }
    }
  }, [isOpen, recentNotifications, refetch, refetchCount]);

  const handleMarkAsRead = async (notificationId: number, currentStatus: boolean) => {
    setLoadingStates(prev => ({ ...prev, [notificationId]: true }));
    try {
      await notificationService.markAsRead(notificationId, !currentStatus);
      await refetch();
      await refetchCount();
    } catch (error) {
      console.error('Error al cambiar estado de notificación:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notificaciones');
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-estancias-charcoal font-gotham">
              Notificaciones
            </h3>
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-blue-500 text-white font-gotham text-xs">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>

          {recentNotifications.length === 0 ? (
            <div className="text-center py-4">
              <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-gotham">
                No tienes notificaciones
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentNotifications.map((notification: NotificacionModel) => (
                <div
                  key={notification.Id}
                  className={`p-2 rounded-lg border ${
                    !notification.Leido ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-estancias-charcoal font-gotham truncate">
                        {notification.Titulo}
                      </h4>
                      <p className="text-xs text-gray-600 font-gotham line-clamp-2 mt-1">
                        {notification.Texto}
                      </p>
                      <p className="text-xs text-gray-400 font-gotham mt-1">
                        {formatDate(notification.Fecha)}
                      </p>
                    </div>
                    <div className="flex items-center ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMarkAsRead(notification.Id, notification.Leido)}
                        disabled={loadingStates[notification.Id]}
                      >
                        {loadingStates[notification.Id] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : notification.Leido ? (
                          <X className="h-3 w-3 text-gray-500" />
                        ) : (
                          <Check className="h-3 w-3 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recentNotifications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-between text-sm font-gotham"
                onClick={handleViewAll}
              >
                Ver todas las notificaciones
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationMiniModal;
