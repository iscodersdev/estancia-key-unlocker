
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useComprobantesLogic } from '@/hooks/useComprobantesLogic';
import ComprobantesMobileView from '@/components/comprobantes/ComprobantesMobileView';
import ComprobantesDesktopView from '@/components/comprobantes/ComprobantesDesktopView';
import ComprobanteDetalleModal from '@/components/ComprobanteDetalleModal';
import { SubirComprobanteModal } from '@/components/SubirComprobanteModal';

const MisComprobantes: React.FC = () => {
  const isMobile = useIsMobile();
  const {
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
  } = useComprobantesLogic();

  // Si no está autenticado, no mostrar nada mientras redirige
  if (!isAuthenticated) {
    return null;
  }

  // Obtener comprobantes data para desktop view
  const comprobantesData = Array.isArray(comprobantesToShow) ? comprobantesToShow : [];
  const itemsToShow = comprobantesToShow.length;

  return (
    <>
      {isMobile ? (
        <ComprobantesMobileView
          isLoading={isLoading}
          isFetching={isFetching}
          comprobantesToShow={comprobantesToShow}
          hasMore={hasMore}
          handleGoBack={handleGoBack}
          handleSubirNuevo={handleSubirNuevo}
          handleVerDetalle={handleVerDetalle}
          handleLoadMore={handleLoadMore}
          refetch={refetch}
        />
      ) : (
        <ComprobantesDesktopView
          isLoading={isLoading}
          isFetching={isFetching}
          error={error}
          comprobantesToShow={comprobantesToShow}
          hasMore={hasMore}
          comprobantesData={comprobantesData}
          itemsToShow={itemsToShow}
          handleSubirNuevo={handleSubirNuevo}
          handleRefresh={handleRefresh}
          handleVerDetalle={handleVerDetalle}
          handleLoadMore={handleLoadMore}
          refetch={refetch}
        />
      )}

      {/* Modales */}
      <ComprobanteDetalleModal
        isOpen={isDetalleModalOpen}
        onClose={handleCloseDetalleModal}
        comprobante={selectedComprobante}
      />
      
      <SubirComprobanteModal
        isOpen={isSubirModalOpen}
        onClose={handleSubirModalClose}
        onSuccess={handleSubirModalSuccess}
      />
    </>
  );
};

export default MisComprobantes;
