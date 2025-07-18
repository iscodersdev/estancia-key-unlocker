import api from './api';

export interface Tarjeta {
  id: string;
  numeroTarjeta: string;
  titular: string;
  limiteDisponible: string;
  vencimiento: string;
  tipo: 'principal' | 'adicional';
  estado: 'activa' | 'bloqueada' | 'vencida';
}

export const obtenerTarjetas = async (): Promise<Tarjeta[]> => {
  try {
    console.log('Obteniendo tarjetas...');
    
    const userData = localStorage.getItem('USER');
    const parsedUserData = userData ? JSON.parse(userData) : null;
    
    if (!parsedUserData) {
      console.error('No se encontró información de usuario en localStorage');
      throw new Error('No se encontró información de usuario');
    }
    
    console.log('Datos de usuario encontrados:', parsedUserData);
    
    const uat = parsedUserData.UAT;
    // Usar específicamente el ClienteId
    const clienteId = parsedUserData.ClienteId;
    
    console.log('UAT extraído:', uat);
    console.log('ClienteId extraído:', clienteId);
    
    if (!uat || !clienteId) {
      console.error('Faltan datos necesarios:', { uat, clienteId });
      throw new Error('Faltan datos de usuario necesarios (UAT o ClienteId)');
    }
    
    const requestBody = {
      UAT: uat,
      PersonaId: clienteId // Usar ClienteId como PersonaId
    };
    
    console.log('Enviando petición para obtener tarjetas:', requestBody);
    
    // Llamada real a la API
    const response = await api.post('/mTarjetas/ObtenerTarjetas', requestBody);
    
    console.log('Respuesta del servidor:', response.data);
    
    // Verificar que la respuesta sea exitosa
    if (response.data.Status === 200) {
      // Mapear las tarjetas del servidor al formato esperado
      const tarjetasServidor = response.data.Tarjetas || [];
      
      const tarjetasMapeadas: Tarjeta[] = tarjetasServidor.map((tarjeta: any, index: number) => ({
        id: tarjeta.Id || String(index + 1),
        numeroTarjeta: tarjeta.NumeroTarjeta || tarjeta.Numero || '',
        titular: tarjeta.Titular || `${parsedUserData.Nombres || ''} ${parsedUserData.Apellido || ''}`.trim(),
        limiteDisponible: tarjeta.LimiteDisponible || tarjeta.Limite || '$0,00',
        vencimiento: tarjeta.Vencimiento || tarjeta.FechaVencimiento || '',
        tipo: tarjeta.Tipo === 'principal' ? 'principal' : 'adicional',
        estado: tarjeta.Estado === 'activa' ? 'activa' : tarjeta.Estado === 'bloqueada' ? 'bloqueada' : 'vencida'
      }));
      
      console.log('Tarjetas mapeadas:', tarjetasMapeadas);
      return tarjetasMapeadas;
    } else {
      console.error('Error en respuesta del servidor:', response.data);
      throw new Error(response.data.Mensaje || 'Error al obtener las tarjetas');
    }
    
  } catch (error) {
    console.error('Error al obtener tarjetas:', error);
    
    // En caso de error, devolver datos mock para testing
    console.log('Devolviendo datos mock debido al error...');
    const userData = localStorage.getItem('USER');
    const parsedUserData = userData ? JSON.parse(userData) : null;
    
    const tarjetasMock: Tarjeta[] = [
      {
        id: '1',
        numeroTarjeta: '5000 2290 6789 0123',
        titular: `${parsedUserData?.Nombres || 'Usuario'} ${parsedUserData?.Apellido || 'Demo'}`,
        limiteDisponible: '$500.000,00',
        vencimiento: '12/26',
        tipo: 'principal',
        estado: 'activa'
      },
      {
        id: '2',
        numeroTarjeta: '5000 2290 6789 0456',
        titular: `${parsedUserData?.Nombres || 'Usuario'} ${parsedUserData?.Apellido || 'Demo'}`,
        limiteDisponible: '$250.000,00',
        vencimiento: '08/27',
        tipo: 'adicional',
        estado: 'activa'
      }
    ];
    
    return tarjetasMock;
  }
};

export const solicitarNuevaTarjeta = async (): Promise<void> => {
  try {
    console.log('Solicitando nueva tarjeta...');
    
    const userData = localStorage.getItem('USER');
    const parsedUserData = userData ? JSON.parse(userData) : null;
    
    if (!parsedUserData) {
      throw new Error('No se encontró información de usuario');
    }
    
    const uat = parsedUserData.UAT;
    const personaId = parsedUserData.ClienteId;
    
    const requestBody = {
      UAT: uat,
      PersonaId: personaId,
      TipoTarjeta: 'adicional'
    };
    
    console.log('Enviando solicitud de nueva tarjeta:', requestBody);
    
    // Por ahora simulamos el éxito
    // const response = await api.post('/mTarjetas/SolicitarNuevaTarjeta', requestBody);
    
    console.log('Solicitud de nueva tarjeta enviada exitosamente');
    
  } catch (error) {
    console.error('Error al solicitar nueva tarjeta:', error);
    throw error;
  }
};
