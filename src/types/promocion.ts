
export interface PromocionModel {
  Id: number;
  Titulo: string;
  Descripcion: string;
  Imagen: string | null;
  QR: string | null;
  Link: string | null;
  PromocionFija: boolean;
  FechaInicio: string;
  FechaFin: string;
  Activa: boolean;
}

export interface SolicitarPromocionRequest {
  UAT: string;
  PromocionId: number;
}

export interface PromocionSolicitadaResponse {
  Status: number;
  Mensaje: string | null;
  QR: string | null;
  success?: boolean;
  message?: string;
}

// Export the type as Promotion for compatibility
export type Promotion = PromocionModel;
