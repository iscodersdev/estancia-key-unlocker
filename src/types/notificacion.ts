
export interface NotificacionModel {
  Id: number;
  Fecha: string;
  Titulo: string;
  Texto: string;
  Leido: boolean;
  FechaLeido: string;
}

export interface NotificacionesResponse {
  ListNotificaciones: NotificacionModel[];
  CantidadNotificaciones: number;
  CantidadNotificacionesNoLeida: number;
  NotificacionNoLeida: boolean;
  UAT: string;
  Status: number;
  Mensaje: string;
}
