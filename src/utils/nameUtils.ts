
export interface ParsedName {
  firstName: string;
  lastName: string;
}

/**
 * Parsea un nombre completo que viene en formato "APELLIDO1,APELLIDO2 NOMBRE1 NOMBRE2"
 * o "APELLIDO,NOMBRESSINESPACIO"
 * @param fullName - Nombre completo concatenado
 * @returns Objeto con firstName y lastName separados
 */
export const parseFullName = (fullName: string): ParsedName => {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', lastName: '' };
  }

  // Limpiar el nombre completo
  const cleanName = fullName.trim();
  
  // Verificar si contiene coma (separador entre apellidos y nombres)
  if (cleanName.includes(',')) {
    const [lastNamePart, firstNamePart] = cleanName.split(',');
    
    // Si la parte del nombre no tiene espacios, probablemente está todo junto
    // Ejemplo: "GODOY,BARRALESMATIASHERNAN" -> necesitamos separar mejor
    let processedFirstName = firstNamePart ? firstNamePart.trim() : '';
    let processedLastName = lastNamePart.trim();
    
    // Si el firstName parece estar todo junto sin espacios y es muy largo
    // intentamos hacer una separación más inteligente
    if (processedFirstName && processedFirstName.length > 10 && !processedFirstName.includes(' ')) {
      // Buscar patrones comunes de apellidos al inicio
      const commonLastNames = ['BARRALES', 'MARTINEZ', 'RODRIGUEZ', 'GONZALEZ', 'FERNANDEZ', 'GARCIA', 'LOPEZ', 'PEREZ'];
      
      for (const lastName of commonLastNames) {
        if (processedFirstName.startsWith(lastName)) {
          processedLastName = `${processedLastName} ${lastName}`;
          processedFirstName = processedFirstName.substring(lastName.length);
          break;
        }
      }
      
      // Si aún está muy junto, intentar separar por longitud aproximada
      // Asumir que después del apellido principal hay otro apellido corto
      if (processedFirstName.length > 8 && !processedFirstName.includes(' ')) {
        // Buscar un punto de separación lógico (después de 6-8 caracteres)
        const possibleSeparation = Math.min(8, Math.floor(processedFirstName.length / 2));
        const possibleLastName = processedFirstName.substring(0, possibleSeparation);
        const possibleFirstName = processedFirstName.substring(possibleSeparation);
        
        processedLastName = `${processedLastName} ${possibleLastName}`;
        processedFirstName = possibleFirstName;
      }
    }
    
    return {
      lastName: processedLastName,
      firstName: processedFirstName
    };
  }
  
  // Si no hay coma, asumir que todo es un nombre o manejar como se pueda
  const parts = cleanName.split(' ').filter(part => part.length > 0);
  
  if (parts.length <= 1) {
    return {
      firstName: cleanName,
      lastName: ''
    };
  }
  
  // Asumir que la primera mitad son apellidos y la segunda nombres
  const midPoint = Math.ceil(parts.length / 2);
  const lastNames = parts.slice(0, midPoint).join(' ');
  const firstNames = parts.slice(midPoint).join(' ');
  
  return {
    lastName: lastNames,
    firstName: firstNames
  };
};
