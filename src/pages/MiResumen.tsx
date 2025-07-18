import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, ArrowLeft, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMovimientos } from '@/hooks/useMovimientos';
import { useMovimientosFormatters } from '@/hooks/useMovimientosFormatters';

const MiResumen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { formatDate, formatMonto } = useMovimientosFormatters();
  
  const userData = localStorage.getItem('USER');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const nroTarjeta = parsedUserData?.NroTarjeta;
  
  const { movimientos, isLoading, error } = useMovimientos(nroTarjeta);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Agrupar movimientos por período (mes/año)
  const groupMovementsByPeriod = () => {
    if (!movimientos || movimientos.length === 0) return [];
    
    const grouped: { [key: string]: any[] } = {};
    
    movimientos.forEach((mov) => {
      const date = new Date(mov.fecha);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const periodLabel = `${date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
      
      if (!grouped[period]) {
        grouped[period] = [];
      }
      grouped[period].push({ ...mov, periodLabel });
    });
    
    return Object.entries(grouped).map(([period, movements]) => ({
      period,
      periodLabel: movements[0].periodLabel,
      movements,
      total: movements.reduce((sum, mov) => sum + parseFloat(mov.monto.replace(/[^0-9.-]/g, '')), 0)
    })).sort((a, b) => b.period.localeCompare(a.period));
  };

  const groupedMovements = groupMovementsByPeriod();

  const handleDownloadResumen = (period: string) => {
    // Funcionalidad de descarga por implementar
    console.log(`Descargando resumen para período: ${period}`);
  };

  const handleVerDetalle = (period: string, periodLabel: string) => {
    navigate(`/mi-resumen/${period}`, { state: { periodLabel } });
  };

  const handleGoBack = () => {
    navigate('/mi-tarjeta');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resumen...</p>
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
            <p className="text-red-600 mb-4">Error al cargar el resumen</p>
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
          <h1 className="text-xl font-semibold text-gray-800">Mi Resumen</h1>
        </div>

        <Card className="border-0 shadow-sm w-full">
          <CardHeader className="border-b border-gray-200 pb-4">
            <CardTitle className="text-lg text-gray-600 font-normal flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Resumen por Período
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {groupedMovements.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No hay movimientos para mostrar</p>
                <p className="text-sm text-gray-500">Los resúmenes aparecerán aquí cuando tengas movimientos</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {groupedMovements.map((group) => (
                  <div key={group.period} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800 capitalize text-lg">
                          {group.periodLabel}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {group.movements.length} movimiento{group.movements.length !== 1 ? 's' : ''} • Total: {formatMonto(group.total.toString())}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerDetalle(group.period, group.periodLabel)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadResumen(group.period)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
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

export default MiResumen;