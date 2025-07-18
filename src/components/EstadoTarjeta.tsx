
import React from 'react';
import { Check, AlertTriangle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EstadoTarjetaProps {
  montoAdeudado?: string;
  isLoading?: boolean;
  onPagarClick?: () => void;
}

const EstadoTarjeta: React.FC<EstadoTarjetaProps> = ({ 
  montoAdeudado, 
  isLoading, 
  onPagarClick 
}) => {
  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
          <span className="text-gray-500 font-semibold text-xl">Cargando estado...</span>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  const tieneDeuda = montoAdeudado && montoAdeudado !== '0,0' && parseFloat(montoAdeudado.replace(',', '.')) > 0;

  if (tieneDeuda) {
    // Formatear el monto adeudado con formato argentino
    const numeroLimpio = parseFloat(montoAdeudado.replace(',', '.'));
    const montoFormateado = isNaN(numeroLimpio) 
      ? '$ 0,00' 
      : `$ ${numeroLimpio.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
    
    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-estancias-charcoal font-semibold text-lg">Tienes una deuda</span>
            <div className="w-10 h-10 bg-estancias-taupe rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-estancias-charcoal" />
            </div>
          </div>
          <p className="text-estancias-charcoal font-bold text-xl mb-1">{montoFormateado}</p>
          <p className="text-estancias-charcoal/60 text-xs mb-4">(No incluye punitorios)</p>
          
          {/* Botón de MercadoPago oculto pero manteniendo la funcionalidad */}
          <Button 
            onClick={onPagarClick}
            className="w-full bg-estancias-charcoal hover:bg-estancias-charcoal/90 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hidden"
          >
            <CreditCard className="w-5 h-5" />
            Pagar con MercadoPago
          </Button>
          
          {/* Nuevo botón Pagar visible */}
          <Button 
            onClick={onPagarClick}
            className="w-full bg-estancias-charcoal hover:bg-estancias-charcoal/90 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Pagar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
        <span className="text-estancias-charcoal font-semibold text-xl">No tienes Deuda!</span>
        <div className="w-10 h-10 bg-estancias-charcoal rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default EstadoTarjeta;
