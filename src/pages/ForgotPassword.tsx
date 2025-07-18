import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast({
        title: "Email enviado",
        description: "Te hemos enviado un enlace para restablecer tu contraseña",
      });
      
      // Redirigir a reset-password después de 2 segundos
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al enviar el email de recuperación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="h-6 w-6"></div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Email Enviado</h1>
              <p className="text-gray-600">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña
              </p>
            </div>
            
            <div className="text-center space-y-4 mb-8">
              <p className="text-gray-600">
                Si no recibes el email en unos minutos, revisa tu carpeta de spam o intenta nuevamente.
              </p>
              <p className="text-gray-600">
                ¿Ya tienes el token de recuperación?{" "}
                <Link to="/reset-password" className="text-black font-medium hover:underline">
                  Cambiar contraseña
                </Link>
              </p>
            </div>
            
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-3 text-lg font-medium rounded-lg"
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-widest text-black">ESTANCIAS</h2>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-4">SOCIAL</p>
            <div className="flex justify-center space-x-8">
              <a href="https://www.instagram.com/estanciasrosario/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/p/Estancias-Chiripa-100064784917906" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Indicador inferior */}
          <div className="flex justify-center mt-8">
            <div className="w-32 h-1 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="h-6 w-6"></div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Recuperar Contraseña</h1>
            <p className="text-gray-600">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Correo Electronico"
                  className="w-full border-0 border-b border-gray-300 rounded-none bg-transparent pl-7 py-4 text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-3 text-lg font-medium rounded-lg"
              >
                {isLoading ? "Enviando..." : "Enviar Correo de Recuperación"}
              </Button>
            </div>

            <div className="text-center pt-4 space-y-2">
              <div className="text-gray-600">
                ¿Ya tienes el token de recuperación?{" "}
                <Link to="/reset-password" className="text-black font-medium hover:underline">
                  Cambiar contraseña
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-widest text-black">ESTANCIAS</h2>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 font-medium mb-4">SOCIAL</p>
          <div className="flex justify-center space-x-8">
            <a href="https://www.instagram.com/estanciasrosario/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/p/Estancias-Chiripa-100064784917906" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Indicador inferior */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
