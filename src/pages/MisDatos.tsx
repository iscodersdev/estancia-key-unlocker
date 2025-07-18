import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, User, Phone, Home, Lock, QrCode } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import UserQRModal from '@/components/UserQRModal';

const MisDatos: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        address: user.address || '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: numericValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateEmail(formData.email)) {
        toast({
          title: "Error",
          description: "Por favor, ingresa un email válido",
          variant: "destructive",
        });
        return;
      }

      if (formData.phone && (formData.phone.length < 8 || formData.phone.length > 15)) {
        toast({
          title: "Error",
          description: "El teléfono debe tener entre 8 y 15 dígitos",
          variant: "destructive",
        });
        return;
      }

      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas nuevas no coinciden",
          variant: "destructive",
        });
        return;
      }

      if (formData.newPassword && formData.newPassword.length < 6) {
        toast({
          title: "Error",
          description: "La nueva contraseña debe tener al menos 6 caracteres",
          variant: "destructive",
        });
        return;
      }

      const sessionUAT = localStorage.getItem('authToken');
      
      if (!sessionUAT) {
        toast({
          title: "Error",
          description: "No se encontró token de sesión. Por favor, vuelve a iniciar sesión.",
          variant: "destructive",
        });
        return;
      }

      const requestBody = {
        UAT: sessionUAT,
        Mail: formData.email,
        Celular: formData.phone,
        Domicilio: formData.address,
        Password1: formData.newPassword || "",
        Password2: formData.confirmPassword || "",
        FechaNacimiento: formData.birthDate || "",
        Nombre: formData.firstName,
        Apellido: formData.lastName
      };

      console.log('Enviando datos actualizados:', requestBody);

      const response = await fetch('https://portalestancias.com.ar/api/MUsuario/ActualizaDatosPersona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);

      if (responseData.Status === 200) {
        toast({
          title: "Éxito",
          description: "Datos actualizados correctamente",
        });

        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUser = {
          ...currentUser,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          birthDate: formData.birthDate
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        updateUser(updatedUser);

        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        throw new Error(responseData.Mensaje || 'Error al actualizar datos');
      }
    } catch (error: any) {
      console.error('Error al actualizar datos:', error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar los datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header sin navegación - solo título centrado y QR */}
        <div className="flex items-center justify-center relative mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Mi Cuenta</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQRModal(true)}
            className="absolute right-0 text-gray-600"
          >
            <QrCode className="h-5 w-5" />
          </Button>
        </div>

        {/* Información del usuario centrada */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {formData.lastName}, {formData.firstName}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sección Celular */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="text-sm text-gray-500 mb-1 block">Celular</label>
                  <Input
                    type="tel"
                    placeholder="Tu número de celular"
                    className="border-0 p-0 h-auto text-base bg-transparent focus-visible:ring-0"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección Domicilio */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-gray-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="text-sm text-gray-500 mb-1 block">Domicilio</label>
                  <Input
                    type="text"
                    placeholder="Tu dirección"
                    className="border-0 p-0 h-auto text-base bg-transparent focus-visible:ring-0"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección Contraseña */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-gray-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="text-sm text-gray-500 mb-1 block">Contraseña</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nueva contraseña"
                      className="border-0 p-0 h-auto text-base bg-transparent focus-visible:ring-0 pr-8"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección Repetir Contraseña */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-gray-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="text-sm text-gray-500 mb-1 block">Repetir Contraseña</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmar nueva contraseña"
                      className="border-0 p-0 h-auto text-base bg-transparent focus-visible:ring-0 pr-8"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón Guardar Cambios */}
          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl text-base font-medium mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>

          {/* Botón Borrar Cuenta */}
          <Button 
            type="button" 
            variant="ghost"
            className="w-full text-gray-500 py-4 text-base font-medium"
            onClick={() => {
              // Aquí puedes agregar la lógica para borrar cuenta
              console.log('Borrar cuenta');
            }}
          >
            Borrar Cuenta
          </Button>
        </form>
      </div>

      {/* Modal del QR */}
      <UserQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        userId={user?.id?.toString() || ''}
      />
    </div>
  );
};

export default MisDatos;
