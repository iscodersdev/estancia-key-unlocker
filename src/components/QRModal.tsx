
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  promotionTitle: string;
}

const QRModal = ({ isOpen, onClose, qrCode, promotionTitle }: QRModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-lg font-semibold">
              {promotionTitle}
            </AlertDialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogDescription asChild>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Presenta este código QR en el local
              </p>
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="Código QR de la promoción"
                  className="w-48 h-48 border rounded-lg"
                />
              </div>
              <p className="text-xs text-gray-500">
                Válido por tiempo limitado
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QRModal;
