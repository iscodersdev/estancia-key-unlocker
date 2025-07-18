
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Top banner - solo se muestra cuando NO está logueado */}
      {!isAuthenticated && (
        <div className="bg-estancias-cream text-estancias-charcoal text-center py-1.5 px-4 text-xs">
          <strong>TARJETA ESTANCIAS</strong> - Registrate y manejá tu cuenta
        </div>
      )}
      
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu button - solo visible en móviles */}
            <div className="md:hidden flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Menu className="h-5 w-5 text-estancias-charcoal" />
                </Button>
              </SidebarTrigger>
            </div>

            {/* Logo centrado */}
            <div className="flex-1 flex justify-center">
              <img 
                src="/lovable-uploads/1fd98caf-483c-4955-b7d4-e82faefe0193.png" 
                alt="Estancias" 
                className="h-3 md:h-4 object-contain" 
              />
            </div>

            {/* Icono de usuario - solo para usuarios autenticados */}
            <div className="flex items-center">
              {isAuthenticated && (
                <Link to="/mis-datos">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <User className="h-5 w-5 text-estancias-charcoal" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
