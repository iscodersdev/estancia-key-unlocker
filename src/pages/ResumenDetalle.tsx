import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMovimientos } from '@/hooks/useMovimientos';
import { useMovimientosFormatters } from '@/hooks/useMovimientosFormatters';

const ResumenDetalle: React.FC = () => {
  const navigate = useNavigate();
  const { period } = useParams<{ period: string }>();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { formatDate, formatMonto } = useMovimientosFormatters();
  
  const userData = localStorage.getItem('USER');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const nroTarjeta = parsedUserData?.NroTarjeta;
  
  const { movimientos, isLoading, error } = useMovimientos(nroTarjeta);
  const periodLabel = location.state?.periodLabel || 'Período';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Filtrar movimientos por período
  const filterMovementsByPeriod = () => {
    if (!movimientos || movimientos.length === 0 || !period) return [];
    
    return movimientos.filter((mov) => {
      const date = new Date(mov.fecha);
      const movPeriod = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return movPeriod === period;
    });
  };

  const filteredMovements = filterMovementsByPeriod();
  const total = filteredMovements.reduce((sum, mov) => sum + parseFloat(mov.monto.replace(/[^0-9.-]/g, '')), 0);

  const handleDownloadResumen = () => {
    // Funcionalidad de descarga por implementar
    console.log(`Descargando resumen detallado para período: ${period}`);
  };

  const handleGoBack = () => {
    navigate('/mi-resumen');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando detalle...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error al cargar el detalle</p>
            <Button onClick={() => window.location.reload()}>
              Intentar nuevamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Detalle del Resumen</h1>
        </div>

        <Card className="border-0 shadow-sm w-full">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg text-gray-600 font-normal capitalize">
                  {periodLabel}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredMovements.length} movimiento{filteredMovements.length !== 1 ? 's' : ''} • Total: {formatMonto(total.toString())}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadResumen}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Resumen
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredMovements.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No hay movimientos para este período</p>
                <p className="text-sm text-gray-500">Los movimientos aparecerán aquí cuando los tengas disponibles</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredMovements.map((mov, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {mov.comercio}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(mov.fecha)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-800">
                          {formatMonto(mov.monto)}
                        </span>
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

export default ResumenDetalle;