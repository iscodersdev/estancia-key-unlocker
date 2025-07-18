
import React from 'react';
import { Button } from '@/components/ui/button';

interface MovimientosEmptyStateProps {
  onReload: () => void;
}

const MovimientosEmptyState: React.FC<MovimientosEmptyStateProps> = ({ onReload }) => {
  return (
    <div className="p-8 text-center">
      <div className="w-24 h-24 mx-auto mb-4">
        <img 
          src="/lovable-uploads/ef268b88-351c-4338-a09e-cb12638b05d3.gif" 
          alt="Sin movimientos" 
          className="w-full h-full object-contain opacity-50"
        />
      </div>
      <p className="text-gray-500 font-medium">
        No se encontraron movimientos disponibles
      </p>
      <Button 
        onClick={onReload} 
        className="mt-4"
        variant="outline"
        size="sm"
      >
        Recargar
      </Button>
    </div>
  );
};

export default MovimientosEmptyState;
