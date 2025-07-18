
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MovimientosErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const MovimientosErrorState: React.FC<MovimientosErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full px-4 py-4">
        <Card className="border-0 shadow-sm w-full">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-red-500">Error al cargar los movimientos</p>
              <p className="text-sm text-gray-500 mt-2">{error.message}</p>
              <Button 
                onClick={onRetry} 
                className="mt-4"
                variant="outline"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovimientosErrorState;
