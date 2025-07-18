
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MovimientosNoCardState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full px-4 py-4">
        <Card className="border-0 shadow-sm w-full">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-gray-500">No se encontró información de tarjeta</p>
              <Button 
                onClick={() => navigate('/mi-tarjeta')} 
                className="mt-4"
                variant="outline"
              >
                Ver tarjetas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovimientosNoCardState;
