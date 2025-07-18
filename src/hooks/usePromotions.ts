
import { useQuery, useMutation } from '@tanstack/react-query';
import { PromocionService } from '@/services/promotionService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePromotions = () => {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: PromocionService.getPromociones,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRequestPromotionQR = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (promotionId: number) => {
      if (!isAuthenticated) {
        throw new Error('Debes iniciar sesión para solicitar el QR de la promoción');
      }
      return PromocionService.solicitarPromocion("", promotionId);
    },
    onError: (error: Error) => {
      console.error('Error solicitando QR:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast({
          title: "Error",
          description: data.message || "No se pudo obtener el QR",
          variant: "destructive",
        });
      }
    }
  });
};
