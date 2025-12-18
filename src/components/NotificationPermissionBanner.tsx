import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import Button from './ui/Button';
import { pushNotificationService } from '../services/pushNotificationService';

/**
 * Banner que solicita permiso para mostrar notificaciones del navegador
 * Se muestra solo si el permiso no ha sido otorgado y el usuario no lo ha rechazado
 */
const NotificationPermissionBanner = () => {
  const [show, setShow] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    // Solo mostrar si las notificaciones están soportadas y el permiso está en "default"
    const shouldShow =
      pushNotificationService.isSupported() &&
      pushNotificationService.getPermissionStatus() === 'default' &&
      !localStorage.getItem('notification-permission-dismissed');

    setShow(shouldShow);
  }, []);

  const handleRequestPermission = async () => {
    setRequesting(true);
    try {
      const permission = await pushNotificationService.requestPermission();

      if (permission === 'granted') {
        console.log('✅ Permiso de notificaciones otorgado');
        setShow(false);

        // Mostrar notificación de bienvenida
        pushNotificationService.showNotification({
          title: '🎉 ¡Notificaciones activadas!',
          body: 'Recibirás alertas cuando alguien reporte la ubicación de tu mascota perdida.',
          requireInteraction: false,
        });
      } else {
        console.log('❌ Permiso de notificaciones denegado');
        setShow(false);
      }
    } catch (error) {
      console.error('Error solicitando permiso:', error);
    } finally {
      setRequesting(false);
    }
  };

  const handleDismiss = () => {
    // Guardar en localStorage que el usuario cerró el banner
    localStorage.setItem('notification-permission-dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-5 shadow-2xl border border-white/20">
        <div className="flex items-start gap-4">
          {/* Icono */}
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1">
              Activa las notificaciones
            </h3>
            <p className="text-sm text-white/90 mb-4">
              Recibe alertas instantáneas cuando alguien reporte la ubicación de tu mascota
              perdida, incluso si no estás usando la app.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleRequestPermission}
                disabled={requesting}
                size="sm"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                {requesting ? 'Solicitando...' : '✓ Activar notificaciones'}
              </Button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-sm text-white/80 hover:text-white transition"
              >
                Ahora no
              </button>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/60 hover:text-white transition"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
