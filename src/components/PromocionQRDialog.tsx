
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { PromocionModel } from '@/types/promocion';

interface PromocionQRDialogProps {
  isOpen: boolean;
  onClose: () => void;
  qrImage: string | null;
  selectedPromotion: PromocionModel | null;
}

const PromocionQRDialog: React.FC<PromocionQRDialogProps> = ({
  isOpen,
  onClose,
  qrImage,
  selectedPromotion
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedPromotion?.Titulo || 'Tu Código QR'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Presenta este código QR en el local para aplicar la promoción
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {qrImage && (
          <div className="flex justify-center p-4">
            <img 
              src={qrImage} 
              alt="Código QR de promoción"
              className="w-48 h-48 border rounded-lg"
            />
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>
            Cerrar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PromocionQRDialog;
