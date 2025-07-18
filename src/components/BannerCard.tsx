
import React from 'react';
import { BannerModel } from '@/services/bannerService';

interface BannerCardProps {
  banner: BannerModel;
  onClick: () => void;
}

const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  onClick
}) => {
  return (
    <div 
      className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500 to-purple-600"
      onClick={onClick}
    >
      {banner.Imagen ? (
        <img 
          src={banner.Imagen}
          alt={banner.Descripcion || 'Banner'}
          className="w-full h-full object-contain rounded-2xl"
          style={{ borderRadius: '1rem' }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            {banner.Descripcion && (
              <div className="text-sm opacity-90">{banner.Descripcion}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerCard;
