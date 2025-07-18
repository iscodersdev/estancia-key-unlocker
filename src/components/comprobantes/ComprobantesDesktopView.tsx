
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, RefreshCw, Loader2, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import { getComprobanteImageSrc, formatDate } from '@/utils/comprobanteUtils';

interface ComprobantesDesktopViewProps {
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  comprobantesToShow: any[];
  hasMore: boolean;
  comprobantesData: any[];
  itemsToShow: number;
  handleSubirNuevo: () => void;
  handleRefresh: () => void;
  handleVerDetalle: (comprobante: any) => void;
  handleLoadMore: () => void;
  refetch: () => void;
}

const ComprobantesDesktopView: React.FC<ComprobantesDesktopViewProps> = ({
  isLoading,
  isFetching,
  error,
  comprobantesToShow,
  hasMore,
  comprobantesData,
  itemsToShow,
  handleSubirNuevo,
  handleRefresh,
  handleVerDetalle,
  handleLoadMore,
  refetch
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-gray-400" />
                <p className="text-gray-600 text-lg font-medium mb-2">
                  Cargando comprobantes...
                </p>
                <p className="text-gray-500 text-sm">
                  Por favor espera mientras obtenemos tu información
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error en comprobantes:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-red-500">Error al cargar los comprobantes</p>
                <p className="text-sm text-gray-500 mt-2">{error.message}</p>
                <Button 
                  onClick={() => refetch()} 
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-600 font-normal">
                Todos tus Comprobantes
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSubirNuevo}
                  className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Nuevo
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isFetching}
                  className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  title="Actualizar comprobantes"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Indicador de actualización */}
            {isFetching && !isLoading && (
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center justify-center text-blue-600">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm">Actualizando comprobantes...</span>
                </div>
              </div>
            )}
            
            {comprobantesToShow.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img 
                    src="/lovable-uploads/ef268b88-351c-4338-a09e-cb12638b05d3.gif" 
                    alt="Sin comprobantes" 
                    className="w-full h-full object-contain opacity-50"
                  />
                </div>
                <p className="text-gray-500 font-medium">
                  No se encontraron comprobantes disponibles
                </p>
                <Button 
                  onClick={() => refetch()} 
                  className="mt-4"
                  variant="outline"
                >
                  Recargar
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comprobante</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comprobantesToShow.map((comprobante, index) => {
                      const imageSrc = getComprobanteImageSrc(comprobante.ComprobantePago);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {imageSrc ? (
                                  <img 
                                    src={imageSrc} 
                                    alt="Comprobante" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error('Error cargando imagen:', e);
                                      e.currentTarget.style.display = 'none';
                                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (nextElement) {
                                        nextElement.style.display = 'flex';
                                      }
                                    }}
                                  />
                                ) : null}
                                <span 
                                  className="text-xs text-gray-500 text-center px-1"
                                  style={{ display: imageSrc ? 'none' : 'flex' }}
                                >
                                  NO HAY FOTO
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">Comprobante #{index + 1}</p>
                                <p className="text-xs text-gray-500">Número de tarjeta: {comprobante.NroTarjeta || 'N/A'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(comprobante.FechaComprobante)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              comprobante.EstadoPagoDescripcion === 'Pendiente' ? 'bg-orange-100 text-orange-800' : 
                              comprobante.EstadoPagoDescripcion === 'Pagado' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {comprobante.EstadoPagoDescripcion}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerDetalle(comprobante)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Ver Detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {/* Botón cargar más para desktop */}
                {hasMore && (
                  <div className="p-4 text-center border-t">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isFetching}
                      className="rounded-full"
                    >
                      {isFetching ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      )}
                      Cargar más comprobantes ({comprobantesData.length - itemsToShow} restantes)
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprobantesDesktopView;
