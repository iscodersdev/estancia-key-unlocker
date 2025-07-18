
import { useMovimientos } from '@/hooks/useMovimientos';

export const usePaymentData = () => {
  // Obtener datos del usuario del localStorage
  const userData = localStorage.getItem('USER');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const numeroTarjetaReal = parsedUserData?.NroTarjeta || '0000000500022911';
  
  // Obtener el monto adeudado de la API
  const { datosTarjeta } = useMovimientos(numeroTarjetaReal);

  // Función para formatear el monto
  const formatearMonto = (monto: string | undefined) => {
    if (!monto) return '$0,00';
    
    // Si ya tiene formato de pesos, devolverlo tal como está
    if (monto.includes('$')) return monto;
    
    // Convertir a número y formatear
    const numero = parseFloat(monto);
    if (isNaN(numero)) return '$0,00';
    
    return `$${numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Función corregida para formatear la fecha de vencimiento usando FechaPagoProximaCuota
  const formatearFechaVencimiento = (fechaPagoProximaCuota: string | undefined) => {
    console.log('FechaPagoProximaCuota recibida:', fechaPagoProximaCuota);
    
    if (!fechaPagoProximaCuota) return 'Sin vencimiento';
    
    // Si es la fecha por defecto de .NET, mostrar sin vencimiento
    if (fechaPagoProximaCuota === "1/1/0001 12:00:00 AM" || fechaPagoProximaCuota === "0001-01-01T00:00:00") {
      return 'Sin vencimiento';
    }
    
    try {
      let fecha: Date;
      
      // Si contiene "/", probablemente es formato DD/MM/YYYY (formato argentino)
      if (fechaPagoProximaCuota.includes('/')) {
        const partes = fechaPagoProximaCuota.split(' ')[0].split('/'); // Tomar solo la parte de la fecha
        if (partes.length >= 3) {
          // Formato DD/MM/YYYY (formato argentino)
          const dia = parseInt(partes[0]);
          const mes = parseInt(partes[1]) - 1; // Los meses en Date van de 0-11
          const año = parseInt(partes[2]);
          
          console.log('Parseando fecha argentina - Día:', dia, 'Mes:', mes + 1, 'Año:', año);
          fecha = new Date(año, mes, dia);
        } else {
          return 'Sin vencimiento';
        }
      } else {
        // Intentar parsear como fecha ISO
        fecha = new Date(fechaPagoProximaCuota);
      }
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        console.log('Fecha inválida después del parsing');
        return 'Sin vencimiento';
      }
      
      console.log('Fecha parseada correctamente:', fecha);
      
      // Formatear la fecha
      const fechaFormateada = fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      return `Vencimiento: ${fechaFormateada}`;
      
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Sin vencimiento';
    }
  };

  return {
    datosTarjeta,
    formatearMonto,
    formatearFechaVencimiento
  };
};
