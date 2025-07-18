
import React from 'react';
import { Movimiento } from '@/services/movimientosService';

interface MovimientosTableProps {
  movimientos: Movimiento[];
  formatDate: (dateString: string) => string;
  formatMonto: (monto: string) => string;
}

const MovimientosTable: React.FC<MovimientosTableProps> = ({
  movimientos,
  formatDate,
  formatMonto
}) => {
  return (
    <div className="hidden md:block w-full">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-1/6">Fecha</th>
            <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-2/4">Descripción</th>
            <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-1/6">Tipo</th>
            <th className="text-right py-4 px-6 font-medium text-gray-600 text-sm w-1/6">Monto</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 text-sm text-gray-700">
                {formatDate(movimiento.fecha)}
              </td>
              <td className="py-4 px-6">
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {movimiento.descripcion || 'PAGOS DE CUOTA REGULAR'}
                  </p>
                  {movimiento.comercio && (
                    <p className="text-xs text-gray-500 mt-1">{movimiento.comercio}</p>
                  )}
                </div>
              </td>
              <td className="py-4 px-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  movimiento.tipo === 'credito' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {movimiento.tipo === 'credito' ? 'Ingreso' : 'Egreso'}
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className={`font-semibold text-sm ${
                  movimiento.tipo === 'credito' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {movimiento.tipo === 'credito' ? '+' : '-'}{formatMonto(movimiento.monto)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovimientosTable;
