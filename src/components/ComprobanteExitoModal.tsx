
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ComprobanteExitoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComprobanteExitoModal: React.FC<ComprobanteExitoModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xs mx-auto bg-green-500 border-0 text-white">
        {/* Botón X en la esquina */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col items-center justify-center py-8 px-4">
          {/* Ícono de check */}
          <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mb-8">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>

          {/* Mensaje de agradecimiento */}
          <p className="text-lg font-medium text-center mb-2">
            ¡Gracias por tu ingreso!
          </p>

          {/* Título principal */}
          <h2 className="text-2xl font-bold text-center mb-4">
            Comprobante Cargado Exitosamente
          </h2>

          {/* Mensaje informativo */}
          <p className="text-center text-green-100 mb-8 text-sm leading-relaxed">
            Ten en cuenta que el procesamiento del pago puede demorar 24hs hábiles para acreditarse
          </p>

          {/* Botón Volver */}
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white text-green-500 border-white hover:bg-green-50 hover:text-green-600 px-8 py-2 rounded-full font-medium"
          >
            ← Volver
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
