
import React, { useState } from 'react';
import { NotificacionModel } from '@/types/notificacion';
import { DollarSign } from 'lucide-react';
import NotificationDetailModal from './NotificationDetailModal';

interface NotificationCardProps {
  notification: NotificacionModel;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    // El formato viene como DD/MM/YYYY, lo convertimos para mostrar
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleVerDetalle = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center space-x-3 py-4 border-b border-gray-200 last:border-b-0">
        {/* Icono circular */}
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <DollarSign className="h-6 w-6 text-gray-600" />
        </div>
        
        {/* Contenido de la notificación */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {notification.Titulo}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            Fecha: {formatDate(notification.Fecha)}
          </p>
          <button 
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={handleVerDetalle}
          >
            Ver Detalle
          </button>
        </div>
      </div>

      <NotificationDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notification={notification}
      />
    </>
  );
};

export default NotificationCard;
