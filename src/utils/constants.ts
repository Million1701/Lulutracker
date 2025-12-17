export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Lulutracker';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PET_PROFILE: '/pet/:id',
} as const;

export const PET_SPECIES = ['Perro', 'Gato'] as const;
export const PET_SIZES = ['Pequeño', 'Mediano', 'Grande', 'Muy Grande'] as const;