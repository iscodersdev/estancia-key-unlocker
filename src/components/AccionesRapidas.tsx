
import React from 'react';
import { ShoppingBag, DollarSign, CreditCard, FileText } from 'lucide-react';

interface AccionesRapidasProps {
  onMisComprasClick: () => void;
  onMisPagosClick: () => void;
  onMisComprobantesClick: () => void;
  onMiResumenClick: () => void;
}

const AccionesRapidas: React.FC<AccionesRapidasProps> = ({
  onMisComprasClick,
  onMisPagosClick,
  onMisComprobantesClick,
  onMiResumenClick
}) => {
  return (
    <div className="max-w-sm mx-auto">
      <div className="grid grid-cols-4 gap-2">
        <button 
          onClick={onMisComprasClick}
          className="text-center hover:bg-gray-100 rounded-lg p-2 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-[11px] text-gray-600 font-medium leading-tight">MIS</p>
          <p className="text-[11px] text-gray-600 font-medium leading-tight">COMPRAS</p>
        </button>
        <button 
          onClick={onMisPagosClick}
          className="text-center hover:bg-gray-100 rounded-lg p-2 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-[11px] text-gray-600 font-medium leading-tight">MIS</p>
          <p className="text-[11px] text-gray-600 font-medium leading-tight">PAGOS</p>
        </button>
        <button 
          onClick={onMisComprobantesClick}
          className="text-center hover:bg-gray-100 rounded-lg p-2 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CreditCard className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-[11px] text-gray-600 font-medium leading-tight">MIS</p>
          <p className="text-[11px] text-gray-600 font-medium leading-tight">COMPROBANTES</p>
        </button>
        <button 
          onClick={onMiResumenClick}
          className="text-center hover:bg-gray-100 rounded-lg p-2 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-[11px] text-gray-600 font-medium leading-tight">RESUMEN</p>
        </button>
      </div>
    </div>
  );
};

export default AccionesRapidas;
