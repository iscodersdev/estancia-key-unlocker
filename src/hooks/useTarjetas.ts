
import { useQuery } from '@tanstack/react-query';
import { obtenerTarjetas } from '@/services/tarjetasService';

export const useTarjetas = () => {
  const {
    data: tarjetas = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tarjetas'],
    queryFn: obtenerTarjetas,
  });

  return {
    tarjetas,
    isLoading,
    error,
    refetch
  };
};
