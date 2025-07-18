
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { subirComprobante } from '@/services/comprobantesService';
import { useToast } from '@/hooks/use-toast';
import { usePaymentData } from '@/hooks/usePaymentData';
import { PaymentHeader } from '@/components/metodos-pago/PaymentHeader';
import { TransferDataCard } from '@/components/metodos-pago/TransferDataCard';
import { FileUploadSection } from '@/components/metodos-pago/FileUploadSection';
import { DesktopTransferCard } from '@/components/metodos-pago/DesktopTransferCard';

const MetodosPago: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();

  const { datosTarjeta, formatearMonto, formatearFechaVencimiento } = usePaymentData();

  // Obtener datos del comprobante subido desde el estado de navegación
  const comprobanteData = location.state?.comprobanteData;
  const fromUpload = location.state?.fromUpload;

  const handleVolver = () => {
    console.log('Navegando hacia atrás');
    navigate(-1);
  };

  const handleAdjuntarComprobante = () => {
    // Crear un input file temporal
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        toast({
          title: "Archivo seleccionado",
          description: `${file.name} está listo para subir`,
        });
      }
    };
    
    input.click();
  };

  const handleCambiarArchivo = () => {
    setSelectedFile(null);
    handleAdjuntarComprobante();
  };

  const handleConfirmarPago = async () => {
    if (!selectedFile) return;
    
    setIsConfirming(true);
    try {
      await subirComprobante(selectedFile, "", "0");
      toast({
        title: "Éxito",
        description: "Comprobante subido correctamente",
      });
      // Navegar a la página de confirmación
      navigate('/comprobante-confirmacion');
    } catch (error) {
      console.error('Error al subir comprobante:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el comprobante. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        {/* Header negro con información de pago */}
        <PaymentHeader
          onVolver={handleVolver}
          montoAdeudado={formatearMonto(datosTarjeta?.montoAdeudado)}
          fechaVencimiento={formatearFechaVencimiento(datosTarjeta?.fechaPagoProximaCuota)}
        />

        {/* Contenido fuera de la zona negra */}
        <div className="px-4 py-5">
          {/* Card con datos de transferencia */}
          <TransferDataCard />

          {/* Sección de carga de archivos */}
          <div className="mt-4">
            <FileUploadSection
              selectedFile={selectedFile}
              isUploading={isUploading}
              isConfirming={isConfirming}
              onAdjuntarComprobante={handleAdjuntarComprobante}
              onCambiarArchivo={handleCambiarArchivo}
              onConfirmarPago={handleConfirmarPago}
              isMobile={true}
            />
          </div>

          {/* Texto informativo final */}
          <p className="text-xs text-gray-600 text-center leading-relaxed px-2 mt-4">
            Ten en cuenta que el procesamiento del pago puede demorar 24hs hábiles para acreditarse
          </p>
        </div>
      </div>
    );
  }

  // Vista Desktop
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleVolver}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="max-w-sm mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
                Datos para realizar la transferencia
              </h3>

              <DesktopTransferCard />

              <FileUploadSection
                selectedFile={selectedFile}
                isUploading={isUploading}
                isConfirming={isConfirming}
                onAdjuntarComprobante={handleAdjuntarComprobante}
                onCambiarArchivo={handleCambiarArchivo}
                onConfirmarPago={handleConfirmarPago}
                isMobile={false}
              />

              <p className="text-sm text-gray-600 text-center mt-6 leading-relaxed">
                Ten en cuenta que el procesamiento del pago puede demorar 24hs hábiles para acreditarse
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetodosPago;
