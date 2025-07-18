
import api from './api';

export interface Movimiento {
  id: string;
  fecha: string;
  descripcion: string;
  monto: string;
  tipo: 'debito' | 'credito';
  comercio?: string;
}

export interface DatosTarjeta {
  nroTarjeta: number;
  nombre: string;
  direccion: string;
  montoDisponible: string;
  montoAdeudado: string;
  telefono: string;
  proximaFechaPago?: string;
  fechaPagoProximaCuota?: string; // Nuevo campo para la fecha de vencimiento
  fechaVencimiento?: string; // Comentado para futura implementación
}

export interface RespuestaMovimientos {
  movimientos: Movimiento[];
  datosTarjeta: DatosTarjeta;
}

// Función para parsear y formatear montos de manera robusta
const formatearMonto = (valor: any, defaultValue: string = '0,00'): string => {
  console.log('Valor recibido para formatear:', valor, 'Tipo:', typeof valor);
  
  if (valor === null || valor === undefined || valor === '') {
    console.log('Valor nulo/undefined/vacío, usando valor por defecto');
    return `$${defaultValue}`;
  }
  
  let numeroLimpio: number;
  
  if (typeof valor === 'string') {
    // Remover caracteres no numéricos excepto punto y coma
    const soloNumeros = valor.replace(/[^\d.,]/g, '');
    console.log('String limpia:', soloNumeros);
    
    // Reemplazar coma por punto para parsing
    const conPunto = soloNumeros.replace(',', '.');
    numeroLimpio = parseFloat(conPunto);
  } else if (typeof valor === 'number') {
    numeroLimpio = valor;
  } else {
    console.log('Tipo de dato no reconocido, usando valor por defecto');
    return `$${defaultValue}`;
  }
  
  console.log('Número parseado:', numeroLimpio);
  
  if (isNaN(numeroLimpio)) {
    console.log('Resultado es NaN, usando valor por defecto');
    return `$${defaultValue}`;
  }
  
  // Formatear con separadores de miles argentinos
  const montoFormateado = numeroLimpio.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  console.log('Monto formateado final:', `$${montoFormateado},00`);
  return `$${montoFormateado},00`;
};

export const obtenerMovimientos = async (nroTarjeta: string): Promise<RespuestaMovimientos> => {
  try {
    console.log('Obteniendo movimientos para tarjeta:', nroTarjeta);
    
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
    
    const requestBody = {
      UAT: uat,
      CantMovimientos: 100,
      tipomovimiento: 0,
      NroTarjeta: nroTarjeta
    };
    
    console.log('Enviando petición para obtener movimientos:', requestBody);
    
    const response = await api.post('/mTarjetas/MovimientoTarjeta', requestBody);
    
    console.log('Respuesta completa de movimientos:', response.data);
    console.log('MontoDisponible raw de la API:', response.data.MontoDisponible);
    console.log('Tipo de MontoDisponible:', typeof response.data.MontoDisponible);
    console.log('MontoAdeudado raw de la API:', response.data.MontoAdeudado);
    console.log('Tipo de MontoAdeudado:', typeof response.data.MontoAdeudado);
    console.log('FechaPagoProximaCuota raw de la API:', response.data.FechaPagoProximaCuota);
    
    if (response.data.Status === 200) {
      const movimientosServidor = response.data.MovimientosTarjeta || [];
      
      const movimientosMapeados: Movimiento[] = movimientosServidor.map((mov: any, index: number) => ({
        id: mov.Id || String(index + 1),
        fecha: mov.Fecha || mov.FechaMovimiento || '',
        descripcion: mov.Descripcion || mov.Concepto || 'Movimiento',
        monto: mov.Monto || mov.Importe || '$0,00',
        tipo: mov.Tipo === 'credito' || mov.Monto?.includes('+') ? 'credito' : 'debito',
        comercio: mov.Comercio || mov.Establecimiento || ''
      }));

      // Usar la nueva función para formatear el monto disponible
      const montoDisponible = formatearMonto(response.data.MontoDisponible, '500.000');

      const datosTarjeta: DatosTarjeta = {
        nroTarjeta: response.data.NroTarjeta,
        nombre: response.data.Nombre || 'Usuario',
        direccion: response.data.Direccion || '',
        montoDisponible: montoDisponible,
        montoAdeudado: response.data.MontoAdeudado || '0,0', // Usar MontoAdeudado en lugar de TotalProximaCuota
        telefono: response.data.Telefono || '',
        proximaFechaPago: response.data.ProximaFechaPago,
        fechaPagoProximaCuota: response.data.FechaPagoProximaCuota, // Agregar el nuevo campo
        // fechaVencimiento: response.data.FechaVencimiento // Para futura implementación
      };
      
      console.log('Movimientos mapeados:', movimientosMapeados);
      console.log('Datos de tarjeta con MontoAdeudado correcto:', datosTarjeta);
      
      return {
        movimientos: movimientosMapeados,
        datosTarjeta: datosTarjeta
      };
    } else {
      console.error('Error en respuesta del servidor:', response.data);
      throw new Error(response.data.Mensaje || 'Error al obtener movimientos');
    }
    
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    
    // En caso de error, devolver datos vacíos con valores seguros
    return {
      movimientos: [],
      datosTarjeta: {
        nroTarjeta: parseInt(nroTarjeta) || 0,
        nombre: 'Usuario',
        direccion: '',
        montoDisponible: '$500.000,00',
        montoAdeudado: '0,0',
        telefono: '',
        proximaFechaPago: undefined,
        fechaPagoProximaCuota: undefined
      }
    };
  }
};
