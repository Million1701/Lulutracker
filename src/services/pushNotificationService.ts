/**
 * Servicio para manejar notificaciones push del navegador
 * Usa la API de Notifications para mostrar notificaciones cuando el navegador está abierto
 * o en segundo plano (pero no cuando está completamente cerrado)
 */

export interface BrowserNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

export const pushNotificationService = {
  /**
   * Verifica si el navegador soporta notificaciones
   */
  isSupported(): boolean {
    return 'Notification' in window;
  },

  /**
   * Obtiene el estado actual del permiso de notificaciones
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  },

  /**
   * Solicita permiso para mostrar notificaciones
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Las notificaciones no están soportadas en este navegador');
    }

    // Si ya está otorgado o denegado, retornar el estado actual
    if (Notification.permission !== 'default') {
      return Notification.permission;
    }

    // Solicitar permiso
    const permission = await Notification.requestPermission();

    console.log('🔔 Permiso de notificaciones:', permission);

    return permission;
  },

  /**
   * Muestra una notificación del navegador
   */
  async showNotification(options: BrowserNotificationOptions): Promise<void> {
    // Verificar permiso
    if (Notification.permission !== 'granted') {
      console.warn('No se puede mostrar notificación: permiso no otorgado');
      return;
    }

    // Crear notificación
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon, // El navegador usará su icono por defecto si no se especifica
      tag: options.tag,
      data: options.data,
      requireInteraction: options.requireInteraction || false,
    });

    // Manejar click en la notificación
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();

      // Si hay datos con URL, navegar a esa página
      if (options.data?.url) {
        window.location.href = options.data.url;
      }

      notification.close();
    };

    console.log('🔔 Notificación mostrada:', options.title);
  },

  /**
   * Muestra una notificación de reporte de ubicación
   */
  async showLocationReportNotification(
    petName: string,
    address: string | null,
    reportId: string
  ): Promise<void> {
    const addressText = address || 'Ubicación desconocida';

    await this.showNotification({
      title: `📍 Nueva ubicación de ${petName}`,
      body: `Alguien ha reportado ver a ${petName} en: ${addressText}`,
      tag: `location-report-${reportId}`,
      data: {
        url: '/location-reports',
        reportId,
      },
      requireInteraction: true, // Requiere que el usuario cierre la notificación
    });
  },

  /**
   * Verifica si necesitamos solicitar permiso y lo hace si es necesario
   */
  async ensurePermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    const currentPermission = this.getPermissionStatus();

    if (currentPermission === 'granted') {
      return true;
    }

    if (currentPermission === 'denied') {
      return false;
    }

    // Solicitar permiso
    const permission = await this.requestPermission();
    return permission === 'granted';
  },
};
