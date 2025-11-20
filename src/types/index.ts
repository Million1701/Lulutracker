import { PET_SIZES, PET_SPECIES } from "../utils/constants";

type PetSpecies = (typeof PET_SPECIES)[number];
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
