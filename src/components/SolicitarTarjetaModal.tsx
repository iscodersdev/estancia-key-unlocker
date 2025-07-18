
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface SolicitarTarjetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SolicitarTarjetaModal: React.FC<SolicitarTarjetaModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titular: '',
    numero: '',
    vencimiento: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatVencimiento = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as MM/AA
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + (numbers.length > 2 ? '/' + numbers.slice(2, 4) : '');
    }
    return numbers;
  };

  const handleVencimientoChange = (value: string) => {
    const formatted = formatVencimiento(value);
    handleInputChange('vencimiento', formatted);
  };

  const validateForm = () => {
    if (!formData.titular.trim()) {
      toast.error('El nombre del titular es requerido');
      return false;
    }

    if (!formData.numero.trim()) {
      toast.error('El número de tarjeta es requerido');
      return false;
    }

    if (!formData.vencimiento.trim() || formData.vencimiento.length !== 5) {
      toast.error('El vencimiento debe tener formato MM/AA');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = localStorage.getItem('USER');
      const parsedUserData = userData ? JSON.parse(userData) : null;
      
      if (!parsedUserData?.UAT) {
        throw new Error('No se encontró información de usuario');
      }

      console.log('Enviando solicitud de nueva tarjeta:', {
        UAT: parsedUserData.UAT,
        Titular: formData.titular,
        Numero: formData.numero,
        Vencimiento: formData.vencimiento
      });

      const response = await fetch('https://portalestancias.com.ar/api/mTarjetas/Alta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsedUserData.UAT}`
        },
        body: JSON.stringify({
          UAT: parsedUserData.UAT,
          Titular: formData.titular,
          Numero: formData.numero,
          Vencimiento: formData.vencimiento
        })
      });

      console.log('Respuesta del servidor - Status:', response.status);
      
      const result = await response.json();
      console.log('Respuesta del servidor - Body:', result);
      
      // Manejar la respuesta basándose en el campo Status en lugar del HTTP status
      if (result.Status === 200) {
        toast.success('Tarjeta creada exitosamente');
        setFormData({ titular: '', numero: '', vencimiento: '' });
        onSuccess();
        onClose();
      } else {
        // El servidor devuelve un error específico
        const errorMessage = result.Mensaje || 'Error al crear la tarjeta';
        console.error('Error del servidor:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error al crear tarjeta:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la tarjeta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ titular: '', numero: '', vencimiento: '' });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Nueva Tarjeta</DialogTitle>
          <DialogDescription>
            Complete los datos para solicitar una nueva tarjeta
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titular">Titular de la Tarjeta</Label>
            <Input
              id="titular"
              type="text"
              value={formData.titular}
              onChange={(e) => handleInputChange('titular', e.target.value)}
              placeholder="Nombre completo del titular"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero">Número de Tarjeta</Label>
            <Input
              id="numero"
              type="text"
              value={formData.numero}
              onChange={(e) => handleInputChange('numero', e.target.value)}
              placeholder="1234 5678 9012 3456"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vencimiento">Vencimiento</Label>
            <Input
              id="vencimiento"
              type="text"
              value={formData.vencimiento}
              onChange={(e) => handleVencimientoChange(e.target.value)}
              placeholder="MM/AA"
              maxLength={5}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Tarjeta'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SolicitarTarjetaModal;
