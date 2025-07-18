
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Loader2, ChevronDown } from 'lucide-react';
import { getComprobanteImageSrc, formatDate } from '@/utils/comprobanteUtils';

interface ComprobantesMobileViewProps {
  isLoading: boolean;
  isFetching: boolean;
  comprobantesToShow: any[];
  hasMore: boolean;
  handleGoBack: () => void;
  handleSubirNuevo: () => void;
  handleVerDetalle: (comprobante: any) => void;
  handleLoadMore: () => void;
  refetch: () => void;
}

const ComprobantesMobileView: React.FC<ComprobantesMobileViewProps> = ({
  isLoading,
  isFetching,
  comprobantesToShow,
  hasMore,
  handleGoBack,
  handleSubirNuevo,
  handleVerDetalle,
  handleLoadMore,
  refetch
}) => {
  const navigate = useNavigate();

  const handleSubirNuevoClick = () => {
    navigate('/metodos-pago');
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header negro */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleGoBack}
            className="mr-3 text-white hover:bg-gray-800 h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-medium">Mis Comprobantes</h2>
        </div>
      </div>

      {/* Indicador de actualización en la parte superior */}
      {isFetching && !isLoading && (
        <div className="bg-blue-50 border-b border-blue-100 p-3">
          <div className="flex items-center justify-center text-blue-600">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-sm">Actualizando comprobantes...</span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header con título y botón */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base text-gray-600 font-normal">Todos tus Comprobantes</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-full px-3 py-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
            onClick={handleSubirNuevoClick}
          >
            <Upload className="w-3 h-3 mr-1" />
            Subir Nuevo
          </Button>
        </div>

        {/* Estado de carga inicial */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-gray-400" />
            <p className="text-gray-500 font-medium text-sm">
              Cargando comprobantes...
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Por favor espera un momento
            </p>
          </div>
        ) : comprobantesToShow.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3">
              <img 
                src="/lovable-uploads/ef268b88-351c-4338-a09e-cb12638b05d3.gif" 
                alt="Sin comprobantes" 
                className="w-full h-full object-contain opacity-50"
              />
            </div>
            <p className="text-gray-500 font-medium text-xs">
              No se encontraron comprobantes disponibles
            </p>
            <Button 
              onClick={() => refetch()} 
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Recargar
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {comprobantesToShow.map((comprobante, index) => {
              const imageSrc = getComprobanteImageSrc(comprobante.ComprobantePago);
              
              return (
                <div key={index} className="bg-white rounded-lg p-3 flex items-center space-x-3">
                  {/* Imagen del comprobante */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imageSrc ? (
                      <img 
                        src={imageSrc} 
                        alt="Comprobante" 
                        className="w-full h-full object-cover"
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
                    <span 
                      className="text-xs text-gray-500 text-center px-1"
                      style={{ display: imageSrc ? 'none' : 'flex' }}
                    >
                      NO HAY FOTO
                    </span>
                  </div>

                  {/* Información del comprobante */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        comprobante.EstadoPagoDescripcion === 'Pendiente' ? 'text-orange-600' : 
                        comprobante.EstadoPagoDescripcion === 'Pagado' ? 'text-green-600' : 
                        'text-red-600'
                      }`}>
                        {comprobante.EstadoPagoDescripcion}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      Fecha: {formatDate(comprobante.FechaComprobante)}
                    </p>
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => handleVerDetalle(comprobante)}
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              );
            })}
            
            {/* Botón cargar más */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="rounded-full"
                >
                  {isFetching ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  )}
                  Cargar más comprobantes
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprobantesMobileView;
