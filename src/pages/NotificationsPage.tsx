import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, Filter, MapPin, ExternalLink } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuthContext } from '../context/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import Button from '../components/ui/Button';
import { Notification } from '../types';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationsPage = () => {
  const { user } = useAuthContext();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(user?.id || null, true);

  // Filtrar notificaciones
  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  // Agrupar notificaciones por fecha
  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.created_at);
      let key = 'older';

      if (isToday(date)) {
        key = 'today';
      } else if (isYesterday(date)) {
        key = 'yesterday';
      } else if (isThisWeek(date)) {
        key = 'thisWeek';
      }

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(notification);
      return groups;
    },
    {} as Record<string, Notification[]>
  );

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

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const handleBulkMarkAsRead = async () => {
    const promises = Array.from(selectedIds).map((id) => markAsRead(id));
    await Promise.all(promises);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (!confirm(`¿Eliminar ${selectedIds.size} notificaciones?`)) {
      return;
    }

    const promises = Array.from(selectedIds).map((id) => deleteNotification(id));
    await Promise.all(promises);
    setSelectedIds(new Set());
  };

  const groupLabels = {
    today: 'Hoy',
    yesterday: 'Ayer',
    thisWeek: 'Esta semana',
    older: 'Más antiguas',
  };

  if (loading && notifications.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Notificaciones
            </h1>
            <Link to="/dashboard">
              <Button variant="outline">← Volver al Dashboard</Button>
            </Link>
          </div>

          {/* Filtros y acciones */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                No leídas ({unreadCount})
              </button>
            </div>

            {/* Acciones bulk */}
            {selectedIds.size > 0 && (
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkMarkAsRead}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Marcar como leídas ({selectedIds.size})
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar ({selectedIds.size})
                </Button>
              </div>
            )}

            {/* Marcar todas como leídas */}
            {unreadCount > 0 && selectedIds.size === 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                className="ml-auto flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Seleccionar todas */}
          {filteredNotifications.length > 0 && (
            <div className="mt-3">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {selectedIds.size === filteredNotifications.length
                  ? 'Deseleccionar todas'
                  : 'Seleccionar todas'}
              </button>
            </div>
          )}
        </div>

        {/* Lista de notificaciones agrupadas */}
        {filteredNotifications.length === 0 ? (
          <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Bell className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              No hay notificaciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'unread'
                ? 'No tienes notificaciones sin leer'
                : 'Aún no tienes notificaciones'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupLabels).map(([key, label]) => {
              const group = groupedNotifications[key];
              if (!group || group.length === 0) return null;

              return (
                <div key={key}>
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {label}
                  </h2>
                  <div className="space-y-2">
                    {group.map((notification) => (
                      <div
                        key={notification.id}
                        className={`rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md ${
                          !notification.read
                            ? 'border-l-4 border-l-blue-600 dark:border-l-blue-400'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedIds.has(notification.id)}
                            onChange={() => handleSelectNotification(notification.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />

                          {/* Icono */}
                          <div className="flex-shrink-0">
                            {notification.type === 'location_report' ? (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                  {notification.title}
                                </h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">
                                  {notification.message}
                                </p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                  {formatRelativeTime(notification.created_at)}
                                </p>

                                {/* Link al reporte */}
                                {notification.location_report_id && (
                                  <Link
                                    to="/location-reports"
                                    className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Ver reporte completo
                                  </Link>
                                )}
                              </div>

                              {/* Indicador no leída */}
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="mt-3 flex gap-2">
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAsRead(notification.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Check className="h-3 w-3" />
                                  Marcar como leída
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="flex items-center gap-1 text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
