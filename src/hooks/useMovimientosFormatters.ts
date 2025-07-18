
export const useMovimientosFormatters = () => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    
    try {
      if (dateString.includes('/')) {
        return dateString;
      }
      
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-AR');
      }
      
      return dateString;
    } catch {
      return dateString;
    }
  };

  const formatMonto = (monto: string) => {
    if (typeof monto === 'string' && monto.includes('$')) {
      return monto;
    }
    
    if (typeof monto === 'string') {
      const numeroLimpio = parseFloat(monto.replace(',', '.'));
      if (!isNaN(numeroLimpio)) {
        return `$${numeroLimpio.toLocaleString('es-AR')}`;
      }
    }
    
    return monto;
  };

  return { formatDate, formatMonto };
};
