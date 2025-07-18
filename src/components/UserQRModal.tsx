
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, X, Download } from "lucide-react";

interface UserQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const UserQRModal = ({ isOpen, onClose, userId }: UserQRModalProps) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Función simple de "encriptación" (en producción usar una librería real)
  const encryptUserId = (id: string): string => {
    // Simple base64 encoding como ejemplo (usar encriptación real en producción)
    try {
      return btoa(`user_${id}_${Date.now()}`);
    } catch {
      return btoa(`user_${id}`);
    }
  };

  const generateQRCode = async (data: string) => {
    setIsGenerating(true);
    try {
      // Usando una API pública para generar QR codes
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
      setQrCodeDataUrl(qrApiUrl);
    } catch (error) {
      console.error('Error generando código QR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      const encryptedId = encryptUserId(userId);
      generateQRCode(encryptedId);
    }
  }, [isOpen, userId]);

  const handleDownload = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `qr-usuario-${userId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Mi Código QR
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription asChild>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Código QR con tu ID de usuario encriptado
              </p>
              
              {isGenerating ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : qrCodeDataUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={qrCodeDataUrl}
                      alt="Código QR del usuario"
                      className="w-48 h-48 border rounded-lg"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar QR
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center items-center h-48">
                  <p className="text-gray-500">Error al generar código QR</p>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                ID Usuario: {userId}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserQRModal;
