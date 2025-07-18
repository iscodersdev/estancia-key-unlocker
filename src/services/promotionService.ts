
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { PromocionModel, SolicitarPromocionRequest, PromocionSolicitadaResponse, Promotion } from '@/types/promocion';

// UAT genérico para contenido público (promociones)
const GENERIC_UAT = "0IC2Pulv1eqG8489K4vq50NQ06mPa1k3";

export class PromocionService {
  
  static async getPromociones(): Promise<PromocionModel[]> {
    try {
      // Obtener la UAT del usuario logueado o usar la genérica
      const userToken = localStorage.getItem('authToken');
      const uat = userToken || GENERIC_UAT;
      
      console.log('Obteniendo promociones con UAT:', userToken ? 'usuario logueado' : 'UAT genérica');
      
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.PROMOCIONES}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({
          UAT: uat
        })
      });
      
      const data = await response.json();
      console.log('Respuesta promociones:', data);
      
      if (data.Status === 200) {
        const promociones: PromocionModel[] = [];
        data.Promociones?.forEach((element: any) => {
          if (element.Id != null) {
            // Procesar imagen base64 como en Flutter
            let imagenProcesada = null;
            if (element.Imagen != null && element.Imagen.length > 23) {
              // Si la imagen ya tiene el prefijo data:image, la usamos directamente
              if (element.Imagen.startsWith('data:image')) {
                imagenProcesada = element.Imagen;
              } else {
                // Si no, añadimos el prefijo
                imagenProcesada = `data:image/jpeg;base64,${element.Imagen}`;
              }
            }

            promociones.push({
              Id: element.Id,
              Titulo: element.Titulo || element.Descripcion,
              Descripcion: element.Detalle || element.Subtitulo,
              Imagen: imagenProcesada,
              QR: element.QR,
              Link: element.Link,
              PromocionFija: element.PromocionFija || false,
              FechaInicio: element.Fecha,
              FechaFin: element.FechaFin,
              Activa: element.Activa !== false
            });
          }
        });
        return promociones;
      }
      
      throw new Error(data.Mensaje || 'Error al obtener promociones');
    } catch (error) {
      console.error('Error en getPromociones:', error);
      throw error;
    }
  }

  static async solicitarPromocion(uat: string, promocionId: number): Promise<PromocionSolicitadaResponse> {
    try {
      // Usar el UAT del usuario logueado
      const userToken = localStorage.getItem('authToken');
      const finalUat = userToken || uat;
      
      console.log('Solicitando promoción con UAT del usuario logueado');
      
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.SOLICITAR_PROMOCION}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({
          UAT: finalUat,
          PromocionId: promocionId
        })
      });
      
      const data = await response.json();
      localStorage.setItem('PromocionSolicitada', JSON.stringify(data));
      
      return {
        ...data,
        success: data.Status === 200,
        message: data.Mensaje
      };
    } catch (error) {
      console.error('Error en solicitarPromocion:', error);
      throw error;
    }
  }
}

// Export compatibility layer
export const promotionService = {
  getPromotions: PromocionService.getPromociones,
  requestPromotionQR: PromocionService.solicitarPromocion
};

export type { Promotion };
