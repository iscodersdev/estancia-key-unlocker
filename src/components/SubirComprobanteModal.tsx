
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { subirComprobante } from '@/services/comprobantesService';
import { useToast } from '@/hooks/use-toast';

interface SubirComprobanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubirComprobanteModal: React.FC<SubirComprobanteModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleArchivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArchivo(file);
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmarPago = async () => {
    if (!archivo) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Enviar con valores por defecto para nroTarjeta y monto
      await subirComprobante(archivo, "", "0");
      
      // Cerrar modal primero
      onClose();
      
      // Navegar a la página de métodos de pago
      navigate('/metodos-pago', {
        state: {
          fromUpload: true,
          comprobanteData: {
            archivo: archivo.name,
            fecha: new Date().toISOString()
          }
        }
      });
      
    } catch (error) {
      console.error('Error al subir comprobante:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el comprobante. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setArchivo(null);
    setPreviewUrl(null);
    onClose();
  };

  const removeFile = () => {
    setArchivo(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Subir Nuevo Comprobante</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Upload de archivo */}
            <div className="space-y-2">
              <Label>Comprobante de Pago</Label>
              
              {!archivo ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="comprobante"
                    accept="image/*,.pdf"
                    onChange={handleArchivoChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label htmlFor="comprobante" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Haz clic para subir un archivo
                    </p>
                    <p className="text-xs text-gray-500">
                      Soporta imágenes (JPG, PNG) y PDF
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Nombre del archivo */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {archivo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(archivo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        disabled={isUploading}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview de imagen si es imagen */}
                  {previewUrl && archivo.type.startsWith('image/') && (
                    <div className="border rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full max-h-32 object-contain rounded"
                      />
                    </div>
                  )}
                  
                  {/* Botón para cambiar archivo */}
                  <div className="text-center">
                    <input
                      type="file"
                      id="cambiar-comprobante"
                      accept="image/*,.pdf"
                      onChange={handleArchivoChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor="cambiar-comprobante" 
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Cambiar archivo
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmarPago}
                disabled={isUploading || !archivo}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isUploading ? 'Procesando...' : 'Confirmar pago'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
