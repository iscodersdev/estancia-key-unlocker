
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const ComprobanteConfirmacion: React.FC = () => {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate('/mis-comprobantes', { state: { shouldRefresh: true } });
  };

  return (
    <div className="min-h-screen bg-green-500 text-white flex flex-col w-full relative">
      {/* Botón X en la esquina superior izquierda */}
      <button
        onClick={handleVolver}
        className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
      >
        <X className="h-6 w-6 text-white" />
        <span className="sr-only">Close</span>
      </button>

      {/* Contenido principal centrado */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Ícono de check grande con animación */}
        <div className="w-32 h-32 bg-green-400 rounded-full flex items-center justify-center mb-8 animate-[scale-in_0.6s_ease-out]">
          <Check className="w-16 h-16 text-white stroke-[3] animate-[fade-in_0.8s_ease-out_0.3s_both]" />
        </div>
      </div>

      {/* Sección inferior con fondo blanco */}
      <div className="bg-white text-black rounded-t-[40px] p-8 pb-20 relative">
        {/* Mensaje de agradecimiento */}
        <p className="text-lg text-gray-600 text-center mb-4">
          Gracias por tu ingreso!
        </p>

        {/* Título principal */}
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Comprobante Cargado Exitosamente
        </h1>

        {/* Mensaje informativo */}
        <p className="text-center text-gray-600 mb-8 text-sm leading-relaxed">
          Ten en cuenta que el procesamiento del pago puede demorar 24hs hábiles para acreditarse
        </p>

        {/* Botón Volver */}
        <Button
          onClick={handleVolver}
          className="w-full bg-gray-200 text-black hover:bg-gray-300 rounded-full py-4 text-lg font-medium flex items-center justify-center"
        >
          ← Volver
        </Button>

        {/* Indicador inferior - movido dentro de la sección blanca */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ComprobanteConfirmacion;
