
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const UserConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Obtener los datos desde los parámetros de URL
  const nroTarjeta = searchParams.get('nroTarjeta') || '';
  const nombres = searchParams.get('nombres') || '';
  const apellido = searchParams.get('apellido') || '';
  const celular = searchParams.get('celular') || '';
  const email = searchParams.get('email') || '';

  const handleConfirm = () => {
    // Crear los parámetros de URL con todos los datos del usuario
    const queryParams = new URLSearchParams({
      nroTarjeta: nroTarjeta,
      nombres: nombres,
      apellido: apellido,
      celular: celular,
      email: email
    });
    
    // Redirigir al formulario de registro completo con todos los datos
    navigate(`/register?${queryParams.toString()}`);
  };

  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header con flecha de regreso */}
      <div className="p-6">
        <button onClick={handleGoBack} className="inline-block">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto">
          {/* Logo/Título */}
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-black tracking-widest">ESTANCIAS</h1>
          </div>

          {/* Icono de usuario */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-black" />
            </div>
          </div>

          {/* Texto principal */}
          <div className="mb-8 text-center">
            <p className="text-gray-700 text-lg mb-4">
              El número de tarjeta ingresado pertenece a
            </p>
            <h2 className="text-2xl font-bold text-black">
              {nombres.toUpperCase()} {apellido.toUpperCase()}
            </h2>
          </div>

          {/* Botones */}
          <div className="flex space-x-4">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1 py-3 text-lg font-medium rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ← Volver
            </Button>
            
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-black text-white hover:bg-gray-800 transition-colors py-3 text-lg font-medium rounded-lg"
            >
              Soy yo ✓
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

export default UserConfirmation;
