import { supabase } from '../lib/supabase';
import { PetFormData } from '../types';

export const petService = {
  async getPets(): Promise<PetFormData[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async getPetById(id: string): Promise<PetFormData | null> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createPet(pet: Partial<PetFormData>): Promise<PetFormData> {
    const { data, error } = await supabase
      .from('pets')
      .insert([pet])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePet(id: string, updates: Partial<PetFormData>): Promise<PetFormData> {
    const { data, error } = await supabase
      .from('pets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePet(id: string): Promise<void> {
    const { error } = await supabase.from('pets').delete().eq('id', id);

    if (error) throw error;

    location.reload();
  },
};
