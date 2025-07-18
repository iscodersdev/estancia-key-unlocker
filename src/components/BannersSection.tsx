
import { useBanners } from '@/hooks/usePreloadData';
import type { BannerModel } from '@/services/bannerService';
import { useNavigate } from 'react-router-dom';

const BannersSection = () => {
  const { data: banners = [], isLoading, error } = useBanners();
  const navigate = useNavigate();

  console.log('BannersSection - banners recibidos:', banners);

  const handleBannerClick = (banner: BannerModel) => {
    console.log('Banner clickeado:', banner);
    
    // Si es el banner específico con ID 21, ir a promociones
    if (banner.Id === 21) {
      navigate('/promociones');
      return;
    }
    
    // Para otros banners, mantener la lógica original
    if (banner.Link) {
      window.open(banner.Link, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        <span className="ml-2 text-gray-600">Cargando banners...</span>
      </div>
    );
  }

  if (error) {
    console.error('Error cargando banners:', error);
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar los banners</p>
      </div>
    );
  }

  const bannersActivos = banners.filter(b => b.Activa);

  if (bannersActivos.length === 0) {
    return null;
  }

  return (
    <section className="px-2 sm:px-4 pb-8">
      <div className="space-y-4">
        {bannersActivos.map((banner) => (
          <div
            key={banner.Id}
            className="w-full rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleBannerClick(banner)}
          >
            {banner.Imagen ? (
              <div className="w-full rounded-2xl overflow-hidden">
                <img
                  src={banner.Imagen}
                  alt={banner.Descripcion || 'Banner'}
                  className="w-full h-auto rounded-2xl"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <p className="text-lg font-semibold">{banner.Titulo}</p>
                  {banner.Descripcion && (
                    <p className="text-sm opacity-90 mt-2">{banner.Descripcion}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BannersSection;
