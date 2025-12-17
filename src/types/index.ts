import { PET_SIZES, PET_SPECIES } from "../utils/constants";

export type PetSpecies = (typeof PET_SPECIES)[number];
type PetSize = (typeof PET_SIZES)[number];

export interface OtherLink {
  name: string;
  url: string;
}



export interface PetFormData {
  // Información básica
  id?: string;
  user_id: string;
  qr_code: string;
  name: string;
  species: PetSpecies;
  breed: string;
  color: string;
  size: PetSize;
  birth_date: string;
  description: string;

  // Salud
  personality: string;
  allergies: string;
  medications: string;
  diseases: string;
  care_recommendations: string;

  // Contacto de emergencia
  emergency_phone: string;
  emergency_email: string;
  general_location: string;
  recovery_instructions: string;

  // Fotos
  photo_1_url: string | null;
  extra_photos: string[]; // array de URLs

  // Redes sociales del dueño
  instagram: string;
  facebook: string;
  tiktok: string;
  other_links: OtherLink[];

  is_active: boolean | null;

  // Estado de la mascota (para sistema de localización)
  status?: PetStatus;
}

export interface PhotoPreviews {
  photo_1: string | null;
  photo_2: string | null;
  extra_photos: string[];
}

export type FormErrors = Partial<
  Record<keyof PetFormData | 'image' | 'extra_photos', string>
>;

export type SectionId = 'basic' | 'health' | 'emergency' | 'photos' | 'social';

export interface Section {
  id: SectionId;
  label: string;
}


export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
}

// ==========================================
// Location Tracking Types
// ==========================================

export type PetStatus = 'normal' | 'lost' | 'found';
export type LocationReportStatus = 'pending' | 'verified' | 'dismissed';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationReport {
  id: string;
  pet_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  reported_at: string;
  status: LocationReportStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationReportData {
  pet_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}
