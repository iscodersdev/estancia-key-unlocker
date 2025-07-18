
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, Tag, MapPin, BookOpen, Phone, User, LogIn, LogOut, CreditCard, Bell, ChevronDown, ChevronUp, History, Receipt, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [{
  title: "INICIO",
  icon: Home,
  url: "/"
}];

const tarjetaEstanciasSubmenu = [{
  title: "MI TARJETA",
  icon: CreditCard,
  url: "/mi-tarjeta"
}, {
  title: "ÚLTIMOS MOVIMIENTOS",
  icon: History,
  url: "/ultimos-movimientos"
}, {
  title: "MIS PAGOS",
  icon: Receipt,
  url: "/mis-pagos"
}, {
  title: "MIS COMPROBANTES",
  icon: FileText,
  url: "/mis-comprobantes"
}];

const authenticatedMenuItems = [{
  title: "PROMOCIONES",
  icon: Tag,
  url: "/promociones"
}, {
  title: "NUESTROS LOCALES",
  icon: MapPin,
  url: "/nuestros-locales"
}, {
  title: "CATÁLOGO",
  icon: BookOpen,
  url: "https://estanciaschiripa.com.ar/",
  external: true
}, {
  title: "NOTIFICACIONES",
  icon: Bell,
  url: "/notificaciones"
}, {
  title: "CONTACTANOS",
  icon: Phone,
  url: "https://api.whatsapp.com/send/?phone=5491135681058&text&type=phone_number&app_absent=0",
  external: true
}];

const unauthenticatedMenuItems = [{
  title: "PROMOCIONES",
  icon: Tag,
  url: "/promociones"
}, {
  title: "NUESTROS LOCALES",
  icon: MapPin,
  url: "/nuestros-locales"
}, {
  title: "CATÁLOGO",
  icon: BookOpen,
  url: "https://estanciaschiripa.com.ar/",
  external: true
}, {
  title: "CONTACTANOS",
  icon: Phone,
  url: "https://api.whatsapp.com/send/?phone=5491135681058&text&type=phone_number&app_absent=0",
  external: true
}];

export function AppSidebar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isTarjetaEstanciasOpen, setIsTarjetaEstanciasOpen] = useState(false);
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
  };

  const handleMenuClick = (item: typeof authenticatedMenuItems[0]) => {
    if (item.external) {
      window.open(item.url, '_blank');
    }
    // Cerrar sidebar en móviles después de hacer clic
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLinkClick = () => {
    // Cerrar sidebar en móviles después de hacer clic en un enlace
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const toggleTarjetaEstancias = () => {
    setIsTarjetaEstanciasOpen(!isTarjetaEstanciasOpen);
  };

  const handleMouseLeave = () => {
    // Solo cerrar automáticamente en móviles
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "none"} 
      className="border-r rounded-r-lg overflow-hidden" 
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent className="bg-[#f0ebf5] rounded-r-lg">
        {/* Header con estado de autenticación */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-tr-lg">
          {isAuthenticated ? (
            <div className="space-y-4">
              <Link to="/mis-datos" onClick={handleLinkClick}>
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-estancias-charcoal">
                          {user?.lastName}, {user?.firstName}
                        </p>
                        <div className="flex items-center text-xs text-gray-600">
                          <span>Mi Cuenta</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full rounded-none border-0 border-t border-gray-200 text-estancias-charcoal hover:bg-gray-50 justify-start px-0 pt-3"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" onClick={handleLinkClick}>
                <Button 
                  variant="outline" 
                  className="w-full mb-4 rounded-full border-estancias-charcoal text-estancias-charcoal hover:bg-estancias-charcoal hover:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
              <p className="text-sm text-gray-600 text-center">
                No tenes usuario?{" "}
                <Link to="/register-intro" className="text-estancias-charcoal hover:underline" onClick={handleLinkClick}>
                  Regístrate
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Menu Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-4">
              {/* Inicio siempre visible */}
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 text-estancias-charcoal font-bold text-left w-full justify-start">
                    <Link to={item.url} onClick={handleLinkClick}>
                      <span className="text-sm font-bold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* TARJETA ESTANCIAS toggle (solo para usuarios autenticados) */}
              {isAuthenticated && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      className="h-10 text-estancias-charcoal font-bold cursor-pointer text-left w-full justify-between" 
                      onClick={toggleTarjetaEstancias}
                    >
                      <span className="text-sm font-bold">TARJETA ESTANCIAS</span>
                      {isTarjetaEstanciasOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {/* Submenu de TARJETA ESTANCIAS */}
                  {isTarjetaEstanciasOpen && tarjetaEstanciasSubmenu.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-10 text-estancias-charcoal font-bold text-left w-full justify-start pl-8">
                        <Link to={item.url} onClick={handleLinkClick}>
                          <span className="text-sm font-bold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
              
              {/* Resto de menu items basado en autenticación */}
              {isAuthenticated ? authenticatedMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.external ? (
                    <SidebarMenuButton 
                      className="h-10 text-estancias-charcoal font-bold cursor-pointer text-left w-full justify-start" 
                      onClick={() => handleMenuClick(item)}
                    >
                      <span className="text-sm font-bold">{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild className="h-10 text-estancias-charcoal font-bold text-left w-full justify-start">
                      <Link to={item.url} onClick={handleLinkClick}>
                        <span className="text-sm font-bold">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              )) : unauthenticatedMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.external ? (
                    <SidebarMenuButton 
                      className="h-10 text-estancias-charcoal font-bold cursor-pointer text-left w-full justify-start" 
                      onClick={() => handleMenuClick(item)}
                    >
                      <span className="text-sm font-bold">{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild className="h-10 text-estancias-charcoal font-bold text-left w-full justify-start">
                      <Link to={item.url} onClick={handleLinkClick}>
                        <span className="text-sm font-bold">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer con logo */}
      <SidebarFooter className="bg-[#f0ebf5] border-t border-gray-200 rounded-br-lg p-0">
        <div className="flex items-center justify-center h-24 w-full">
          <img src="/lovable-uploads/1fd98caf-483c-4955-b7d4-e82faefe0193.png" alt="Estancias" className="h-3 md:h-4" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
