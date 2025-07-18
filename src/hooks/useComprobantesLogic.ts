
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useComprobantes } from '@/hooks/useComprobantes';
import { useAuth } from '@/context/AuthContext';

export const useComprobantesLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: comprobantes, isLoading, error, refetch, isFetching } = useComprobantes();
  const [selectedComprobante, setSelectedComprobante] = useState<any>(null);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isSubirModalOpen, setIsSubirModalOpen] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);
  const previousPathRef = useRef<string>('/mi-tarjeta'); // Default fallback

  // Capturar la pantalla anterior cuando se llega a mis-comprobantes
  useEffect(() => {
    // Si hay un state con from, usarlo, sino usar el referrer del navegador
    if (location.state?.from) {
      previousPathRef.current = location.state.from;
    } else if (document.referrer) {
      // Extraer el path del referrer si viene de la misma app
      try {
        const referrerUrl = new URL(document.referrer);
        if (referrerUrl.origin === window.location.origin) {
          previousPathRef.current = referrerUrl.pathname;
        }
      } catch (e) {
        // Si hay error parseando el referrer, mantener el default
      }
    }
  }, [location.state]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Verificar si debe refrescar los comprobantes al llegar desde confirmación
  useEffect(() => {
    if (location.state?.shouldRefresh) {
      refetch();
      // Limpiar el state después de usarlo
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, refetch, navigate, location.pathname]);

  // Configurar actualización automática cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Reiniciar itemsToShow cuando lleguen nuevos datos
  useEffect(() => {
    if (comprobantes && comprobantes.length > 0) {
      // Solo reiniciar si es la primera carga o si hay menos comprobantes que antes
      if (itemsToShow > comprobantes.length) {
        setItemsToShow(Math.min(10, comprobantes.length));
      }
    }
  }, [comprobantes]);

  // Agregar logs para debug
  console.log('MisComprobantes - Estado de la query:', {
    isLoading,
    error,
    comprobantes,
    dataType: typeof comprobantes,
    isArray: Array.isArray(comprobantes),
    itemsToShow,
    totalComprobantes: Array.isArray(comprobantes) ? comprobantes.length : 0,
    previousPath: previousPathRef.current
  });

  // Obtener comprobantes limitados para mostrar
  const comprobantesData = Array.isArray(comprobantes) ? comprobantes : [];
  const comprobantesToShow = comprobantesData.slice(0, itemsToShow);
  const hasMore = comprobantesData.length > itemsToShow;

  const handleRefresh = () => {
    // Resetear a los primeros 10 al refrescar
    setItemsToShow(10);
    refetch();
  };

  const handleGoBack = () => {
    navigate(previousPathRef.current);
  };

  const handleSubirNuevo = () => {
    navigate('/metodos-pago');
  };

  const handleSubirModalClose = () => {
    setIsSubirModalOpen(false);
  };

  const handleSubirModalSuccess = () => {
    // Resetear a los primeros 10 después de subir un nuevo comprobante
    setItemsToShow(10);
    refetch();
    setIsSubirModalOpen(false);
  };

  const handleVerDetalle = (comprobante: any) => {
    setSelectedComprobante(comprobante);
    setIsDetalleModalOpen(true);
  };

  const handleCloseDetalleModal = () => {
    setIsDetalleModalOpen(false);
    setSelectedComprobante(null);
  };

  const handleLoadMore = () => {
    // Cargar 10 más cada vez
    setItemsToShow(prev => prev + 10);
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    isFetching,
    comprobantesToShow,
    hasMore,
    selectedComprobante,
    isDetalleModalOpen,
    isSubirModalOpen,
    handleRefresh,
    handleGoBack,
    handleSubirNuevo,
    handleSubirModalClose,
    handleSubirModalSuccess,
    handleVerDetalle,
    handleCloseDetalleModal,
    handleLoadMore,
    refetch
  };
};
