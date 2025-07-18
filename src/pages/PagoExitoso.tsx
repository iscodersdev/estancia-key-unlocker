import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const PagoExitoso: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    // Obtener parámetros de la URL de MercadoPago
    const query = new URLSearchParams(location.search);
    const paymentId = query.get("payment_id");
    const status = query.get("status");
    const merchantOrderId = query.get("merchant_order_id");

    console.log("ID del pago:", paymentId);
    console.log("Estado:", status);
    console.log("Merchant Order ID:", merchantOrderId);

    // Validar que el status sea "approved"
    if (status !== "approved") {
      console.log("Pago no aprobado, redirigiendo a página de fallo");
      navigate('/pago-fallido', { replace: true });
      return;
    }

    // Solo proceder si el pago fue aprobado
    if (paymentId && status === "approved") {
      console.log('Payment ID capturado:', paymentId);
      // Guardar en localStorage
      localStorage.setItem('lastPaymentId', paymentId);
      
      // Enviar al endpoint
      const sendPaymentToAPI = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            console.warn('No se encontró token de autenticación');
            toast({
              title: "Error",
              description: "No se encontró token de autenticación",
              variant: "destructive",
            });
            return;
          }

          const payload = {
            UAT: token,
            MercadoPagoId: paymentId
          };
          
          console.log('Enviando payment_id al servidor:', payload);
          const response = await api.post('/MTarjetas/RegistrarPago', payload);
          console.log('Respuesta del servidor:', response.data);
          
          // Validar respuesta exitosa
          if (response.status === 200 || response.status === 201) {
            toast({
              title: "Pago registrado",
              description: "El pago se registró correctamente en el sistema",
            });
          } else {
            toast({
              title: "Advertencia",
              description: `Respuesta inesperada del servidor: ${response.status}`,
              variant: "destructive",
            });
          }
          
        } catch (error: any) {
          console.error('Error al enviar payment_id:', error);
          
          // Mostrar error específico según el tipo de error
          if (error.response) {
            // Error de respuesta del servidor
            toast({
              title: "Error del servidor",
              description: `Error ${error.response.status}: ${error.response.data?.message || 'Error al registrar el pago'}`,
              variant: "destructive",
            });
          } else if (error.request) {
            // Error de conexión
            toast({
              title: "Error de conexión",
              description: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
              variant: "destructive",
            });
          } else {
            // Otro tipo de error
            toast({
              title: "Error",
              description: `Error inesperado: ${error.message}`,
              variant: "destructive",
            });
          }
        }
      };
      
      sendPaymentToAPI();
    } else {
      // Si no hay payment_id, redirigir a fallo
      console.log("No se encontró payment_id, redirigiendo a página de fallo");
      navigate('/pago-fallido', { replace: true });
      return;
    }

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
  }, [navigate, location.search, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Símbolo de OK verde grande */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-12 h-12 text-white stroke-[3]" />
        </div>

        {/* Mensaje principal */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Recibimos tu pago.
        </h1>

        {/* Contador */}
        <p className="text-gray-600 text-lg">
          Redirigiendo en {countdown} segundos...
        </p>
      </div>
    </div>
  );
};

export default PagoExitoso;
