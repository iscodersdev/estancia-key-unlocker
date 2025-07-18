
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MisPagos: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Si no está autenticado, no mostrar nada mientras redirige
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header negro */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3 text-white hover:bg-gray-800 h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-medium">Todos tus Pagos</h2>
        </div>
      </div>

      <div className="p-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <img 
                  src="/lovable-uploads/ef268b88-351c-4338-a09e-cb12638b05d3.gif" 
                  alt="Sin pagos" 
                  className="w-full h-full object-contain opacity-50"
                />
              </div>
              <p className="text-gray-500 font-medium">
                No se encontraron Pagos disponibles
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MisPagos;
