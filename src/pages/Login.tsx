import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión exitosamente",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.response?.data?.message || "Email o contraseña incorrectos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header con flecha de regreso */}
      <div className="p-6">
        <Link to="/" className="inline-block">
          <ArrowRight className="h-6 w-6 text-gray-600 rotate-180" />
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Bienvenida/o!</h1>
            <p className="text-gray-600">Ingresá tu usuario debajo</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Correo Electronico"
                  className="w-full border-0 border-b border-gray-300 rounded-none bg-transparent pl-7 py-4 text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-black"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="w-full border-0 border-b border-gray-300 rounded-none bg-transparent pl-7 py-4 pr-10 text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-black"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>
            </div>

            {/* Checkbox Recordarme */}
            <div className="flex items-center space-x-2 py-4">
              <Checkbox 
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => setFormData({ ...formData, remember: !!checked })}
                className="border-gray-400"
              />
              <label htmlFor="remember" className="text-gray-600 text-base">
                Recordarme
              </label>
            </div>

            {/* Botón de iniciar sesión */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-3 text-lg font-medium rounded-lg"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </div>

            {/* Link registrarse */}
            <div className="text-center pt-4">
              <Link to="/register-intro" className="text-gray-500 hover:text-gray-700">
                Registrarse
              </Link>
            </div>

            {/* Link recuperar contraseña */}
            <div className="text-center">
              <Link to="/forgot-password" className="text-gray-500 hover:text-gray-700">
                Recuperar Contraseña
              </Link>
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
            <a href="https://x.com/estancias_ch" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

export default Login;
