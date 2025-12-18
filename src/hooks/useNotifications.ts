import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

/**
 * Hook personalizado para manejar notificaciones en tiempo real
 * @param userId - ID del usuario actual
 * @param autoSubscribe - Si se debe suscribir automáticamente a Realtime
 */
export const useNotifications = (
  userId: string | null,
  autoSubscribe = true
): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // Cargar notificaciones
  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cargar notificaciones y conteo en paralelo
      const [notifs, count] = await Promise.all([
        notificationService.getNotifications(userId, 50),
        notificationService.getUnreadCount(userId),
      ]);

      setNotifications(notifs);
      setUnreadCount(count);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Refrescar notificaciones (alias de loadNotifications para API más clara)
  const refresh = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Marcar notificación como leída
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.markAsRead(notificationId);

        // Actualizar estado local
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Error marcando notificación como leída:', err);
      }
    },
    []
  );

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      await notificationService.markAllAsRead(userId);

      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marcando todas como leídas:', err);
    }
  }, [userId]);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);

      // Actualizar estado local
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        if (notification && !notification.read) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (err) {
      console.error('Error eliminando notificación:', err);
    }
  }, []);

  // Manejar nueva notificación en tiempo real
  const handleNewNotification = useCallback((newNotification: Notification) => {
    console.log('Nueva notificación recibida en tiempo real:', newNotification);

    // Agregar al principio de la lista
    setNotifications((prev) => [newNotification, ...prev]);

    // Incrementar conteo de no leídas
    if (!newNotification.read) {
      setUnreadCount((prev) => prev + 1);
    }

    // Opcional: Reproducir sonido o mostrar notificación del navegador
    // playNotificationSound();
    // showBrowserNotification(newNotification);
  }, []);

  // Cargar notificaciones inicialmente
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Suscribirse a Realtime
  useEffect(() => {
    if (!userId || !autoSubscribe) return;

    const channel = notificationService.subscribeToNotifications(
      userId,
      handleNewNotification
    );

    setRealtimeChannel(channel);

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      if (channel) {
        notificationService.unsubscribeFromNotifications(channel);
      }
    };
  }, [userId, autoSubscribe, handleNewNotification]);

  // Auto-refresh cada 5 minutos como fallback (en caso de que Realtime falle)
  useEffect(() => {
    if (!userId) return;

    const intervalId = setInterval(() => {
      console.log('Auto-refresh de notificaciones (fallback)');
      loadNotifications();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(intervalId);
  }, [userId, loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
