
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePhone, validateCardNumber } from "@/utils/validation";
import { NameFields } from "@/components/register/NameFields";
import { EmailField } from "@/components/register/EmailField";
import { PhoneField } from "@/components/register/PhoneField";
import { CardNumberField } from "@/components/register/CardNumberField";
import { PasswordFields } from "@/components/register/PasswordFields";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nroTarjeta: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    nroTarjeta: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // Estado para determinar si el email es editable
  const [isEmailEditable, setIsEmailEditable] = useState(false);

  // Cargar todos los datos desde los parámetros de URL
  useEffect(() => {
    const nroTarjetaFromUrl = searchParams.get('nroTarjeta');
    const nombresFromUrl = searchParams.get('nombres');
    const apellidoFromUrl = searchParams.get('apellido');
    const celularFromUrl = searchParams.get('celular');
    const emailFromUrl = searchParams.get('email');
    
    if (nroTarjetaFromUrl || nombresFromUrl || apellidoFromUrl || celularFromUrl || emailFromUrl) {
      // Verificar si el email heredado es válido
      const emailIsValid = emailFromUrl ? validateEmail(emailFromUrl) : false;
      
      setFormData(prev => ({
        ...prev,
        nroTarjeta: nroTarjetaFromUrl || prev.nroTarjeta,
        firstName: nombresFromUrl || prev.firstName,
        lastName: apellidoFromUrl || prev.lastName,
        phone: celularFromUrl || prev.phone,
        email: emailFromUrl || prev.email,
      }));

      // Si el email no es válido, habilitar edición
      if (emailFromUrl && !emailIsValid) {
        setIsEmailEditable(true);
        console.log('Email heredado no válido, habilitando edición:', emailFromUrl);
      }
    }
  }, [searchParams]);

  // Verificar si los campos vienen de la validación (son de solo lectura)
  const isCardNumberReadOnly = Boolean(searchParams.get('nroTarjeta'));
  const isFirstNameReadOnly = Boolean(searchParams.get('nombres'));
  const isLastNameReadOnly = Boolean(searchParams.get('apellido'));
  const isPhoneReadOnly = Boolean(searchParams.get('celular'));
  // El email es de solo lectura solo si es válido
  const isEmailReadOnly = Boolean(searchParams.get('email')) && !isEmailEditable;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir cambios si no viene de la validación o si es editable
    if (isEmailReadOnly) return;
    
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, email: "Por favor ingresa un email válido" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir cambios si no viene de la validación
    if (isPhoneReadOnly) return;
    
    const value = e.target.value;
    
    // Solo permitir números, espacios, +, -, (, )
    if (value === "" || validatePhone(value)) {
      setFormData({ ...formData, phone: value });
      setErrors({ ...errors, phone: "" });
    } else {
      setErrors({ ...errors, phone: "El teléfono solo puede contener números y caracteres como +, -, (, )" });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir cambios si no viene de la validación
    if (isCardNumberReadOnly) return;
    
    const value = e.target.value;
    
    // Solo permitir números
    if (value === "" || validateCardNumber(value)) {
      setFormData({ ...formData, nroTarjeta: value });
      setErrors({ ...errors, nroTarjeta: "" });
    } else {
      setErrors({ ...errors, nroTarjeta: "El número de tarjeta solo puede contener números" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const newErrors = {
      email: "",
      phone: "",
      nroTarjeta: "",
    };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor ingresa un email válido";
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = "El teléfono solo puede contener números y caracteres como +, -, (, )";
    }

    if (!validateCardNumber(formData.nroTarjeta)) {
      newErrors.nroTarjeta = "El número de tarjeta solo puede contener números";
    }

    setErrors(newErrors);

    // Si hay errores, no continuar
    if (newErrors.email || newErrors.phone || newErrors.nroTarjeta) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nroTarjeta.trim()) {
      toast({
        title: "Error",
        description: "El número de tarjeta es requerido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Iniciando proceso de registro...');
      
      const result = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        nroTarjeta: formData.nroTarjeta,
      });
      
      console.log('Registro completado exitosamente:', result);
      
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta se ha creado exitosamente. Ya puedes iniciar sesión.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error durante el registro:', error);
      
      let errorMessage = "Error al crear la cuenta";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.Mensaje) {
        errorMessage = error.response.data.Mensaje;
      } else if (error.response?.data?.Message) {
        errorMessage = error.response.data.Message;
      } else if (error.response?.status === 500) {
        errorMessage = "Error interno del servidor. Por favor, intenta nuevamente más tarde.";
      }
      
      toast({
        title: "Error al crear cuenta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-estancias-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-estancias-charcoal tracking-wide">
              ESTANCIAS
            </h1>
          </div>
          <CardTitle className="text-xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Completa tus datos para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <NameFields
              firstName={formData.firstName}
              lastName={formData.lastName}
              isFirstNameReadOnly={isFirstNameReadOnly}
              isLastNameReadOnly={isLastNameReadOnly}
              onFirstNameChange={(value) => setFormData({ ...formData, firstName: value })}
              onLastNameChange={(value) => setFormData({ ...formData, lastName: value })}
            />

            <EmailField
              email={formData.email}
              error={errors.email}
              isEmailReadOnly={isEmailReadOnly}
              isEmailEditable={isEmailEditable}
              onChange={handleEmailChange}
            />

            <PhoneField
              phone={formData.phone}
              error={errors.phone}
              isPhoneReadOnly={isPhoneReadOnly}
              onChange={handlePhoneChange}
            />

            <CardNumberField
              nroTarjeta={formData.nroTarjeta}
              error={errors.nroTarjeta}
              isCardNumberReadOnly={isCardNumberReadOnly}
              onChange={handleCardNumberChange}
            />
            
            <PasswordFields
              password={formData.password}
              confirmPassword={formData.confirmPassword}
              onPasswordChange={(value) => setFormData({ ...formData, password: value })}
              onConfirmPasswordChange={(value) => setFormData({ ...formData, confirmPassword: value })}
            />

            <Button 
              type="submit" 
              className="w-full bg-estancias-charcoal hover:bg-estancias-charcoal/90"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-estancias-charcoal font-medium hover:underline">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
