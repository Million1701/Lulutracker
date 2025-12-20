import { supabase } from '../lib/supabase';
import { Notification, CreateNotificationData } from '../types';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Servicio para manejar notificaciones en tiempo real
 */
export const notificationService = {
  /**
   * Obtener el conteo de notificaciones no leídas
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error obteniendo conteo de no leídas:', error);
      return 0;
    }

    return count || 0;
  },

  /**
   * Obtener todas las notificaciones de un usuario
   * @param userId - ID del usuario
   * @param limit - Número máximo de notificaciones a retornar
   * @param onlyUnread - Si solo se deben obtener las no leídas
   */
  async getNotifications(
    userId: string,
    limit = 50,
    onlyUnread = false
  ): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (onlyUnread) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error obteniendo notificaciones:', error);
      throw new Error('No se pudieron cargar las notificaciones');
    }

    return data || [];
  },

  /**
   * Marcar una notificación como leída
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marcando notificación como leída:', error);
      throw new Error('No se pudo marcar la notificación como leída');
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select();

    if (error) {
      console.error('Error marcando todas como leídas:', error);
      throw new Error('No se pudieron marcar todas las notificaciones como leídas');
    }

    return data?.length || 0;
  },

  /**
   * Eliminar una notificación
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error eliminando notificación:', error);
      throw new Error('No se pudo eliminar la notificación');
    }
  },

  /**
   * Eliminar todas las notificaciones leídas de un usuario
   */
  async deleteAllRead(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('read', true)
      .select();

    if (error) {
      console.error('Error eliminando notificaciones leídas:', error);
      throw new Error('No se pudieron eliminar las notificaciones');
    }

    return data?.length || 0;
  },

  /**
   * Crear una notificación manualmente (normalmente se crean por triggers)
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error creando notificación:', error);
      throw new Error('No se pudo crear la notificación');
    }

    return notification;
  },

  /**
   * Suscribirse a nuevas notificaciones en tiempo real usando Supabase Realtime
   * @param userId - ID del usuario
   * @param callback - Función que se ejecuta cuando llega una nueva notificación
   * @returns Canal de Realtime para poder hacer cleanup después
   */
  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): RealtimeChannel {
    // 🔑 Nombre único del canal por usuario
    const channelName = `notifications-${userId}-${Date.now()}`;

    console.log(`📡 Creando canal: ${channelName}`);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('📨 Realtime payload:', payload);
          callback(payload.new as Notification);
        }
      )
      .subscribe((status, err) => {
        console.log(`📡 Estado realtime [${channelName}]:`, status);

        if (status === 'SUBSCRIBED') {
          console.log(`✅ Realtime activo en canal ${channelName}`);
        }

        if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error realtime en canal ${channelName}:`, err);
        }

        if (status === 'TIMED_OUT') {
          console.error(`⏱️ Timeout en canal ${channelName}`);
        }

        if (status === 'CLOSED') {
          console.log(`🔒 Canal ${channelName} cerrado`);
        }
      });

    return channel;
  },

  async unsubscribeFromNotifications(channel: RealtimeChannel): Promise<void> {
    try {
      console.log(`🔴 Desuscribiendo canal: ${channel.topic}`);

      // Primero desuscribir, luego remover
      await channel.unsubscribe();
      await supabase.removeChannel(channel);

      console.log(`✅ Canal ${channel.topic} removido correctamente`);
    } catch (error) {
      console.error('❌ Error al desuscribir:', error);
      throw error;
    }
  },

  /**
   * Obtener notificaciones de un reporte específico
   */
  async getNotificationsByReportId(
    userId: string,
    reportId: string
  ): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('location_report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo notificaciones del reporte:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Obtener notificaciones de una mascota específica
   */
  async getNotificationsByPetId(
    userId: string,
    petId: string
  ): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo notificaciones de la mascota:', error);
      return [];
    }

    return data || [];
  },
};
