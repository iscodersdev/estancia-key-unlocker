import api from './api';
import { parseFullName } from '@/utils/nameUtils';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  nroTarjeta: string; // Nuevo campo para número de tarjeta
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  profileImage?: string;
  // Campos adicionales que puede devolver la API
  Nombres?: string;
  Apellido?: string;
  Mail?: string;
  Telefono?: string;
}

export interface UpdateUserData {
  usu_Nombre: string;
  usu_Apellido: string;
  usu_Mail: string;
  usu_Celular: string;
  usu_Domicilio?: string;
  cambia_Password_1?: string;
  cambia_Password_2?: string;
  cambia_Password_3?: string;
  mut_UAT: string;
}

export const authService = {
  login: async (data: LoginData) => {
    const loginPayload = {
      Mail: data.email,
      Password: data.password,
      Recordarme: false
    };
    
    const response = await api.post('/musuario/login20', loginPayload);
    console.log('Respuesta del login:', response.data);
    
    // Verificar que tengamos un UAT válido del servidor
    const userData = response.data;
    const token = userData.UAT;
    
    if (!token || token === null || token === 'null') {
      console.error('Login falló: UAT no válido del servidor:', token);
      throw new Error('Credenciales incorrectas o sesión no válida. Por favor, verifica tus datos.');
    }
    
    // La respuesta completa se guarda como string en localStorage (como en Flutter)
    localStorage.setItem('USER', JSON.stringify(response.data));
    
    // Parsear el nombre completo que viene concatenado
    let parsedFirstName = '';
    let parsedLastName = '';
    
    // Intentar obtener el nombre completo de diferentes campos posibles
    const fullNameField = userData.NombreCompleto || userData.Nombres || userData.firstName || '';
    const lastNameField = userData.Apellido || userData.lastName || userData.Apellidos || '';
    
    console.log('Datos originales del usuario:', {
      NombreCompleto: userData.NombreCompleto,
      Nombres: userData.Nombres,
      Apellido: userData.Apellido,
      fullNameField,
      lastNameField
    });
    
    // Si tenemos un campo con nombre completo, parsearlo
    if (fullNameField && fullNameField.includes(',')) {
      const parsed = parseFullName(fullNameField);
      parsedFirstName = parsed.firstName;
      parsedLastName = parsed.lastName;
      console.log('Nombre parseado desde campo completo:', parsed);
    } else if (lastNameField && lastNameField.includes(',')) {
      // Si el apellido contiene coma, probablemente tiene el formato completo
      const parsed = parseFullName(lastNameField);
      parsedFirstName = parsed.firstName;
      parsedLastName = parsed.lastName;
      console.log('Nombre parseado desde campo apellido:', parsed);
    } else {
      // Usar los campos tal como vienen si no hay formato concatenado
      parsedFirstName = userData.Nombres || userData.firstName || userData.Nombre || '';
      parsedLastName = userData.Apellido || userData.lastName || userData.Apellidos || '';
    }
    
    // Normalizar los datos del usuario para mantener compatibilidad
    const normalizedUser: User = {
      id: userData.IdPersona || userData.id || userData.NumeroDocumento || 0,
      firstName: parsedFirstName,
      lastName: parsedLastName,
      email: userData.Mail || userData.email || data.email,
      phone: userData.Telefono || userData.phone || userData.Celular || '',
      // Agregar campos adicionales que pueden venir del servidor
      birthDate: userData.FechaNacimiento || userData.birthDate || '',
      address: userData.Domicilio || userData.address || '',
      city: userData.Ciudad || userData.city || '',
      postalCode: userData.CodigoPostal || userData.postalCode || '',
      profileImage: userData.ImagenPerfil || userData.profileImage || '',
      // Mantener los campos originales del servidor para referencia
      ...userData
    };
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(normalizedUser));
    
    console.log('Usuario normalizado guardado:', normalizedUser);
    console.log('Token UAT válido guardado:', token);
    
    // Intentar registrar dispositivo para notificaciones push (opcional)
    try {
      console.log('Intentando registrar dispositivo para notificaciones push...');
      await authService.registerDeviceForPush();
      console.log('Dispositivo registrado exitosamente para notificaciones push');
    } catch (pushError: any) {
      console.warn('No se pudo registrar el dispositivo para notificaciones push:', {
        error: pushError.message || pushError,
        code: pushError.code,
        status: pushError.response?.status,
        data: pushError.response?.data
      });
      // No fallar el login si falla el registro de push - es opcional
    }
    
    return { token, user: normalizedUser };
  },

  register: async (data: RegisterData) => {
    console.log('=== INICIANDO REGISTRO ===');
    console.log('Datos recibidos:', data);
    
    // Transformar los datos al formato que espera el servidor
    const registrationPayload = {
      Mail: data.email,
      Password1: data.password,
      Password2: data.password, // Confirmación de contraseña
      Apellido: data.lastName,
      Nombres: data.firstName,
      Celular: data.phone,
      Nrotarjeta: data.nroTarjeta, // Usar el número de tarjeta del usuario
      Token: "",
      EmpresaId: 3 // Hardcodeado en 3 como solicitado
    };
    
    console.log('Payload transformado para enviar:', registrationPayload);
    
    const response = await api.post('/musuario/RegistraPersona20', registrationPayload);
    
    console.log('=== RESPUESTA DEL REGISTRO ===');
    console.log('Status HTTP:', response.status);
    console.log('Data completa:', response.data);
    
    // Verificar que la respuesta sea exitosa
    if (response.data.Status === 200) {
      console.log('Registro exitoso:', response.data);
      return response.data;
    } else {
      // El servidor devuelve un error específico
      const errorMessage = response.data.Mensaje || response.data.Message || 'Error al crear la cuenta';
      console.error('Error en respuesta del servidor:', response.data);
      throw new Error(errorMessage);
    }
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/musuario/RecuperaPassword', { email });
    return response.data;
  },

  changePassword: async (data: { token: string; newPassword: string; email: string }) => {
    console.log('=== INICIANDO VALIDACIÓN DE PASSWORD ===');
    console.log('Datos recibidos:', data);
    
    // Crear el payload según el formato exacto del endpoint
    const requestPayload = {
      eMail: data.email,
      Password1: data.newPassword,
      Password2: data.newPassword, // Confirmación de contraseña
      Token: data.token
    };
    
    console.log('=== REQUEST PAYLOAD ===');
    console.log('URL:', '/MUsuario/ValidarPassword');
    console.log('Payload a enviar:', JSON.stringify(requestPayload, null, 2));
    
    try {
      const response = await api.post('/MUsuario/ValidarPassword', requestPayload);
      
      console.log('=== RESPONSE EXITOSA ===');
      console.log('Status HTTP:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data completa:', JSON.stringify(response.data, null, 2));
      
      // Verificar el Status interno de la API, no solo el HTTP status
      if (response.data.Status === 200) {
        console.log('Contraseña validada exitosamente:', response.data);
        return response.data;
      } else {
        // Si el Status interno no es 200, es un error de la API
        const errorMessage = response.data.Mensaje || response.data.Message || 'Error al validar la contraseña';
        console.error('Error en la validación:', response.data);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('=== ERROR EN VALIDACIÓN DE PASSWORD ===');
      console.error('Tipo de error:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Request Config:', error.config);
      
      throw error;
    }
  },

  registerDeviceForPush: async () => {
    try {
      console.log('=== INICIANDO REGISTRO DE DISPOSITIVO PARA PUSH ===');
      
      // Verificar que el usuario esté autenticado
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Usuario no autenticado - no se puede registrar para push');
      }
      
      // Generar un ID único para el dispositivo (simulado para web)
      const deviceId = localStorage.getItem('deviceId') || 
        'web-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);

      const pushData = {
        deviceId: deviceId,
        platform: 'web',
        token: deviceId, // En web no hay token real, usamos el deviceId
        UAT: token // Incluir el token de sesión
      };

      console.log('Payload para registro de push:', pushData);
      console.log('Endpoint: /musuario/RegistrarWonderPush');

      const response = await api.post('/musuario/RegistrarWonderPush', pushData);
      
      console.log('=== RESPUESTA EXITOSA DEL REGISTRO PUSH ===');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('=== ERROR EN REGISTRO PUSH ===');
      console.error('Tipo:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Código:', error.code);
      console.error('Status HTTP:', error.response?.status);
      console.error('Data de respuesta:', error.response?.data);
      console.error('Config de request:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      });
      
      // Re-lanzar el error para que el caller lo maneje
      throw new Error(`Error registrando dispositivo para push: ${error.message}`);
    }
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/user/me', data);
    return response.data;
  },

  updateUserDataPartial: async (changedFields: any) => {
    try {
      console.log('=== DEBUG: Actualizando datos parciales ===');
      console.log('Campos modificados enviados:', changedFields);
      
      // Verificar que tengamos el UAT (priorizar el de la sesión)
      const sessionUAT = localStorage.getItem('authToken');
      
      if (!sessionUAT || sessionUAT === 'null') {
        throw new Error('No se encontró un token de sesión válido. Por favor, vuelve a iniciar sesión.');
      }
      
      // Crear el payload con el formato exacto que espera el backend
      const payload = {
        UAT: sessionUAT,
        usu_Celular: changedFields.usu_Celular || "",
        usu_Mail: changedFields.usu_Mail || "",
        usu_Nombre: changedFields.usu_Nombre || "",
        usu_Apellido: changedFields.usu_Apellido || "",
        usu_Domicilio: changedFields.usu_Domicilio || "",
        cambia_Password_1: changedFields.cambia_Password_1 || "",
        cambia_Password_2: changedFields.cambia_Password_2 || "",
        cambia_Password_3: changedFields.cambia_Password_3 || ""
      };

      console.log('Payload final a enviar:', payload);
      console.log('URL del endpoint:', '/MUsuario/ActualizaDatosPersona');

      const response = await api.post('/MUsuario/ActualizaDatosPersona', payload);
      
      console.log('=== RESPUESTA DEL SERVIDOR ===');
      console.log('Status HTTP:', response.status);
      console.log('Data completa:', response.data);
      
      if (response.data.Status === 200) {
        console.log('Datos actualizados exitosamente:', response.data);
        return response.data;
      } else {
        console.error('Error en respuesta del servidor:', response.data);
        throw new Error(response.data.Mensaje || 'Error al actualizar datos');
      }
    } catch (error: any) {
      console.error('=== ERROR COMPLETO ===');
      console.error('Tipo de error:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', error.response?.data);
      console.error('Request Config:', error.config);
      
      // Si es un error de autenticación o token inválido
      if (error.response?.status === 401 || error.message.includes('token')) {
        throw new Error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      }
      
      // Si es un error 500, probablemente es del servidor
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor. Verifique que el token de sesión sea válido.');
      }
      
      throw error;
    }
  },

  updateUserData: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) => {
    try {
      console.log('Actualizando datos de usuario...');
      
      const fullUserData = authService.getFullUserData();
      const sessionUAT = localStorage.getItem('authToken');
      const finalUAT = sessionUAT || fullUserData?.UAT;
      
      if (!finalUAT) {
        throw new Error('No se encontró token de usuario');
      }

      const requestBody: UpdateUserData = {
        mut_UAT: finalUAT,
        usu_Celular: userData.phone,
        usu_Mail: userData.email,
        usu_Nombre: userData.firstName,
        usu_Apellido: userData.lastName,
        usu_Domicilio: userData.address || '',
        cambia_Password_1: userData.newPassword || '',
        cambia_Password_2: userData.confirmPassword || ''
      };

      console.log('Enviando actualización de datos:', requestBody);

      const response = await api.post('/MUsuario/ActualizaDatosPersona', requestBody);
      
      if (response.data.Status === 200) {
        console.log('Datos actualizados exitosamente');
        
        // Actualizar los datos en localStorage
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address
          };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
        
        return response.data;
      } else {
        throw new Error(response.data.Mensaje || 'Error al actualizar datos');
      }
    } catch (error) {
      console.error('Error al actualizar datos de usuario:', error);
      throw error;
    }
  },

  logout: () => {
    console.log('Limpiando datos de sesión...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('USER');
    // Mantener deviceId para futuras sesiones
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  },

  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Método para obtener la respuesta completa del login (como en Flutter)
  getFullUserData: (): any | null => {
    const userData = localStorage.getItem('USER');
    return userData ? JSON.parse(userData) : null;
  }
};
