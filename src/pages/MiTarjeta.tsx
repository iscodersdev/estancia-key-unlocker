import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TarjetaPrincipal from '@/components/TarjetaPrincipal';
import EstadoTarjeta from '@/components/EstadoTarjeta';
import AccionesRapidas from '@/components/AccionesRapidas';
import UltimosMovimientos from '@/components/UltimosMovimientos';
import { useMovimientos } from '@/hooks/useMovimientos';
import { useAuth } from '@/context/AuthContext';
import { createPaymentPreference, redirectToPayment } from '@/services/mercadoPagoService';
import { useToast } from '@/hooks/use-toast';

const MiTarjeta: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Si no está autenticado, no mostrar nada mientras redirige
  if (!isAuthenticated) {
    return null;
  }

  // Obtener datos del usuario del localStorage
  const userData = localStorage.getItem('USER');
  const parsedUserData = userData ? JSON.parse(userData) : null;

  // Usar el número de tarjeta real del login
  const numeroTarjetaReal = parsedUserData?.NroTarjeta || '0000000500022911';
  
  // Obtener movimientos y datos de tarjeta de la API
  const { movimientos, datosTarjeta, isLoading: isLoadingMovimientos } = useMovimientos(numeroTarjetaReal);

  const toggleCardDetailsVisibility = () => {
    setShowCardDetails(!showCardDetails);
  };

  const handleMisComprasClick = () => {
    navigate('/mis-compras');
  };

  const handleMisPagosClick = () => {
    navigate('/mis-pagos');
  };

  const handleMisComprobantesClick = () => {
    navigate('/mis-comprobantes');
  };

  const handleMiResumenClick = () => {
    navigate('/mi-resumen');
  };

  const handlePagarClick = () => {
    navigate('/metodos-pago');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Tarjeta Principal */}
      <TarjetaPrincipal
        showCardDetails={showCardDetails}
        onToggleVisibility={toggleCardDetailsVisibility}
        numeroTarjeta={numeroTarjetaReal}
        nombreTitular={`${parsedUserData?.Nombres || 'USUARIO'} ${parsedUserData?.Apellido || 'DEMO'}`}
        montoDisponible={datosTarjeta?.montoDisponible || '$500.000,00'}
      />

      <div className="p-4 space-y-6">
        {/* Status Card */}
        <EstadoTarjeta 
          montoAdeudado={datosTarjeta?.montoAdeudado}
          isLoading={isLoadingMovimientos}
          onPagarClick={handlePagarClick}
        />

        {/* Quick Actions */}
        <AccionesRapidas
          onMisComprasClick={handleMisComprasClick}
          onMisPagosClick={handleMisPagosClick}
          onMisComprobantesClick={handleMisComprobantesClick}
          onMiResumenClick={handleMiResumenClick}
        />

        {/* Recent Movements */}
        <UltimosMovimientos
          movimientos={movimientos}
          isLoading={isLoadingMovimientos}
          onVerTodosClick={handleMisComprasClick}
        />
      </div>
    </div>
  );
};

export default MiTarjeta;
