
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';

interface ComprobanteDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  comprobante: any;
}

const ComprobanteDetalleModal: React.FC<ComprobanteDetalleModalProps> = ({
  isOpen,
  onClose,
  comprobante
}) => {
  if (!comprobante) return null;

  const getComprobanteImageSrc = (comprobantePago: any) => {
    if (!comprobantePago) return null;
    
    // Si es un objeto con _type y value
    if (typeof comprobantePago === 'object' && comprobantePago._type === 'String' && comprobantePago.value) {
      // Verificar si ya tiene el prefijo data:image
      if (comprobantePago.value.startsWith('data:image')) {
        return comprobantePago.value;
      }
      // Si es base64 sin prefijo, agregarlo
      return `data:image/jpeg;base64,${comprobantePago.value}`;
    }
    
    // Si es una string directa
    if (typeof comprobantePago === 'string') {
      if (comprobantePago.startsWith('data:image')) {
        return comprobantePago;
      }
      return `data:image/jpeg;base64,${comprobantePago}`;
    }
    
    return null;
  };

  const formatDate = (dateString: string) => {
    if (dateString === "1/1/0001 12:00:00 AM") {
      return "Sin fecha";
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  const imageSrc = getComprobanteImageSrc(comprobante.ComprobantePago);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-gray-100 border-0 shadow-lg">
        {/* Header */}
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
            Mis Comprobantes
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {/* Card container */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Imagen del comprobante */}
            <div className="bg-gray-50 rounded-xl overflow-hidden mb-6">
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt="Comprobante" 
                  className="w-full h-auto object-contain max-h-80"
                  onError={(e) => {
                    console.error('Error cargando imagen:', e);
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="w-full h-40 flex items-center justify-center text-gray-400 text-sm"
                style={{ display: imageSrc ? 'none' : 'flex' }}
              >
                NO HAY IMAGEN DISPONIBLE
              </div>
            </div>

            {/* Estado */}
            <div className="text-center mb-4">
              <span className={`text-lg font-semibold ${
                comprobante.EstadoPagoDescripcion === 'Pendiente' ? 'text-orange-600' : 
                comprobante.EstadoPagoDescripcion === 'Pagado' ? 'text-black' : 
                'text-red-600'
              }`}>
                {comprobante.EstadoPagoDescripcion}
              </span>
            </div>

            {/* Fecha */}
            <div className="text-center text-gray-600 text-sm mb-6">
              <p>Fecha: {formatDate(comprobante.FechaComprobante)}</p>
            </div>

            {/* Botón Volver */}
            <div className="flex justify-center">
              <Button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-8 py-2 text-sm font-medium"
                variant="ghost"
              >
                Volver
              </Button>
            </div>

            {/* Detalles adicionales (si existen) */}
            {(comprobante.NroTarjeta || (comprobante.MontoAdeudado && comprobante.MontoAdeudado !== "0.00") || (comprobante.FechaPagoProximaCuota && comprobante.FechaPagoProximaCuota !== "1/1/0001 12:00:00 AM")) && (
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                {comprobante.NroTarjeta && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Número de Tarjeta</p>
                    <p className="text-sm font-medium font-mono">
                      {comprobante.NroTarjeta}
                    </p>
                  </div>
                )}

                {comprobante.MontoAdeudado && comprobante.MontoAdeudado !== "0.00" && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Monto Adeudado</p>
                    <p className="text-sm font-medium">
                      ${comprobante.MontoAdeudado}
                    </p>
                  </div>
                )}

                {comprobante.FechaPagoProximaCuota && comprobante.FechaPagoProximaCuota !== "1/1/0001 12:00:00 AM" && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Próximo Pago</p>
                    <p className="text-sm font-medium">
                      {formatDate(comprobante.FechaPagoProximaCuota)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprobanteDetalleModal;
