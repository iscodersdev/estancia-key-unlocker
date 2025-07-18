
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePreloadComprobantes } from "@/hooks/usePreloadComprobantes";
import { usePreloadData } from "@/hooks/usePreloadData";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterIntro from "./pages/RegisterIntro";
import UserVerification from "./pages/UserVerification";
import UserConfirmation from "./pages/UserConfirmation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MisDatos from "./pages/MisDatos";
import Promociones from "./pages/Promociones";
import Notificaciones from "./pages/Notificaciones";
import NuestrosLocales from "./pages/NuestrosLocales";
import NotFound from "./pages/NotFound";
import MiTarjeta from "./pages/MiTarjeta";
import UltimosMovimientos from "./pages/UltimosMovimientos";
import MisPagos from "./pages/MisPagos";
import MisCompras from "./pages/MisCompras";
import MisComprobantes from "./pages/MisComprobantes";
import MiResumen from "./pages/MiResumen";
import ResumenDetalle from "./pages/ResumenDetalle";
import MetodosPago from "./pages/MetodosPago";
import ComprobanteConfirmacion from "./pages/ComprobanteConfirmacion";
import PagoExitoso from "./pages/PagoExitoso";
import PagoFallido from "./pages/PagoFallido";

const queryClient = new QueryClient();

// Componente interno para manejar la precarga
const AppWithPreload = () => {
  // Activar precarga automática de comprobantes
  usePreloadComprobantes();
  
  // Activar precarga automática de banners y promociones
  usePreloadData();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-intro" element={<RegisterIntro />} />
            <Route path="/user-verification" element={<UserVerification />} />
            <Route path="/user-confirmation" element={<UserConfirmation />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/mis-datos" element={<MisDatos />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/nuestros-locales" element={<NuestrosLocales />} />
            <Route path="/mi-tarjeta" element={<MiTarjeta />} />
            <Route path="/ultimos-movimientos" element={<UltimosMovimientos />} />
            <Route path="/mis-pagos" element={<MisPagos />} />
            <Route path="/mis-compras" element={<MisCompras />} />
            <Route path="/mis-comprobantes" element={<MisComprobantes />} />
            <Route path="/mi-resumen" element={<MiResumen />} />
            <Route path="/mi-resumen/:period" element={<ResumenDetalle />} />
            <Route path="/metodos-pago" element={<MetodosPago />} />
            <Route path="/comprobante-confirmacion" element={<ComprobanteConfirmacion />} />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
            <Route path="/pago-fallido" element={<PagoFallido />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppWithPreload />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
