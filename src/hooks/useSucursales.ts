import { useState, useEffect } from 'react';
import api from '@/services/api';

interface SucursalResponse {
  id: number;
  name: string;
  address: string;
  latitud: number;
  longitud: number;
  phone?: string;
}

interface Sucursal {
  id: number;
  name: string;
  address: string;
  coordinates: [number, number];
  phone: string;
  hours: string;
}

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Horarios predefinidos por tipo de local
  const getHorariosByName = (name: string): string => {
    // Shopping centers suelen tener horarios extendidos
    const shoppings = ['shopping', 'mall', 'portal', 'plaza', 'paseo'];
    const isShoppingCenter = shoppings.some(keyword => 
      name.toLowerCase().includes(keyword)
    );
    
    if (isShoppingCenter) {
      return "Lun a Dom: 10:00 - 22:00";
    } else {
      return "Lun a Vie: 9:00 - 18:00, Sáb: 9:00 - 13:00";
    }
  };

  // Teléfonos predefinidos por zona
  const getPhoneByLocation = (address: string): string => {
    if (address.toLowerCase().includes('caba') || address.toLowerCase().includes('capital')) {
      return "+54 11 4000-0000";
    } else if (address.toLowerCase().includes('buenos aires')) {
      return "+54 11 5000-0000";
    } else if (address.toLowerCase().includes('córdoba')) {
      return "+54 351 600-0000";
    } else if (address.toLowerCase().includes('mendoza')) {
      return "+54 261 700-0000";
    } else if (address.toLowerCase().includes('tucumán')) {
      return "+54 381 800-0000";
    } else if (address.toLowerCase().includes('santa fe')) {
      return "+54 341 900-0000";
    } else {
      return "+54 11 0000-0000";
    }
  };

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching sucursales with UAT:', localStorage.getItem('authToken'));
        
        const response = await api.post('/MUsuario/TraeSucursales', {
          UAT: localStorage.getItem('authToken') || ''
        });

        console.log('API Response:', response);
        console.log('Response data:', response.data);
        console.log('Response data type:', typeof response.data);
        console.log('Is array:', Array.isArray(response.data));

        // Verificar diferentes estructuras posibles de respuesta
        let sucursalesData = null;
        
        if (Array.isArray(response.data)) {
          sucursalesData = response.data;
        } else if (response.data && response.data.Status === 200) {
          // Buscar el array de sucursales en diferentes campos posibles
          if (Array.isArray(response.data.Sucursales)) {
            sucursalesData = response.data.Sucursales;
          } else if (Array.isArray(response.data.Data)) {
            sucursalesData = response.data.Data;
          } else if (Array.isArray(response.data.sucursales)) {
            sucursalesData = response.data.sucursales;
          } else if (Array.isArray(response.data.data)) {
            sucursalesData = response.data.data;
          }
        }

        console.log('Extracted sucursales data:', sucursalesData);

        if (sucursalesData && sucursalesData.length > 0) {
          console.log('Sample sucursal object:', sucursalesData[0]);
          
          const mappedSucursales: Sucursal[] = sucursalesData.map((sucursal: any, index: number) => {
            console.log(`Mapping sucursal ${index}:`, sucursal);
            
            return {
              id: sucursal.id || sucursal.Id || index + 1,
              name: sucursal.name || sucursal.Name || sucursal.nombre || sucursal.Nombre || `Sucursal ${index + 1}`,
              address: sucursal.address || sucursal.Address || sucursal.direccion || sucursal.Direccion || 'Dirección no disponible',
              coordinates: [
                sucursal.longitud || sucursal.Longitud || sucursal.longitude || sucursal.Longitude || -58.3816,
                sucursal.latitud || sucursal.Latitud || sucursal.latitude || sucursal.Latitude || -34.6037
              ] as [number, number],
              phone: sucursal.phone || sucursal.Phone || sucursal.telefono || sucursal.Telefono || getPhoneByLocation(sucursal.address || sucursal.Address || sucursal.direccion || sucursal.Direccion || ''),
              hours: getHorariosByName(sucursal.name || sucursal.Name || sucursal.nombre || sucursal.Nombre || '')
            };
          });

          console.log('Mapped sucursales:', mappedSucursales);
          setSucursales(mappedSucursales);
        } else {
          console.log('No sucursales data found, using empty array');
          setSucursales([]);
        }
      } catch (err) {
        console.error('Error fetching sucursales:', err);
        setError('Error al cargar las sucursales');
        setSucursales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSucursales();
  }, []);

  return { sucursales, loading, error };
};