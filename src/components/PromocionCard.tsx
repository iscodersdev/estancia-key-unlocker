
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, QrCode } from 'lucide-react';
import { PromocionModel } from '@/types/promocion';

interface PromocionCardProps {
  promocion: PromocionModel;
  onClick: () => void;
  isCarousel?: boolean;
}

const PromocionCard: React.FC<PromocionCardProps> = ({
  promocion,
  onClick,
  isCarousel = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isCarousel) {
    return (
      <Card className="overflow-hidden h-full">
        <div className="relative h-48">
          {promocion.Imagen ? (
            <img src={promocion.Imagen} alt={promocion.Titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <div className="text-center text-gray-600 p-4">
                <div className="text-lg font-semibold">{promocion.Titulo || 'Promoción'}</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-md">
      <div className="relative">
        {promocion.Imagen ? (
          <img src={promocion.Imagen} alt={promocion.Titulo} className="w-full h-96 object-cover" />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="text-center text-gray-600 p-4">
              <div className="text-xl font-semibold mb-2">{promocion.Titulo || 'Promoción'}</div>
              <div className="text-sm opacity-80">Sin imagen disponible</div>
            </div>
          </div>
        )}
        
        {/* Botón posicionado en la esquina inferior derecha - solo si tiene Link o QR */}
        {(promocion.Link || promocion.QR) && (
          <div className="absolute bottom-3 right-3">
            <Button 
              onClick={onClick} 
              size="sm" 
              className="bg-white/95 backdrop-blur-sm hover:bg-white text-estancias-charcoal border-0 shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={!promocion.Activa}
            >
              {promocion.Link ? <ExternalLink className="w-4 h-4" /> : promocion.QR ? <QrCode className="w-4 h-4" /> : 'Ver'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PromocionCard;
