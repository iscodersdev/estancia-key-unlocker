
import api from './api';
import { API_ENDPOINTS } from '@/config/api';
import { NotificacionesResponse, NotificacionModel } from '@/types/notificacion';

// Cache temporal por usuario (usando UAT como clave)
const notificationsCacheByUser: Record<string, NotificacionesResponse | null> = {};

// Función para obtener la clave de localStorage específica del usuario
const getStorageKey = (uat: string): string => {
  return `notificaciones_leidas_${uat}`;
};

// Función para obtener notificaciones leídas desde localStorage por usuario
const getReadNotificationsFromStorage = (uat: string): Set<number> => {
  try {
    const storageKey = getStorageKey(uat);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const readIds = JSON.parse(stored);
      return new Set(readIds);
    }
  } catch (error) {
    console.error('Error al leer notificaciones del localStorage:', error);
  }
  return new Set();
};

// Función para guardar notificaciones leídas en localStorage por usuario
const saveReadNotificationsToStorage = (uat: string, readIds: Set<number>): void => {
  try {
    const storageKey = getStorageKey(uat);
    localStorage.setItem(storageKey, JSON.stringify(Array.from(readIds)));
    console.log(`Notificaciones leídas guardadas en localStorage para usuario ${uat}:`, Array.from(readIds));
  } catch (error) {
    console.error('Error al guardar notificaciones en localStorage:', error);
  }
};

export const notificationService = {
  async getNotifications(): Promise<NotificacionesResponse> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Obteniendo notificaciones para usuario:', token);
    
    // Si tenemos cache para este usuario, lo devolvemos con el estado actualizado desde localStorage
    if (notificationsCacheByUser[token]) {
      console.log('Devolviendo notificaciones desde cache para usuario:', token);
      const readIds = getReadNotificationsFromStorage(token);
      
      // Actualizar el estado de las notificaciones con la información del localStorage de este usuario
      const updatedNotifications = notificationsCacheByUser[token]!.ListNotificaciones.map(notification => ({
        ...notification,
        Leido: readIds.has(notification.Id) || notification.Leido
      }));
      
      // Recalcular contadores
      const unreadCount = updatedNotifications.filter(n => !n.Leido).length;
      
      const updatedCache = {
        ...notificationsCacheByUser[token]!,
        ListNotificaciones: updatedNotifications,
        CantidadNotificacionesNoLeida: unreadCount,
        NotificacionNoLeida: unreadCount > 0
      };
      
      console.log(`Cache actualizado con localStorage para usuario ${token}:`, updatedCache);
      return updatedCache;
    }

    const response = await api.post(API_ENDPOINTS.NOTIFICACIONES, {
      UAT: token
    });
    
    console.log(`Respuesta de notificaciones desde API para usuario ${token}:`, response.data);
    
    // Aplicar el estado de localStorage de este usuario a las notificaciones obtenidas de la API
    const readIds = getReadNotificationsFromStorage(token);
    const updatedNotifications = response.data.ListNotificaciones.map((notification: NotificacionModel) => ({
      ...notification,
      Leido: readIds.has(notification.Id) || notification.Leido
    }));
    
    // Recalcular contadores
    const unreadCount = updatedNotifications.filter((n: NotificacionModel) => !n.Leido).length;
    
    // Guardamos en cache específico para este usuario
    notificationsCacheByUser[token] = {
      ...response.data,
      ListNotificaciones: updatedNotifications,
      CantidadNotificacionesNoLeida: unreadCount,
      NotificacionNoLeida: unreadCount > 0
    };
    
    return notificationsCacheByUser[token]!;
  },

  async markAsRead(notificationId: number, isRead: boolean = true): Promise<void> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log(`Marcando notificación ${notificationId} como ${isRead ? 'leída' : 'no leída'} para usuario ${token}`);
    
    // Obtener IDs de notificaciones leídas desde localStorage para este usuario
    const readIds = getReadNotificationsFromStorage(token);
    
    // Actualizar el estado en localStorage para este usuario
    if (isRead) {
      readIds.add(notificationId);
    } else {
      readIds.delete(notificationId);
    }
    
    // Guardar en localStorage específico para este usuario
    saveReadNotificationsToStorage(token, readIds);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Actualizar el cache local específico para este usuario
    if (notificationsCacheByUser[token]) {
      const userCache = notificationsCacheByUser[token]!;
      const notificationIndex = userCache.ListNotificaciones.findIndex(n => n.Id === notificationId);
      if (notificationIndex !== -1) {
        // Actualizar el estado de la notificación
        userCache.ListNotificaciones[notificationIndex].Leido = isRead;
        
        // Recalcular los contadores
        const unreadCount = userCache.ListNotificaciones.filter(n => !n.Leido).length;
        userCache.CantidadNotificacionesNoLeida = unreadCount;
        userCache.NotificacionNoLeida = unreadCount > 0;
        
        console.log(`Cache actualizado para usuario ${token}:`, {
          notificationId,
          isRead,
          newUnreadCount: unreadCount,
          hasUnread: unreadCount > 0
        });
      }
    }
  },

  // Método para limpiar el cache de un usuario específico
  clearCache(uat?: string): void {
    if (uat) {
      delete notificationsCacheByUser[uat];
      console.log(`Cache limpiado para usuario ${uat}`);
    } else {
      // Limpiar todo el cache si no se especifica usuario
      Object.keys(notificationsCacheByUser).forEach(key => {
        delete notificationsCacheByUser[key];
      });
      console.log('Cache completo limpiado');
    }
  },

  // Método para limpiar el localStorage de notificaciones leídas de un usuario específico
  clearStoredReadNotifications(uat?: string): void {
    try {
      if (uat) {
        const storageKey = getStorageKey(uat);
        localStorage.removeItem(storageKey);
        console.log(`Notificaciones leídas eliminadas del localStorage para usuario ${uat}`);
      } else {
        // Limpiar todas las notificaciones leídas si no se especifica usuario
        const token = localStorage.getItem('authToken');
        if (token) {
          const storageKey = getStorageKey(token);
          localStorage.removeItem(storageKey);
          console.log(`Notificaciones leídas eliminadas del localStorage para usuario actual ${token}`);
        }
      }
    } catch (error) {
      console.error('Error al limpiar notificaciones del localStorage:', error);
    }
  }
};
