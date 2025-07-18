
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TarjetaPrincipalProps {
  showCardDetails: boolean;
  onToggleVisibility: () => void;
  numeroTarjeta: string;
  nombreTitular: string;
  montoDisponible: string;
}

const TarjetaPrincipal: React.FC<TarjetaPrincipalProps> = ({
  showCardDetails,
  onToggleVisibility,
  numeroTarjeta,
  nombreTitular,
  montoDisponible
}) => {
  const formatearNumeroTarjeta = (numero: string | number) => {
    const numeroStr = String(numero);
    if (!numeroStr) return '500022906';
    
    if (!showCardDetails) {
      const ultimosCuatro = numeroStr.slice(-4);
      return `**** **** **** ${ultimosCuatro}`;
    }
    
    const limpio = numeroStr.replace(/\s/g, '');
    return limpio.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatearLimiteDisponible = (limite: string) => {
    if (!showCardDetails) {
      return '*****';
    }
    return limite;
  };

  const formatearNombreTitular = (nombre: string) => {
    return nombre.toUpperCase();
  };

  return (
    <div className="relative px-4 pt-4">
      <div className="max-w-sm mx-auto">
        <div className="bg-black text-white p-6 pb-8 relative overflow-hidden rounded-3xl">
          {/* Header con logo y botón de visibilidad */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-lg font-normal tracking-wider">ESTANCIAS</h1>
            </div>
            <button 
              onClick={onToggleVisibility}
              className="hover:bg-gray-800 rounded-full p-2 transition-colors"
            >
              {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Límite disponible - centrado */}
          <div className="mb-8 text-center">
            <p className="text-sm opacity-75 mb-2">Límite Disponible</p>
            <p className="text-xl font-light">
              {formatearLimiteDisponible(montoDisponible)}
            </p>
          </div>
          
          {/* Footer con datos del titular */}
          <div className="flex justify-between items-end">
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-xs opacity-75 mb-1">TITULAR</p>
              <p className="text-sm font-medium truncate">
                {formatearNombreTitular(nombreTitular)}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs opacity-75 mb-1">NÚMERO</p>
              <p className="text-sm font-mono tracking-wide leading-tight">
                {formatearNumeroTarjeta(numeroTarjeta)}
              </p>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>
      </div>
    </div>
  );
};

export default TarjetaPrincipal;
