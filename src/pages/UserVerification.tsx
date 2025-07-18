import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const UserVerification = () => {
  const [nroTarjeta, setNroTarjeta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validación de número de tarjeta (solo números)
  const validateCardNumber = (cardNumber: string) => {
    const cardRegex = /^\d+$/;
    return cardRegex.test(cardNumber);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir números
    if (value === "" || validateCardNumber(value)) {
      setNroTarjeta(value);
      setError("");
    } else {
      setError("El número de tarjeta solo puede contener números");
    }
  };

  const handleValidate = async () => {
    // Validar que el campo no esté vacío
    if (!nroTarjeta.trim()) {
      setError("El número de tarjeta es requerido");
      toast({
        title: "Error",
        description: "El número de tarjeta es requerido",
        variant: "destructive",
      });
      return;
    }

    // Validar que solo contenga números
    if (!validateCardNumber(nroTarjeta)) {
      setError("El número de tarjeta solo puede contener números");
      toast({
        title: "Error de validación",
        description: "El número de tarjeta solo puede contener números",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      console.log('Validando tarjeta con PreRegistro:', nroTarjeta);
      
      // Usar la nueva API de PreRegistro
      const validationPayload = {
        FormularioRegistro: 5,
        NroTarjeta: nroTarjeta
      };
      
      console.log('Payload de validación:', validationPayload);
      
      // Llamada a la nueva API de PreRegistro
      const response = await api.post('/Musuario/PreRegistro', validationPayload);
      
      console.log('Respuesta de PreRegistro:', response.data);
      
      // Verificar la respuesta del servidor
      if (response.data.Status === 200) {
        // La tarjeta es válida y no está asociada a otro usuario
        console.log('Tarjeta validada exitosamente con PreRegistro');
        
        toast({
          title: "Tarjeta válida",
          description: "La tarjeta ha sido verificada correctamente",
        });
        
        // Crear los parámetros de URL con todos los datos del usuario
        const queryParams = new URLSearchParams({
          nroTarjeta: nroTarjeta,
          nombres: response.data.Nombres || '',
          apellido: response.data.Apellido || '',
          celular: response.data.Celular || '',
          email: response.data.eMail || ''
        });
        
        // Redirigir a la página de confirmación de usuario
        navigate(`/user-confirmation?${queryParams.toString()}`);
      } else {
        // El servidor devuelve un error específico
        let errorMessage = response.data.Mensaje || response.data.Message || 'Error al validar la tarjeta';
        
        // Agregar texto adicional si es error de preregistrar al socio
        if (errorMessage.includes("Error al PreRegistrar al Socio")) {
          errorMessage += ". Por favor verificar la tarjeta ingresada";
        }
        
        console.error('Error de validación:', response.data);
        
        setError(errorMessage);
        toast({
          title: "Error de validación",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
    } catch (error: any) {
      console.error('Error durante la validación:', error);
      
      let errorMessage = "Error al validar la tarjeta";
      
      if (error.response?.data?.Mensaje) {
        errorMessage = error.response.data.Mensaje;
        // Agregar texto adicional si es error de preregistrar al socio
        if (errorMessage.includes("Error al PreRegistrar al Socio")) {
          errorMessage += ". Por favor verificar la tarjeta ingresada";
        }
      } else if (error.response?.data?.Message) {
        errorMessage = error.response.data.Message;
        // Agregar texto adicional si es error de preregistrar al socio
        if (errorMessage.includes("Error al PreRegistrar al Socio")) {
          errorMessage += ". Por favor verificar la tarjeta ingresada";
        }
      } else if (error.response?.status === 500) {
        errorMessage = "Error interno del servidor. Por favor, intenta nuevamente más tarde.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Error al validar tarjeta",
        description: errorMessage,
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
        <Link to="/register-intro" className="inline-block">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto">
          {/* Logo/Título */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black tracking-widest mb-8">ESTANCIAS</h1>
          </div>

          {/* Título principal */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-6">Verificación de Usuario</h2>
          </div>

          {/* Iconos ilustrativos */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 text-white p-4 rounded-lg mb-2 relative">
                <CreditCard className="h-8 w-8" />
                <div className="absolute -right-2 -top-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                  ESTANCIAS
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="border-2 border-gray-800 p-4 rounded-full mb-2 relative">
                <Shield className="h-8 w-8" />
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Texto descriptivo */}
          <div className="mb-8">
            <p className="text-gray-700 text-center">
              Ingrese todos los dígitos de su Tarjeta Estancias para verificar su Identidad
            </p>
          </div>

          {/* Campo Número de Tarjeta */}
          <div className="space-y-2 mb-8">
            <div className="relative">
              <CreditCard className="absolute left-0 top-4 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Número de Tarjeta"
                className={`w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent pl-8 py-4 text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:outline-none focus:border-black ${error ? 'border-red-500' : ''}`}
                value={nroTarjeta}
                onChange={handleCardNumberChange}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-4">
            <Link to="/register-intro" className="flex-1">
              <Button
                variant="outline"
                className="w-full py-3 text-lg font-medium rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                ← Volver
              </Button>
            </Link>
            
            <Button
              onClick={handleValidate}
              disabled={isLoading || !nroTarjeta.trim()}
              className="flex-1 bg-black text-white hover:bg-gray-800 transition-colors py-3 text-lg font-medium rounded-lg"
            >
              {isLoading ? "Validando..." : "Validar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Indicador inferior */}
      <div className="flex justify-center pb-8">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default UserVerification;
