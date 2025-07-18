
interface PushNotificationService {
  requestPermission(): Promise<NotificationPermission>;
  showNotification(title: string, options?: NotificationOptions): void;
  isSupported(): boolean;
}

class WebPushNotificationService implements PushNotificationService {
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Las notificaciones no están soportadas en este navegador');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    // Solicitar permiso
    const permission = await Notification.requestPermission();
    console.log('Permiso de notificaciones:', permission);
    return permission;
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('No se pueden mostrar notificaciones');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      ...options
    };

    new Notification(title, defaultOptions);
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }
}

export const pushNotificationService = new WebPushNotificationService();
