
// Función para procesar la imagen del comprobante
export const getComprobanteImageSrc = (comprobantePago: any) => {
  if (!comprobantePago) return null;
  
  // Si es un objeto con _type y value
  if (typeof comprobantePago === 'object' && comprobantePago._type === 'String' && comprobantePago.value) {
    // Verificar si ya tiene el prefijo data:image
    if (comprobantePago.value.startsWith('data:image')) {
      return comprobantePago.value;
    }
    // Si es base64 sin prefijo, agregarlo
    return `data:image/jpeg;base64,${comprobantePago.value}`;
  }
  
  // Si es una string directa
  if (typeof comprobantePago === 'string') {
    if (comprobantePago.startsWith('data:image')) {
      return comprobantePago;
    }
    return `data:image/jpeg;base64,${comprobantePago}`;
  }
  
  return null;
};

export const formatDate = (dateString: string) => {
  if (dateString === "1/1/0001 12:00:00 AM") {
    return "Sin fecha";
  }
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  } catch {
    return dateString;
  }
};
