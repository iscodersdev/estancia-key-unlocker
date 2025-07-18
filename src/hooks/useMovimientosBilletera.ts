
import { useQuery } from '@tanstack/react-query';
import { obtenerMovimientosBilletera } from '@/services/billeteraService';

export const useMovimientosBilletera = (nroTarjeta?: string) => {
  return useQuery({
    queryKey: ['movimientos-billetera', nroTarjeta],
    queryFn: () => obtenerMovimientosBilletera(nroTarjeta),
    enabled: !!nroTarjeta,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
