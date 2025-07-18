
import React from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { Tarjeta } from '@/services/tarjetasService';
import { toast } from '@/hooks/use-toast';

interface TarjetaCardProps {
  tarjeta: Tarjeta;
  showDetails: boolean;
  onToggleVisibility: () => void;
}

const TarjetaCard: React.FC<TarjetaCardProps> = ({ 
  tarjeta, 
  showDetails, 
  onToggleVisibility 
}) => {
  const formatCardNumber = (number: string) => {
    if (!showDetails) {
      return '•••• •••• •••• ' + number.slice(-4);
    }
    return number;
  };

  const formatAmount = (amount: string) => {
    if (!showDetails) {
      return '••••••••••';
    }
    return amount;
  };

  const getCardGradient = (tipo: string) => {
    return tipo === 'principal' 
      ? 'bg-gradient-to-br from-black to-gray-800'
      : 'bg-gradient-to-br from-gray-700 to-gray-900';
  };

  const handleCopyCardInfo = () => {
    const cardInfo = `Tarjeta: ${tarjeta.numeroTarjeta}\nTitular: ${tarjeta.titular}\nLímite Disponible: ${tarjeta.limiteDisponible}`;
    
    navigator.clipboard.writeText(cardInfo).then(() => {
      toast({
        title: "Información copiada",
        description: "Los datos de la tarjeta se copiaron al portapapeles",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "No se pudo copiar la información",
        variant: "destructive",
      });
    });
  };

  return (
    <div className={`${getCardGradient(tarjeta.tipo)} text-white rounded-xl p-3 sm:p-4 relative overflow-hidden h-40 sm:h-48 w-full flex flex-col justify-between`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xs sm:text-sm font-light tracking-wider">ESTANCIAS</h1>
          {tarjeta.tipo === 'adicional' && (
            <span className="text-xs bg-white/20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full mt-1 inline-block">
              ADICIONAL
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button 
            onClick={handleCopyCardInfo}
            className="hover:bg-gray-800 rounded-full p-1 sm:p-2 transition-colors"
            title="Copiar información de la tarjeta"
          >
            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={onToggleVisibility}
            className="hover:bg-gray-800 rounded-full p-1 sm:p-2 transition-colors"
          >
            {showDetails ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>
      
      {/* Límite disponible */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs opacity-75 mb-1">Límite Disponible</p>
        <p className="text-lg sm:text-xl font-light">{formatAmount(tarjeta.limiteDisponible)}</p>
      </div>
      
      {/* Footer */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <p className="text-xs opacity-75 mb-1">TITULAR</p>
          <p className="text-xs font-medium truncate">{tarjeta.titular.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75 mb-1">NÚMERO</p>
          <p className="text-xs font-mono tracking-wider">{formatCardNumber(tarjeta.numeroTarjeta)}</p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full translate-y-6 sm:translate-y-8 -translate-x-6 sm:-translate-x-8"></div>
    </div>
  );
};

export default TarjetaCard;
