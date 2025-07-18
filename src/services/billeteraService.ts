
import api from './api';

export interface MovimientoBilletera {
  Id: number;
  Fecha: string;
  Descripcion: string;
  Monto: number;
  Tipo: string;
}

export interface RespuestaMovimientosBilletera {
  Status: number;
  Movimientos: MovimientoBilletera[];
}

export const obtenerMovimientosBilletera = async (nroTarjeta?: string): Promise<MovimientoBilletera[]> => {
  try {
    console.log('Obteniendo movimientos de tarjeta para:', nroTarjeta);
    
    const userData = localStorage.getItem('USER');
    const parsedUserData = userData ? JSON.parse(userData) : null;
    
    if (!parsedUserData) {
      console.error('No se encontró información de usuario en localStorage');
      throw new Error('No se encontró información de usuario');
    }
    
    const uat = parsedUserData.UAT;
    
    if (!uat) {
      console.error('No se encontró UAT');
      throw new Error('No se encontró token de sesión');
    }

    if (!nroTarjeta) {
      console.error('No se proporcionó número de tarjeta');
      throw new Error('Número de tarjeta requerido');
    }
    
    const requestBody = {
      UAT: uat,
      CantMovimientos: 100,
      tipomovimiento: 0,
      NroTarjeta: nroTarjeta
    };
    
    console.log('Enviando petición para obtener movimientos de tarjeta:', requestBody);
    
    const response = await api.post('/mtarjetas/MovimientoTarjeta', requestBody);
    
    console.log('Respuesta de movimientos de tarjeta:', response.data);
    
    if (response.data.Status === 200) {
      const movimientosServidor = response.data.MovimientosTarjeta || [];
      
      // Mapear los movimientos al formato esperado
      const movimientosMapeados: MovimientoBilletera[] = movimientosServidor.map((mov: any, index: number) => ({
        Id: mov.Id || index + 1,
        Fecha: mov.Fecha || mov.FechaMovimiento || '',
        Descripcion: mov.Descripcion || mov.Concepto || 'Movimiento',
        Monto: Math.abs(Number(mov.Monto) || Number(mov.Importe) || 0),
        Tipo: mov.Tipo === 'credito' || (mov.Monto && mov.Monto > 0) ? 'Ingreso' : 'Egreso'
      }));

      console.log('Movimientos mapeados:', movimientosMapeados);
      
      return movimientosMapeados;
    } else {
      console.error('Error en respuesta del servidor:', response.data);
      throw new Error(response.data.Mensaje || 'Error al obtener movimientos de tarjeta');
    }
    
  } catch (error) {
    console.error('Error al obtener movimientos de tarjeta:', error);
    return [];
  }
};
