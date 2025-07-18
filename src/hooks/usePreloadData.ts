
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BannerService } from '@/services/bannerService';
import { PromocionService } from '@/services/promotionService';

export const usePreloadData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Precargar banners
    queryClient.prefetchQuery({
      queryKey: ['banners'],
      queryFn: BannerService.getBanners,
      staleTime: 10 * 60 * 1000, // 10 minutos
    });

    // Precargar promociones
    queryClient.prefetchQuery({
      queryKey: ['promotions'],
      queryFn: PromocionService.getPromociones,
      staleTime: 10 * 60 * 1000, // 10 minutos
    });
  }, [queryClient]);
};

// Hook optimizado para banners
export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: BannerService.getBanners,
    staleTime: 10 * 60 * 1000, // 10 minutos - aumentado de 5
    gcTime: 15 * 60 * 1000, // 15 minutos en cache
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook optimizado para promociones
export const usePromotions = () => {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: PromocionService.getPromociones,
    staleTime: 10 * 60 * 1000, // 10 minutos - aumentado de 5
    gcTime: 15 * 60 * 1000, // 15 minutos en cache
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
