
import React from 'react';
import { usePromotions } from '@/hooks/usePreloadData';
import PromocionesCarousel from './PromocionesCarousel';
import PromocionCard from './PromocionCard';
import PromocionQRDialog from './PromocionQRDialog';
import { usePromotionActions } from '@/hooks/usePromotionActions';
import { Loader2 } from 'lucide-react';

const PromocionesContent: React.FC = () => {
  const { data: promociones = [], isLoading, error } = usePromotions();

  const {
    showQRDialog,
    qrImage,
    selectedPromotion,
    handlePromocionClick,
    closeQRDialog
  } = usePromotionActions();

  const promocionesFijas = promociones.filter(p => p.PromocionFija && p.Activa);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-estancias-charcoal mb-4" />
        <p className="text-gray-600">Cargando Promociones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las promociones</p>
        <p className="text-sm text-gray-500 mt-2">Por favor, intenta nuevamente más tarde</p>
      </div>
    );
  }

  return (
    <>
      {/* Header de la página */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Acá podes encontrar
            </p>
            <h2 className="text-xl font-bold text-estancias-charcoal">
              ¡Todas nuestras Promociones para vos!
            </h2>
          </div>
        </div>
      </div>

      {/* Contenido de promociones */}
      <div className="px-4 py-6">
        {/* Carrusel de promociones destacadas - SIEMPRE PRESENTE */}
        <div className="mb-8">
          <PromocionesCarousel
            promociones={promociones}
            onPromocionClick={handlePromocionClick}
          />
        </div>

        {/* Lista de promociones fijas */}
        {promocionesFijas.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promocionesFijas.map((promocion) => (
              <PromocionCard
                key={promocion.Id}
                promocion={promocion}
                onClick={() => handlePromocionClick(promocion)}
              />
            ))}
          </div>
        )}

        {promociones.length === 0 && (
          <div className="text-center p-8">
            <p className="text-gray-600">No hay promociones disponibles en este momento.</p>
          </div>
        )}
      </div>

      {/* Dialog para mostrar QR */}
      <PromocionQRDialog
        isOpen={showQRDialog}
        onClose={closeQRDialog}
        qrImage={qrImage}
        selectedPromotion={selectedPromotion}
      />
    </>
  );
};

export default PromocionesContent;
