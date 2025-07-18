
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PagoFallido: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Obtener parámetros de la URL de MercadoPago para logging
    const query = new URLSearchParams(location.search);
    const paymentId = query.get("payment_id");
    const status = query.get("status");
    const merchantOrderId = query.get("merchant_order_id");

    console.log("Pago fallido - ID del pago:", paymentId);
    console.log("Pago fallido - Estado:", status);
    console.log("Pago fallido - Merchant Order ID:", merchantOrderId);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/mi-tarjeta');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, location.search]);

  const handleVolverTarjeta = () => {
    navigate('/mi-tarjeta');
  };

  const handleIntentarNuevamente = () => {
    navigate('/mi-tarjeta');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        {/* Símbolo de error rojo grande */}
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <X className="w-12 h-12 text-white stroke-[3]" />
        </div>

        {/* Mensaje principal */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          No pudimos procesar tu pago
        </h1>

        {/* Mensaje descriptivo */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Tu pago no pudo ser procesado. Esto puede deberse a fondos insuficientes, 
          problemas con la tarjeta o cancelación del proceso.
        </p>

        {/* Botones de acción */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={handleIntentarNuevamente}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Intentar nuevamente
          </Button>
          
          <Button
            onClick={handleVolverTarjeta}
            variant="outline"
            className="w-full py-3 rounded-lg font-medium"
          >
            Volver a mi tarjeta
          </Button>
        </div>

        {/* Contador automático */}
        <div className="flex items-center justify-center text-sm text-gray-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>Redirigiendo automáticamente en {countdown} segundos</span>
        </div>
      </div>
    </div>
  );
};

export default PagoFallido;
