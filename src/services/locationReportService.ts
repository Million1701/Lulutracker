import { supabase } from '../lib/supabase';
import {
  LocationReport,
  CreateLocationReportData,
  LocationReportStatus,
  PetStatus,
} from '../types';

/**
 * Servicio para manejar operaciones CRUD de reportes de ubicación
 */
export const locationReportService = {
  /**
   * Crear un nuevo reporte de ubicación
   * Cualquier persona puede crear un reporte (no requiere autenticación)
   */
  async createReport(
    data: CreateLocationReportData
  ): Promise<LocationReport> {
    const { data: report, error } = await supabase
      .from('location_reports')
      .insert([
        {
          pet_id: data.pet_id,
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          address: data.address,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al crear reporte:', error);
      throw new Error('No se pudo guardar el reporte de ubicación');
    }

    return report;
  },

  /**
   * Obtener todos los reportes de una mascota específica
   * Solo el dueño puede ver los reportes (protegido por RLS)
   */
  async getReportsByPetId(petId: string): Promise<LocationReport[]> {
    const { data, error } = await supabase
      .from('location_reports')
      .select('*')
      .eq('pet_id', petId)
      .order('reported_at', { ascending: false });

    if (error) {
      console.error('Error al obtener reportes:', error);
      throw new Error('No se pudieron cargar los reportes');
    }

    return data || [];
  },

  /**
   * Obtener todos los reportes de todas las mascotas del usuario autenticado
   */
  async getAllUserReports(): Promise<LocationReport[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Primero obtener todas las mascotas del usuario
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('id')
      .eq('user_id', user.id);

    if (petsError) {
      console.error('Error al obtener mascotas:', petsError);
      throw new Error('No se pudieron cargar las mascotas');
    }

    if (!pets || pets.length === 0) {
      return [];
    }

    const petIds = pets.map((pet) => pet.id);

    // Obtener todos los reportes de esas mascotas
    const { data, error } = await supabase
      .from('location_reports')
      .select('*')
      .in('pet_id', petIds)
      .order('reported_at', { ascending: false });

    if (error) {
      console.error('Error al obtener reportes:', error);
      throw new Error('No se pudieron cargar los reportes');
    }

    return data || [];
  },

  /**
   * Actualizar el estado de un reporte
   * Solo el dueño puede actualizar (protegido por RLS)
   */
  async updateReportStatus(
    reportId: string,
    status: LocationReportStatus
  ): Promise<LocationReport> {
    const { data, error } = await supabase
      .from('location_reports')
      .update({ status })
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar reporte:', error);
      throw new Error('No se pudo actualizar el reporte');
    }

    return data;
  },

  /**
   * Eliminar un reporte
   * Solo el dueño puede eliminar (protegido por RLS)
   */
  async deleteReport(reportId: string): Promise<void> {
    const { error } = await supabase
      .from('location_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Error al eliminar reporte:', error);
      throw new Error('No se pudo eliminar el reporte');
    }
  },

  /**
   * Obtener reportes con información de la mascota
   */
  async getReportsWithPetInfo(): Promise<
    Array<LocationReport & { pet_name: string; pet_photo: string | null }>
  > {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('location_reports')
      .select(
        `
        *,
        pets!inner (
          name,
          photo_1_url,
          user_id
        )
      `
      )
      .eq('pets.user_id', user.id)
      .order('reported_at', { ascending: false });

    if (error) {
      console.error('Error al obtener reportes con info de mascota:', error);
      throw new Error('No se pudieron cargar los reportes');
    }

    // Transformar los datos para que sean más fáciles de usar
    return (data || []).map((item: any) => ({
      id: item.id,
      pet_id: item.pet_id,
      latitude: item.latitude,
      longitude: item.longitude,
      accuracy: item.accuracy,
      address: item.address,
      reported_at: item.reported_at,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      pet_name: item.pets.name,
      pet_photo: item.pets.photo_1_url,
    }));
  },

  /**
   * Contar reportes pendientes para una mascota
   */
  async countPendingReports(petId: string): Promise<number> {
    const { count, error } = await supabase
      .from('location_reports')
      .select('*', { count: 'exact', head: true })
      .eq('pet_id', petId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error al contar reportes pendientes:', error);
      return 0;
    }

    return count || 0;
  },
};

/**
 * Descartar todos los reportes pendientes de una mascota
 * Útil cuando la mascota ha sido encontrada
 */
export async function dismissPendingReports(petId: string): Promise<number> {
  const { data, error } = await supabase
    .from('location_reports')
    .update({ status: 'dismissed' })
    .eq('pet_id', petId)
    .eq('status', 'pending')
    .select();

  if (error) {
    console.error('Error al descartar reportes pendientes:', error);
    throw new Error('No se pudieron descartar los reportes pendientes');
  }

  return data?.length || 0;
}

/**
 * Servicio para manejar el estado de las mascotas (lost/found/normal)
 */
export const petStatusService = {
  /**
   * Actualizar el estado de una mascota
   */
  async updatePetStatus(petId: string, status: PetStatus): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .update({ status })
      .eq('id', petId);

    if (error) {
      console.error('Error al actualizar estado de mascota:', error);
      throw new Error('No se pudo actualizar el estado de la mascota');
    }
  },

  /**
   * Obtener el estado actual de una mascota
   */
  async getPetStatus(petId: string): Promise<PetStatus> {
    const { data, error } = await supabase
      .from('pets')
      .select('status')
      .eq('id', petId)
      .single();

    if (error) {
      console.error('Error al obtener estado de mascota:', error);
      return 'normal'; // Default
    }

    return data?.status || 'normal';
  },

  /**
   * Manejar cambio de estado de mascota con lógica automática
   * - Si se marca como 'found': descarta reportes pendientes
   * - Si se marca como 'lost': no hace nada extra
   * - Si se marca como 'normal': no hace nada extra
   *
   * @returns Número de reportes descartados (si aplica)
   */
  async handlePetStatusChange(
    petId: string,
    newStatus: PetStatus
  ): Promise<{ dismissedCount: number }> {
    // Actualizar el estado de la mascota
    await this.updatePetStatus(petId, newStatus);

    let dismissedCount = 0;

    // Si la mascota se marca como 'found', descartar todos los reportes pendientes
    if (newStatus === 'found') {
      try {
        dismissedCount = await dismissPendingReports(petId);
        console.log(
          `Mascota marcada como encontrada. ${dismissedCount} reportes pendientes archivados.`
        );
      } catch (error) {
        console.error(
          'Error al descartar reportes pendientes, pero el estado se actualizó:',
          error
        );
        // No lanzamos error aquí porque el estado ya se actualizó
      }
    }

    return { dismissedCount };
  },
};
