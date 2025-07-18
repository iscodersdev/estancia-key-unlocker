
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const MovimientosLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full px-4 py-4">
        <Card className="border-0 shadow-sm w-full">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-gray-500">Cargando movimientos...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovimientosLoadingState;
