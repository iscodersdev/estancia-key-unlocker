
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PromocionModel } from '@/types/promocion';
import PromocionCard from './PromocionCard';

interface PromocionesCarouselProps {
  promociones: PromocionModel[];
  onPromocionClick: (promocion: PromocionModel) => void;
}

const PromocionesCarousel: React.FC<PromocionesCarouselProps> = ({
  promociones,
  onPromocionClick
}) => {
  const promocionesNoFijas = promociones.filter(p => !p.PromocionFija && p.Activa);

  if (promocionesNoFijas.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {promocionesNoFijas.map((promocion, index) => (
            <CarouselItem key={promocion.Id}>
              <PromocionCard
                promocion={promocion}
                onClick={() => onPromocionClick(promocion)}
                isCarousel={true}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default PromocionesCarousel;
