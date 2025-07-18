import React, { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notificationService';
import NotificationCard from './NotificationCard';
import NotificationDetailModal from './NotificationDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Loader2, AlertCircle, LogIn, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { NotificacionModel } from '@/types/notificacion';

const NOTIFICATIONS_PER_PAGE = 10;

const NotificationsContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { data, isLoading, error, refetch, isFetching } = useNotifications();
  const { refetch: refetchCount } = useNotificationCount();
  const [displayedCount, setDisplayedCount] = useState(NOTIFICATIONS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificacionModel | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Marcar como leídas todas las notificaciones no leídas cuando se carga la página
  useEffect(() => {
    if (data?.ListNotificaciones && data.ListNotificaciones.length > 0) {
      const unreadNotifications = data.ListNotificaciones.filter(n => !n.Leido);
      if (unreadNotifications.length > 0) {
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
  }, [data?.ListNotificaciones, refetch, refetchCount]);

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleVerDetalle = (notification: NotificacionModel) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedNotification(null);
  };

  const loadMore = useCallback(() => {
    if (!data?.ListNotificaciones || displayedCount >= data.ListNotificaciones.length) return;
    
    setIsLoadingMore(true);
    // Simular un pequeño delay para mostrar el loading
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + NOTIFICATIONS_PER_PAGE, data.ListNotificaciones.length));
      setIsLoadingMore(false);
    }, 500);
  }, [data?.ListNotificaciones, displayedCount]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    
    // Verificar si estamos cerca del final (con un margen de 100px)
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (!isLoadingMore && data?.ListNotificaciones && displayedCount < data.ListNotificaciones.length) {
        loadMore();
      }
    }
  }, [loadMore, isLoadingMore, data?.ListNotificaciones, displayedCount]);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gray-50 px-2 sm:px-4 py-4 sm:py-8 font-gotham">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader className="px-4 py-4">
            <LogIn className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-2 sm:mb-4" />
            <CardTitle className="text-lg sm:text-xl font-gotham">Iniciar Sesión Requerido</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-gotham">
              Necesitas iniciar sesión para ver tus notificaciones.
            </p>
            <Link to="/login">
              <Button className="bg-estancias-charcoal text-white hover:bg-estancias-charcoal/90 font-gotham text-sm sm:text-base">
                Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8 font-gotham">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardContent className="px-6 py-12">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin mx-auto mb-4 text-estancias-charcoal" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 font-gotham">
              Cargando notificaciones
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-gotham">
              Por favor espera mientras obtenemos tus notificaciones...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 px-2 sm:px-4 py-4 sm:py-8 font-gotham">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader className="px-4 py-4">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-500 mb-2 sm:mb-4" />
            <CardTitle className="text-lg sm:text-xl font-gotham">Error al cargar notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-gotham">
              No pudimos cargar tus notificaciones. Por favor, intenta nuevamente.
            </p>
            <Button onClick={() => refetch()} variant="outline" className="font-gotham text-sm sm:text-base">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const notifications = data?.ListNotificaciones || [];
  const displayedNotifications = notifications.slice(0, displayedCount);
  const hasMore = displayedCount < notifications.length;

  // Vista móvil
  if (isMobile) {
    return (
      <div className="w-full bg-white min-h-screen flex flex-col">
        {/* Header con título */}
        <div className="px-4 py-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-600">
            Todas las Notificaciones
          </h2>
        </div>

        {/* Lista de notificaciones con scroll */}
        {notifications.length === 0 ? (
          <div className="text-center py-12 px-4 flex-1 flex flex-col justify-center">
            <Bell className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-300 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2 font-gotham">
              No tienes notificaciones
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-gotham">
              Cuando recibas notificaciones, aparecerán aquí.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div 
              className="px-4"
              onScroll={handleScroll}
            >
              {displayedNotifications.map(notification => (
                <NotificationCard key={notification.Id} notification={notification} />
              ))}
              
              {/* Indicador de carga */}
              {isLoadingMore && (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-gotham">Cargando más notificaciones...</p>
                </div>
              )}
              
              {/* Mensaje cuando ya no hay más notificaciones */}
              {!hasMore && notifications.length > NOTIFICATIONS_PER_PAGE && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 font-gotham">
                    Has visto todas las notificaciones
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    );
  }

  // Vista desktop - ancho completo
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 py-4">
        <Card className="w-full border-0 shadow-sm">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-600 font-normal">
                Todas las Notificaciones
              </CardTitle>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isFetching}
                className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                title="Actualizar notificaciones"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2 font-gotham">
                  No tienes notificaciones
                </h3>
                <p className="text-gray-500 font-gotham">
                  Cuando recibas notificaciones, aparecerán aquí.
                </p>
                <Button 
                  onClick={() => refetch()} 
                  className="mt-4"
                  variant="outline"
                >
                  Recargar
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notificación</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedNotifications.map((notification) => (
                    <TableRow key={notification.Id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bell className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{notification.Titulo}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {notification.Texto}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(notification.Fecha)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          notification.Leido 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.Leido ? 'Leída' : 'Nueva'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerDetalle(notification)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de detalle */}
      <NotificationDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        notification={selectedNotification}
      />
    </div>
  );
};

export default NotificationsContent;
