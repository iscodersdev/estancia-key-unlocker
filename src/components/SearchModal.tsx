
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Bell, User, CreditCard, FileText, Gift, MapPin, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchFunction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  keywords: string[];
  external?: boolean;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({
  isOpen,
  onClose
}: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const functions: SearchFunction[] = [{
    id: "inicio",
    title: "Inicio",
    description: "Página principal con promociones y novedades",
    icon: <Home className="h-5 w-5" />,
    route: "/",
    keywords: ["inicio", "home", "principal", "promociones", "novedades"]
  }, {
    id: "catalogo",
    title: "Catálogo de Productos",
    description: "Explora todos nuestros productos disponibles",
    icon: <BookOpen className="h-5 w-5" />,
    route: "https://estanciaschiripa.com.ar/",
    keywords: ["catalogo", "productos", "comprar", "tienda", "shopping"],
    external: true
  }, {
    id: "notificaciones",
    title: "Notificaciones",
    description: "Ver todas tus notificaciones y alertas",
    icon: <Bell className="h-5 w-5" />,
    route: "/notificaciones",
    keywords: ["notificaciones", "alertas", "mensajes", "avisos"]
  }, {
    id: "mis-datos",
    title: "Mis Datos",
    description: "Gestionar tu información personal y preferencias",
    icon: <User className="h-5 w-5" />,
    route: "/mis-datos",
    keywords: ["perfil", "datos", "información", "personal", "configuración"]
  }, {
    id: "promociones",
    title: "Promociones",
    description: "Descubre ofertas especiales y descuentos",
    icon: <Gift className="h-5 w-5" />,
    route: "/promociones",
    keywords: ["promociones", "ofertas", "descuentos", "especiales", "gift"]
  }, {
    id: "tarjeta-estancias",
    title: "Tarjeta Estancias",
    description: "Información sobre la tarjeta de fidelidad",
    icon: <CreditCard className="h-5 w-5" />,
    route: "/tarjeta-estancias",
    keywords: ["tarjeta", "fidelidad", "puntos", "beneficios"]
  }, {
    id: "mi-tarjeta",
    title: "Mi Tarjeta",
    description: "Ver detalles y saldo de tu tarjeta",
    icon: <CreditCard className="h-5 w-5" />,
    route: "/mi-tarjeta",
    keywords: ["mi tarjeta", "saldo", "puntos", "estado"]
  }, {
    id: "movimientos",
    title: "Últimos Movimientos",
    description: "Historial de transacciones y movimientos",
    icon: <FileText className="h-5 w-5" />,
    route: "/ultimos-movimientos",
    keywords: ["movimientos", "historial", "transacciones", "actividad"]
  }, {
    id: "pagos",
    title: "Mis Pagos",
    description: "Gestionar métodos de pago y historial",
    icon: <CreditCard className="h-5 w-5" />,
    route: "/mis-pagos",
    keywords: ["pagos", "métodos", "historial", "facturación"]
  }, {
    id: "comprobantes",
    title: "Mis Comprobantes",
    description: "Descargar y ver comprobantes de compra",
    icon: <FileText className="h-5 w-5" />,
    route: "/mis-comprobantes",
    keywords: ["comprobantes", "facturas", "recibos", "descargar"]
  }, {
    id: "locales",
    title: "Nuestros Locales",
    description: "Encuentra nuestras tiendas físicas",
    icon: <MapPin className="h-5 w-5" />,
    route: "/nuestros-locales",
    keywords: ["locales", "tiendas", "ubicaciones", "direcciones", "mapa"]
  }];

  const filteredFunctions = functions.filter(func => func.title.toLowerCase().includes(searchQuery.toLowerCase()) || func.description.toLowerCase().includes(searchQuery.toLowerCase()) || func.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())));
  
  const handleFunctionClick = (route: string, external?: boolean) => {
    if (external) {
      window.open(route, '_blank');
    } else {
      navigate(route);
    }
    onClose();
    setSearchQuery("");
  };
  
  const handleClose = () => {
    onClose();
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`
        ${isMobile 
          ? 'max-w-[300px] w-[300px] max-h-[85vh]' 
          : 'max-w-sm w-full max-h-[80vh]'
        } 
        overflow-hidden p-4 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
      `}>
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4" />
            {isMobile ? "Buscar" : "Buscar Funcionalidad"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <Input 
            placeholder={isMobile ? "¿Qué buscas?" : "¿Qué estás buscando?"} 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="w-full text-sm" 
            autoFocus 
          />
          
          <div className="max-h-[60vh] overflow-y-auto space-y-1">
            {filteredFunctions.length > 0 ? 
              filteredFunctions.map(func => (
                <Button 
                  key={func.id} 
                  variant="ghost" 
                  className="w-full justify-start h-auto p-3 text-left hover:bg-estancias-cream/20" 
                  onClick={() => handleFunctionClick(func.route, func.external)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="text-estancias-charcoal mt-0.5 flex-shrink-0">
                      {func.icon}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-medium text-estancias-charcoal text-sm leading-tight break-words">
                        {func.title}
                      </h4>
                      <p className={`text-gray-600 mt-1 leading-tight break-words whitespace-normal ${
                        isMobile ? 'text-xs' : 'text-xs'
                      }`}>
                        {func.description}
                      </p>
                    </div>
                  </div>
                </Button>
              )) : (
              <div className="text-center py-6 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No se encontraron funcionalidades</p>
                <p className="text-xs mt-1">Prueba con otros términos</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
