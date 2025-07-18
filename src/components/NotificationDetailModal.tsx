
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NotificacionModel } from '@/types/notificacion';

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificacionModel | null;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  isOpen,
  onClose,
  notification
}) => {
  if (!notification) return null;

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-0 p-0 bg-gray-100 border-0 shadow-lg">
        {/* Header negro */}
        <DialogHeader className="bg-black text-white p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute left-3 top-3 text-white hover:bg-gray-800 h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <DialogTitle className="text-lg font-medium text-center">
            Notificaciones
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {/* Card container con esquinas redondeadas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Título ESTANCIAS */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold tracking-widest text-black">
                ESTANCIAS
              </h2>
            </div>

            {/* Título del detalle */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-black">
                Detalle de Notificación
              </h3>
            </div>

            {/* Contenido de la notificación */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Título:</p>
                <p className="text-base font-medium text-black">
                  {notification.Titulo}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha:</p>
                <p className="text-base font-medium text-black">
                  {formatDate(notification.Fecha)}
                </p>
              </div>

              {notification.Texto && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Descripción:</p>
                  <p className="text-base text-black">
                    {notification.Texto}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1">Estado:</p>
                <p className="text-base font-medium text-black">
                  {notification.Leido ? 'Leída' : 'No leída'}
                </p>
              </div>
            </div>

            {/* Botón Volver */}
            <div className="flex justify-end items-center">
              <Button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-6 py-2 text-sm font-medium flex items-center gap-2"
                variant="ghost"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDetailModal;
