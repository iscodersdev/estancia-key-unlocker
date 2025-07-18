import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const RegisterIntro = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/user-verification');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header con flecha de regreso */}
      <div className="p-6">
        <Link to="/login" className="inline-block">
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
            <h2 className="text-3xl font-bold text-black mb-6">Creá una nueva cuenta</h2>
          </div>

          {/* Lista de beneficios */}
          <div className="space-y-3 mb-12">
            <div className="flex items-start">
              <span className="text-black mr-2">-</span>
              <span className="text-gray-700">Pagá comodamente</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-2">-</span>
              <span className="text-gray-700">Introducí tus datos por única vez</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-2">-</span>
              <span className="text-gray-700">Recibí las novedades en tendencias y promociones</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-2">-</span>
              <span className="text-gray-700">Gestioná de manera ágil tus pedidos</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-2">-</span>
              <span className="text-gray-700">Gestioná por completo tu Tarjeta Estancias</span>
            </div>
          </div>

          {/* Texto de inicio */}
          <div className="mb-8">
            <p className="text-gray-700 text-lg">Para comenzar, Presiona Comenzar:</p>
          </div>

          {/* Botón Comenzar */}
          <div className="mb-8">
            <Button
              onClick={handleStart}
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-4 text-lg font-medium rounded-lg"
            >
              Comenzar
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

export default RegisterIntro;
