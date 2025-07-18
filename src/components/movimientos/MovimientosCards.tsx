
import React from 'react';
import { Movimiento } from '@/services/movimientosService';

interface MovimientosCardsProps {
  movimientos: Movimiento[];
  formatDate: (dateString: string) => string;
  formatMonto: (monto: string) => string;
}

const MovimientosCards: React.FC<MovimientosCardsProps> = ({
  movimientos,
  formatDate,
  formatMonto
}) => {
  return (
    <div className="md:hidden">
      <div className="space-y-3 p-4">
        {movimientos.map((movimiento) => (
          <div key={movimiento.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0 pr-3">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {movimiento.descripcion || 'PAGOS DE CUOTA REGULAR'}
                </p>
                {movimiento.comercio && (
                  <p className="text-xs text-gray-500 truncate mt-1">{movimiento.comercio}</p>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                movimiento.tipo === 'credito' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {movimiento.tipo === 'credito' ? 'Ingreso' : 'Egreso'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">{formatDate(movimiento.fecha)}</p>
              <p className={`font-semibold text-sm ${
                movimiento.tipo === 'credito' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {movimiento.tipo === 'credito' ? '+' : '-'}{formatMonto(movimiento.monto)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovimientosCards;
