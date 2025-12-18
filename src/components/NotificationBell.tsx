import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationBellProps {
  userId: string;
}

const NotificationBell = ({ userId }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userId, true);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    // Marcar como leída
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Cerrar dropdown
    setIsOpen(false);

    // Navegar al reporte (si tiene location_report_id)
    if (notification.location_report_id) {
      // La navegación se hace con el Link component
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const formatRelativeTime = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return 'hace un momento';
    }
  };

  // Mostrar solo las últimas 5 notificaciones en el dropdown
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="h-6 w-6" />

        {/* Badge con número de no leídas */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-slideDown">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Notificaciones
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  No hay notificaciones
                </p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`border-b border-gray-100 dark:border-gray-700 p-4 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icono */}
                    <div className="flex-shrink-0">
                      {notification.type === 'location_report' ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(notification.created_at)}
                          </p>
                        </div>

                        {/* Indicador de no leída */}
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="Eliminar notificación"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Link al reporte */}
                  {notification.location_report_id && (
                    <Link
                      to="/location-reports"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver reporte completo
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Ver todas las notificaciones →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Estilos para la animación */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
