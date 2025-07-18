
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, FileText } from 'lucide-react';

interface FileUploadSectionProps {
  selectedFile: File | null;
  isUploading: boolean;
  isConfirming: boolean;
  onAdjuntarComprobante: () => void;
  onCambiarArchivo: () => void;
  onConfirmarPago: () => void;
  isMobile?: boolean;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  selectedFile,
  isUploading,
  isConfirming,
  onAdjuntarComprobante,
  onCambiarArchivo,
  onConfirmarPago,
  isMobile = true
}) => {
  if (selectedFile) {
    return (
      <div className="space-y-3 pt-2">
        {/* Archivo seleccionado */}
        <div className={`flex items-center justify-between ${isMobile ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg border ${isMobile ? 'text-left' : ''}`}>
          <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'} flex-1 min-w-0`}>
            <FileText className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 flex-shrink-0`} />
            <div className={`min-w-0 flex-1 ${!isMobile ? 'text-left' : ''}`}>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-800 truncate`}>
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCambiarArchivo}
            className={`text-blue-600 hover:text-blue-800 ${isMobile ? 'text-xs px-2 py-1 h-auto' : ''}`}
          >
            Cambiar
          </Button>
        </div>

        {/* Botón Confirmar pago */}
        <Button
          onClick={onConfirmarPago}
          disabled={isConfirming}
          className={`w-full bg-black hover:bg-gray-800 ${isMobile ? 'py-2 text-sm' : 'py-3 text-base'} font-medium rounded-full`}
        >
          {isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Confirmando pago...
            </>
          ) : (
            'Confirmar pago'
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-2">
      {/* Botón Adjuntar comprobante */}
      <Button
        onClick={onAdjuntarComprobante}
        disabled={isUploading}
        className={`w-full bg-black hover:bg-gray-800 ${isMobile ? 'py-2 text-sm' : 'py-3 text-base'} font-medium rounded-full ${!isMobile ? 'mt-4' : ''}`}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Adjuntar comprobante
          </>
        )}
      </Button>

      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 leading-relaxed ${isMobile ? 'mt-3 px-2' : 'pt-2'}`}>
        Una vez realizada la transferencia, por favor adjuntá el comprobante.
      </p>
    </div>
  );
};
