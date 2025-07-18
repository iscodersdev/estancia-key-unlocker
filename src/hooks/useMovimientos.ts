
import { useQuery } from '@tanstack/react-query';
import { obtenerMovimientos } from '@/services/movimientosService';

export const useMovimientos = (nroTarjeta: string) => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['movimientos', nroTarjeta],
    queryFn: () => obtenerMovimientos(nroTarjeta),
    enabled: !!nroTarjeta,
  });

  return {
    movimientos: data?.movimientos || [],
    datosTarjeta: data?.datosTarjeta,
    isLoading,
    error,
    refetch
  };
};
