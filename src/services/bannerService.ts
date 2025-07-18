
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';

export interface BannerModel {
  Id: number;
  Titulo?: string;
  Descripcion?: string;
  Imagen: string | null;
  Link?: string | null;
  Activa: boolean;
  Orden?: number;
}

export interface BannersResponse {
  Status: number;
  Mensaje: string | null;
  Banners: any[];
}

// UAT genérico para contenido público (banners)
const GENERIC_UAT = "0IC2Pulv1eqG8489K4vq50NQ06mPa1k3";

export class BannerService {
  static async getBanners(): Promise<BannerModel[]> {
    try {
      // Obtener la UAT del usuario logueado o usar la genérica
      const userToken = localStorage.getItem('authToken');
      const uat = userToken || GENERIC_UAT;
      
      console.log('Obteniendo banners con UAT:', userToken ? 'usuario logueado' : 'UAT genérica');
      
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.BANNERS}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({
          UAT: uat
        })
      });
      
      const data: BannersResponse = await response.json();
      console.log('Respuesta banners completa:', data);
      console.log('Array de banners:', data.Banners);
      console.log('Cantidad de banners:', data.Banners?.length);
      
      if (data.Status === 200 && data.Banners) {
        const banners: BannerModel[] = [];
        
        data.Banners.forEach((element: any, index: number) => {
          console.log(`Procesando banner ${index}:`, element);
          
          if (element.Id != null) {
            // Procesar imagen base64
            let imagenProcesada = null;
            if (element.Imagen != null) {
              // Si la imagen es un objeto con _type y value, extraer el value
              if (typeof element.Imagen === 'object' && element.Imagen.value) {
                const imagenBase64 = element.Imagen.value;
                if (imagenBase64.length > 23) {
                  imagenProcesada = imagenBase64.startsWith('data:image') 
                    ? imagenBase64 
                    : `data:image/jpeg;base64,${imagenBase64}`;
                }
              } 
              // Si es un string directo
              else if (typeof element.Imagen === 'string' && element.Imagen.length > 23) {
                imagenProcesada = element.Imagen.startsWith('data:image') 
                  ? element.Imagen 
                  : `data:image/jpeg;base64,${element.Imagen}`;
              }
            }

            const banner: BannerModel = {
              Id: element.Id,
              Titulo: element.Titulo || element.Descripcion || 'Banner',
              Descripcion: element.Detalle || element.Subtitulo || element.Texto,
              Imagen: imagenProcesada,
              Link: element.Link,
              Activa: element.Activa !== false, // Por defecto true si no se especifica
              Orden: element.Orden || 0
            };

            console.log(`Banner procesado ${index}:`, banner);
            banners.push(banner);
          }
        });
        
        console.log('Total banners procesados:', banners.length);
        const bannersOrdenados = banners.sort((a, b) => (a.Orden || 0) - (b.Orden || 0));
        console.log('Banners ordenados:', bannersOrdenados);
        
        return bannersOrdenados;
      }
      
      throw new Error(data.Mensaje || 'Error al obtener banners');
    } catch (error) {
      console.error('Error en getBanners:', error);
      throw error;
    }
  }
}
