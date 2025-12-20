import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import { pushNotificationService } from '../services/pushNotificationService';
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
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribingRef = useRef(false); // 🔑 Prevenir suscripciones duplicadas

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
    console.log('🔔 Nueva notificación recibida en tiempo real:', newNotification);

    // Agregar al principio de la lista
    setNotifications((prev) => [newNotification, ...prev]);

    // Incrementar conteo de no leídas
    if (!newNotification.read) {
      setUnreadCount((prev) => prev + 1);
    }

    // Mostrar notificación del navegador si el permiso está otorgado
    if (pushNotificationService.getPermissionStatus() === 'granted') {
      pushNotificationService.showNotification({
        title: newNotification.title,
        body: newNotification.message,
        tag: `notification-${newNotification.id}`,
        data: {
          url: newNotification.location_report_id ? '/location-reports' : '/notifications',
          notificationId: newNotification.id,
        },
        requireInteraction: true,
      }).catch((err) => {
        console.error('Error mostrando notificación del navegador:', err);
      });
    }
  }, []); // ✅ Sin dependencias para evitar recreación

  // Cargar notificaciones inicialmente
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Suscribirse a Realtime
  useEffect(() => {
    if (!userId || !autoSubscribe) {
      console.log('⏭️ Omitiendo suscripción:', { userId, autoSubscribe });
      return;
    }

    // 🔒 Evitar suscripciones duplicadas con doble verificación
    if (realtimeChannelRef.current) {
      console.log('🟡 Canal ya existe, reutilizando');
      return;
    }

    if (isSubscribingRef.current) {
      console.log('🟡 Suscripción ya en proceso, esperando...');
      return;
    }

    console.log('🟢 Iniciando suscripción a Realtime notifications');
    isSubscribingRef.current = true;

    const channel = notificationService.subscribeToNotifications(
      userId,
      handleNewNotification
    );

    realtimeChannelRef.current = channel;
    isSubscribingRef.current = false;
    console.log('✅ Canal Realtime creado exitosamente');

    return () => {
      console.log('🧹 Ejecutando cleanup de Realtime');

      if (realtimeChannelRef.current) {
        const channelToClean = realtimeChannelRef.current;
        realtimeChannelRef.current = null;
        isSubscribingRef.current = false;

        // ⏰ Pequeño delay para asegurar que la conexión no se interrumpa
        setTimeout(() => {
          notificationService
            .unsubscribeFromNotifications(channelToClean)
            .then(() => {
              console.log('✅ Canal Realtime cerrado correctamente');
            })
            .catch((err) => {
              console.error('⚠️ Error cerrando canal Realtime:', err);
            });
        }, 100);
      }
    };
  }, [userId, autoSubscribe, handleNewNotification]); // ✅ NO incluir handleNewNotification

  // Auto-refresh cada 5 minutos como fallback (en caso de que Realtime falle)
  useEffect(() => {
    if (!userId) return;

    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refresh de notificaciones (fallback)');
      loadNotifications();
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      console.log('🛑 Deteniendo auto-refresh');
      clearInterval(intervalId);
    };
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