
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BannerModel } from '@/services/bannerService';
import BannerCard from './BannerCard';

interface BannersCarouselProps {
  banners: BannerModel[];
  onBannerClick: (banner: BannerModel) => void;
}

const BannersCarousel: React.FC<BannersCarouselProps> = ({
  banners,
  onBannerClick
}) => {
  const bannersActivos = banners.filter(b => b.Activa);

  console.log('Banners activos en carousel:', bannersActivos.length, bannersActivos);

  if (bannersActivos.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {bannersActivos.map((banner) => (
            <CarouselItem key={banner.Id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <BannerCard
                banner={banner}
                onClick={() => onBannerClick(banner)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {bannersActivos.length > 1 && (
          <>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default BannersCarousel;
