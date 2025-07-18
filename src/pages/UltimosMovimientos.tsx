
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMovimientos } from '@/hooks/useMovimientos';
import { useMovimientosFormatters } from '@/hooks/useMovimientosFormatters';
import MovimientosTable from '@/components/movimientos/MovimientosTable';
import MovimientosCards from '@/components/movimientos/MovimientosCards';
import MovimientosEmptyState from '@/components/movimientos/MovimientosEmptyState';
import MovimientosLoadingState from '@/components/movimientos/MovimientosLoadingState';
import MovimientosErrorState from '@/components/movimientos/MovimientosErrorState';
import MovimientosNoCardState from '@/components/movimientos/MovimientosNoCardState';

const UltimosMovimientos: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { formatDate, formatMonto } = useMovimientosFormatters();
  
  const userData = localStorage.getItem('USER');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const nroTarjeta = parsedUserData?.NroTarjeta;
  
  const { movimientos, isLoading, error, refetch } = useMovimientos(nroTarjeta);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <MovimientosLoadingState />;
  }

  if (error) {
    console.error('Error en movimientos:', error);
    return <MovimientosErrorState error={error} onRetry={() => refetch()} />;
  }

  if (!nroTarjeta) {
    return <MovimientosNoCardState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="w-full px-4 py-4">
        <Card className="border-0 shadow-sm w-full">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-600 font-normal">
                Todos tus Movimientos
              </CardTitle>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading}
                className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                title="Actualizar movimientos"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!movimientos || movimientos.length === 0 ? (
              <MovimientosEmptyState onReload={() => refetch()} />
            ) : (
              <>
                <MovimientosCards 
                  movimientos={movimientos}
                  formatDate={formatDate}
                  formatMonto={formatMonto}
                />
                <MovimientosTable 
                  movimientos={movimientos}
                  formatDate={formatDate}
                  formatMonto={formatMonto}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UltimosMovimientos;
