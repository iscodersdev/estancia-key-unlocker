
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PaymentHeaderProps {
  onVolver: () => void;
  montoAdeudado: string;
  fechaVencimiento: string;
}

export const PaymentHeader: React.FC<PaymentHeaderProps> = ({
  onVolver,
  montoAdeudado,
  fechaVencimiento
}) => {
  return (
    <div className="bg-black text-white relative overflow-hidden" style={{ height: '18vh', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px' }}>
      <div className="absolute inset-0 flex flex-col">
        {/* Barra superior */}
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onVolver}
            className="mr-3 text-white hover:bg-gray-800 h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-normal tracking-wider">ESTANCIAS</h2>
        </div>
        
        {/* Información de pago centrada */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-xs text-gray-300 mb-1">Monto a Pagar</p>
          <h3 className="text-xl font-bold mb-1">
            {montoAdeudado}
          </h3>
          <p className="text-xs text-gray-300">
            {fechaVencimiento}
          </p>
        </div>
      </div>
    </div>
  );
};
