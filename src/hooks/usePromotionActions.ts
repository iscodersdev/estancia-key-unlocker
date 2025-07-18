
import { useState } from 'react';
import { PromocionModel } from '@/types/promocion';
import { PromocionService } from '@/services/promotionService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePromotionActions = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<PromocionModel | null>(null);

  const handlePromocionClick = async (promocion: PromocionModel) => {
    console.log('Acción de promoción:', promocion);

    // Si tiene link externo, abrirlo
    if (promocion.Link) {
      window.open(promocion.Link, '_blank');
      return;
    }

    // Si tiene QR y el usuario está autenticado
    if (promocion.QR && isAuthenticated) {
      try {
        const response = await PromocionService.solicitarPromocion("", promocion.Id);
        console.log('Respuesta QR:', response);
        
        if (response.success && response.QR) {
          setSelectedPromotion(promocion);
          const qrData = response.QR.startsWith('data:') 
            ? response.QR 
            : `data:image/png;base64,${response.QR}`;
          setQrImage(qrData);
          setShowQRDialog(true);
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
    } else if (promocion.QR && !isAuthenticated) {
      toast({
        title: "Iniciar Sesión",
        description: "Debes iniciar sesión para solicitar promociones",
        variant: "destructive",
      });
    }
  };

  const closeQRDialog = () => {
    setShowQRDialog(false);
    setSelectedPromotion(null);
    setQrImage(null);
  };

  return {
    showQRDialog,
    qrImage,
    selectedPromotion,
    handlePromocionClick,
    closeQRDialog
  };
};
