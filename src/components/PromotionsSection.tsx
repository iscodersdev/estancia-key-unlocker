
import { usePromotions } from '@/hooks/usePreloadData';
import type { Promotion } from '@/services/promotionService';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import QRModal from './QRModal';
import PromocionesCarousel from './PromocionesCarousel';
import PromocionCard from './PromocionCard';
import { PromocionService } from '@/services/promotionService';

const PromotionsSection = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState(false);

  const { data: promotions = [], isLoading, error } = usePromotions();

  const handlePromotionAction = async (promotion: Promotion) => {
    console.log('Acción de promoción:', promotion);

    // Si tiene link externo, abrirlo
    if (promotion.Link) {
      window.open(promotion.Link, '_blank');
      return;
    }

    // Si tiene QR y el usuario está autenticado
    if (promotion.QR && isAuthenticated) {
      try {
        const response = await PromocionService.solicitarPromocion("", promotion.Id);
        console.log('Respuesta QR:', response);
        
        if (response.success && response.QR) {
          setSelectedPromotion(promotion);
          setQrCode(response.QR);
          setShowQRModal(true);
        } else {
          toast({
            title: "Error",
            description: response.message || "No se pudo obtener el código QR",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error solicitando QR:', error);
        toast({
          title: "Error",
          description: "No se pudo solicitar la promoción. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    } else if (promotion.QR && !isAuthenticated) {
      toast({
        title: "Iniciar Sesión",
        description: "Debes iniciar sesión para solicitar promociones",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estancias-charcoal"></div>
        <span className="ml-2 text-gray-600">Cargando promociones...</span>
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

  if (!promotions || promotions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay promociones disponibles en este momento</p>
      </div>
    );
  }

  // Separar promociones permanentes (fijas)
  const promocionesPermanentes = promotions.filter(p => p.PromocionFija && p.Activa);

  return (
    <>
      {/* Carrusel de promociones destacadas */}
      <PromocionesCarousel 
        promociones={promotions}
        onPromocionClick={handlePromotionAction}
      />

      {/* Promociones permanentes */}
      {promocionesPermanentes.length > 0 && (
        <div className="mt-8 px-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promocionesPermanentes.map((promotion) => (
              <PromocionCard
                key={promotion.Id}
                promocion={promotion}
                onClick={() => handlePromotionAction(promotion)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedPromotion && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setSelectedPromotion(null);
            setQrCode('');
          }}
          qrCode={qrCode}
          promotionTitle={selectedPromotion.Titulo}
        />
      )}
    </>
  );
};

export default PromotionsSection;
