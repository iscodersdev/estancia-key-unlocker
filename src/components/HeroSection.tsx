
import { Button } from "@/components/ui/button";
import { ShoppingBag, Coins, FileText, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleImageClick = () => {
    if (isAuthenticated) {
      navigate('/mi-tarjeta');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="bg-white overflow-hidden w-full">
      {/* Hero Card */}
      <div className="mx-2 sm:mx-4 mt-4 mb-8">
        <div 
          className="relative cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src="/lovable-uploads/f70ed64b-8419-4e08-8c0e-353cfc8a6c6b.png"
            alt="Hero"
            className="w-full h-auto rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
            {!isAuthenticated && (
              <Link to="/login">
                <Button size="sm" className="bg-white text-estancias-charcoal hover:bg-white/90 rounded-full px-4 py-2 text-sm">
                  Acceder ahora
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {isAuthenticated && (
        <div className="px-2 sm:px-6 pb-8 w-full overflow-hidden">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-xs mx-auto">
            <Link to="/mis-compras" className="flex flex-col items-center min-w-0">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-sm flex-shrink-0">
                <ShoppingBag className="w-5 h-5 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <p className="text-[10px] font-medium text-gray-700 text-center uppercase tracking-wide leading-tight break-words">
                MIS<br />COMPRAS
              </p>
            </Link>
            
            <Link to="/mis-pagos" className="flex flex-col items-center min-w-0">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-sm flex-shrink-0">
                <Coins className="w-5 h-5 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <p className="text-[10px] font-medium text-gray-700 text-center uppercase tracking-wide leading-tight break-words">
                MIS<br />PAGOS
              </p>
            </Link>
            
            <Link to="/mis-comprobantes" className="flex flex-col items-center min-w-0">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-sm flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <p className="text-[10px] font-medium text-gray-700 text-center uppercase tracking-wide leading-tight break-words">
                MIS<br />COMPROBANTES
              </p>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
