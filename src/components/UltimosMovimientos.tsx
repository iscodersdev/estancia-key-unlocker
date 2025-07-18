
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Movimiento } from '@/services/movimientosService';

interface UltimosMovimientosProps {
  movimientos: Movimiento[];
  isLoading: boolean;
  onVerTodosClick: () => void;
}

const UltimosMovimientos: React.FC<UltimosMovimientosProps> = ({
  movimientos,
  isLoading,
  onVerTodosClick
}) => {
  const formatearFecha = (fecha: string) => {
    if (!fecha) return '';
    
    console.log('Fecha original recibida:', fecha);
    
    try {
      // Si la fecha ya viene en formato DD/MM/YYYY, usarla directamente
      if (fecha.includes('/')) {
        console.log('Fecha en formato DD/MM/YYYY:', fecha);
        return fecha;
      }
      
      // Si viene en formato ISO, convertirla
      const date = new Date(fecha);
      if (!isNaN(date.getTime())) {
        const fechaFormateada = date.toLocaleDateString('es-AR');
        console.log('Fecha convertida:', fechaFormateada);
        return fechaFormateada;
      }
      
      // Si no se puede parsear, devolver la fecha original
      console.log('No se pudo parsear la fecha, devolviendo original');
      return fecha;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fecha;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
      <h3 className="text-base font-semibold text-gray-900 mb-4">ÚLTIMOS 5 MOVIMIENTOS</h3>
      
      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Cargando movimientos...</p>
        </div>
      ) : movimientos.length > 0 ? (
        <div className="space-y-3">
          {movimientos.slice(0, 5).map((movimiento) => (
            <div key={movimiento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{movimiento.descripcion}</p>
                {movimiento.comercio && (
                  <p className="text-xs text-gray-600">{movimiento.comercio}</p>
                )}
                <p className="text-xs text-gray-500">{formatearFecha(movimiento.fecha)}</p>
              </div>
              <div className="text-right">
                <p className={`font-medium text-sm ${
                  movimiento.tipo === 'credito' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movimiento.tipo === 'credito' ? '+' : '-'}{movimiento.monto}
                </p>
              </div>
            </div>
          ))}
          
          {movimientos.length > 5 && (
            <div className="text-center mt-4">
              <button 
                onClick={onVerTodosClick}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todos los movimientos
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No hay movimientos recientes</p>
        </div>
      )}
    </div>
  );
};

export default UltimosMovimientos;
