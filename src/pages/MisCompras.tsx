
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMovimientos } from '@/hooks/useMovimientos';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MisCompras: React.FC = () => {
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

  // Obtener datos del usuario del localStorage
  const userData = localStorage.getItem('USER');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const numeroTarjetaReal = parsedUserData?.NroTarjeta || '0000000500022911';
  
  // Obtener movimientos de la API
  const { movimientos, isLoading } = useMovimientos(numeroTarjetaReal);

  // Filtrar solo las compras (movimientos de débito)
  const compras = movimientos?.filter(mov => mov.tipo === 'debito') || [];

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'Sin fecha';
    
    console.log('Fecha original recibida:', fecha);
    
    try {
      // Si la fecha ya viene en formato DD/MM/YYYY, intentar parsearla
      if (fecha.includes('/')) {
        const partes = fecha.split('/');
        if (partes.length === 3) {
          const [dia, mes, año] = partes;
          // Crear objeto Date con formato año, mes-1, día
          const date = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
          
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        }
      }
      
      // Si viene en formato ISO, convertirla
      const date = new Date(fecha);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Si no se puede parsear, devolver la fecha original
      return fecha;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fecha;
    }
  };

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
          <h2 className="text-lg font-medium">Todas tus Compras</h2>
        </div>
      </div>

      <div className="p-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            {/* Estado de carga o sin compras */}
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando compras...</p>
              </div>
            ) : compras.length === 0 ? (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img 
                    src="/lovable-uploads/ef268b88-351c-4338-a09e-cb12638b05d3.gif" 
                    alt="Sin compras" 
                    className="w-full h-full object-contain opacity-50"
                  />
                </div>
                <p className="text-gray-500 font-medium">
                  No se encontraron Compras disponibles
                </p>
              </div>
            ) : (
              // Lista de compras
              <div className="space-y-4">
                {compras.map((compra, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {compra.descripcion || 'Compra'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatearFecha(compra.fecha)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          -{compra.monto}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MisCompras;
