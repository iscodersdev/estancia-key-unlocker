
import api from './api';

export interface Comprobante {
  NroTarjeta: string;
  FechaVencimiento: string;
  MontoAdeudado: string;
  FechaPagoProximaCuota: string;
  EstadoPago: number;
  EstadoPagoDescripcion: string;
  ComprobantePago: string | null;
  FechaComprobante: string;
}

// Cache específico por usuario para comprobantes
const comprobantesCache = new Map<string, { data: Comprobante[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const obtenerComprobantes = async (): Promise<Comprobante[]> => {
  try {
    console.log('Obteniendo comprobantes...');
    
    // Obtener el token UAT actual del usuario autenticado
    const currentToken = localStorage.getItem('authToken');
    if (!currentToken) {
      console.error('No se encontró token de autenticación');
      throw new Error('Usuario no autenticado');
    }
    
    // Verificar cache específico para este usuario
    const cachedData = comprobantesCache.get(currentToken);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Devolviendo comprobantes desde cache para usuario:', currentToken);
      return cachedData.data;
    }
    
    // Obtener la información completa del usuario del localStorage
    const userData = localStorage.getItem('USER');
    console.log('Datos de usuario desde localStorage:', userData);
    
    const parsedUserData = userData ? JSON.parse(userData) : null;
    console.log('Datos parseados del usuario:', parsedUserData);
    
    if (!parsedUserData) {
      console.error('No se encontró información de usuario en localStorage');
      throw new Error('No se encontró información de usuario');
    }
    
    const uat = parsedUserData.UAT;
    const personaId = parsedUserData.ClienteId;
    
    console.log('UAT encontrado:', uat);
    console.log('PersonaId (ClienteId) encontrado:', personaId);
    
    // Verificar que el UAT del usuario coincida con el token actual
    if (uat !== currentToken) {
      console.error('El UAT del usuario no coincide con el token actual');
      console.log('UAT del usuario:', uat);
      console.log('Token actual:', currentToken);
      throw new Error('Sesión inválida, por favor inicia sesión nuevamente');
    }
    
    if (!uat) {
      console.error('No se encontró el token UAT');
      throw new Error('No se encontró el token UAT');
    }
    
    if (!personaId) {
      console.error('No se encontró el ClienteId en la información del usuario');
      throw new Error('No se encontró el ClienteId en la información del usuario');
    }
    
    const requestBody = {
      UAT: uat,
      PersonaId: personaId
    };
    
    console.log('Enviando petición con body:', requestBody);
    
    // CORRECCIÓN: Cambiar de /mTarjetas/ a /MTarjetas/ para coincidir con otros endpoints
    const response = await api.post('/MTarjetas/ObtenerComprobantes', requestBody);
    
    console.log('Respuesta completa de comprobantes:', response);
    console.log('Status de respuesta:', response.status);
    console.log('Data de respuesta:', response.data);
    
    // La respuesta tiene la estructura: { ListComprobantes: [...], PersonaId, UAT, Status, Mensaje }
    if (response.data && Array.isArray(response.data.ListComprobantes)) {
      console.log('Lista de comprobantes encontrada:', response.data.ListComprobantes);
      
      // Ordenar por fecha de forma descendente (más reciente primero)
      const comprobantesOrdenados = response.data.ListComprobantes.sort((a: Comprobante, b: Comprobante) => {
        // Convertir las fechas para comparar
        const fechaA = new Date(a.FechaComprobante);
        const fechaB = new Date(b.FechaComprobante);
        
        // Si las fechas son inválidas, mover al final
        if (isNaN(fechaA.getTime()) && isNaN(fechaB.getTime())) return 0;
        if (isNaN(fechaA.getTime())) return 1;
        if (isNaN(fechaB.getTime())) return -1;
        
        // Orden descendente (más reciente primero) - corregido
        return fechaB.getTime() - fechaA.getTime();
      });
      
      console.log('Comprobantes ordenados por fecha desc:', comprobantesOrdenados);
      console.log('Primer comprobante (más reciente):', comprobantesOrdenados[0]?.FechaComprobante);
      console.log('Último comprobante (más antiguo):', comprobantesOrdenados[comprobantesOrdenados.length - 1]?.FechaComprobante);
      
      // Guardar en cache específico para este usuario
      comprobantesCache.set(currentToken, {
        data: comprobantesOrdenados,
        timestamp: Date.now()
      });
      
      return comprobantesOrdenados;
    } else {
      console.warn('Estructura de respuesta inesperada:', response.data);
      console.warn('Tipo de ListComprobantes:', typeof response.data?.ListComprobantes);
      return [];
    }
  } catch (error) {
    console.error('Error completo al obtener comprobantes:', error);
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
};

export const subirComprobante = async (archivo: File, nroTarjeta: string, monto: string): Promise<void> => {
  try {
    console.log('Subiendo comprobante...');
    
    // Obtener el token UAT actual del usuario autenticado
    const currentToken = localStorage.getItem('authToken');
    if (!currentToken) {
      throw new Error('Usuario no autenticado');
    }
    
    // Obtener la información del usuario del localStorage
    const userData = localStorage.getItem('USER');
    const parsedUserData = userData ? JSON.parse(userData) : null;
    
    if (!parsedUserData) {
      throw new Error('No se encontró información de usuario');
    }
    
    const uat = parsedUserData.UAT;
    const personaId = parsedUserData.ClienteId;
    
    // Verificar que el UAT del usuario coincida con el token actual
    if (uat !== currentToken) {
      throw new Error('Sesión inválida, por favor inicia sesión nuevamente');
    }
    
    if (!uat || !personaId) {
      throw new Error('Faltan datos de usuario necesarios');
    }

    console.log('UAT para subir comprobante:', uat);
    console.log('PersonaId para subir comprobante:', personaId);
    
    // Convertir archivo a base64
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:image/jpeg;base64," para obtener solo el base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(archivo);
    });
    
    console.log('Archivo convertido a base64, longitud:', base64String.length);
    console.log('Primeros 100 caracteres del base64:', base64String.substring(0, 100));
    
    // Obtener número de tarjeta sin espacios del usuario
    let numeroTarjetaSinEspacios = "";
    if (parsedUserData.NroTarjeta) {
      numeroTarjetaSinEspacios = parsedUserData.NroTarjeta.replace(/\s+/g, ''); // Remover espacios
    }
    
    console.log('Número de tarjeta original:', parsedUserData.NroTarjeta);
    console.log('Número de tarjeta sin espacios:', numeroTarjetaSinEspacios);
    
    // Crear el body con formato correcto
    const requestBody = {
      id: 0,
      Persona: parseInt(personaId.toString()),
      NroTarjeta: numeroTarjetaSinEspacios, // Usar número sin espacios
      ComprobantePago: base64String,
      UAT: uat.toString()
    };
    
    console.log('Enviando comprobante con body:', {
      ...requestBody,
      ComprobantePago: `[base64 string de ${base64String.length} caracteres]`
    });
    
    const response = await api.post('/MTarjetas/SubirComprobantePagoTarjeta', requestBody);
    
    console.log('Respuesta subir comprobante:', response.data);
    
    // Verificar si la respuesta es exitosa - validar tanto Status como existencia de data
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    // Verificar el status en la respuesta
    if (response.data.Status && response.data.Status !== 200) {
      throw new Error(response.data.Mensaje || 'Error al subir el comprobante');
    }
    
    // Limpiar cache de comprobantes para este usuario después de subir uno nuevo
    comprobantesCache.delete(currentToken);
    
    // Si llegamos aquí, el comprobante se subió exitosamente
    console.log('Comprobante subido exitosamente');
    
  } catch (error) {
    console.error('Error al subir comprobante:', error);
    throw error;
  }
};

// Función para limpiar cache de comprobantes de un usuario específico
export const clearComprobantesCache = (userToken: string) => {
  comprobantesCache.delete(userToken);
  console.log('Cache de comprobantes limpiado para usuario:', userToken);
};

// Función para limpiar todo el cache de comprobantes
export const clearAllComprobantesCache = () => {
  comprobantesCache.clear();
  console.log('Todo el cache de comprobantes ha sido limpiado');
};
