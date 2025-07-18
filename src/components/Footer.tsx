
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-estancias-charcoal text-white py-12 sm:py-16">
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4 text-center sm:text-left">
            <img 
              src="/lovable-uploads/1fd98caf-483c-4955-b7d4-e82faefe0193.png" 
              alt="Estancias" 
              className="h-8 mx-auto sm:mx-0 filter invert"
            />
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
              Moda premium con estilo atemporal. 
              Más de 10 años vistiendo a Chile con calidad y elegancia.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 w-8 h-8 sm:w-10 sm:h-10">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 w-8 h-8 sm:w-10 sm:h-10">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Sobre Nosotros
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Promociones
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Catálogo
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Lookbook
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold">Atención al Cliente</h4>
            <div className="space-y-2">
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Guía de Tallas
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Cambios y Devoluciones
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Preguntas Frecuentes
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm">
                Términos y Condiciones
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-estancias-taupe flex-shrink-0" />
                <span className="text-white/80 text-sm">Santiago, Chile</span>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-estancias-taupe flex-shrink-0" />
                <span className="text-white/80 text-sm">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-estancias-taupe flex-shrink-0" />
                <span className="text-white/80 text-sm">hola@estancias.cl</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Estancias. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
