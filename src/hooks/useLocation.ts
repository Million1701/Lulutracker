import { useState, useCallback } from 'react';
import { LocationCoordinates } from '../types';
import { locationService } from '../services/locationService';

interface UseLocationReturn {
  coordinates: LocationCoordinates | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
  isSupported: boolean;
}

/**
 * Hook personalizado para manejar geolocalización
 * Encapsula la lógica de obtener ubicación y dirección del usuario
 */
export const useLocation = (): UseLocationReturn => {
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(
    null
  );
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener coordenadas y dirección
      const result = await locationService.getCurrentLocationWithAddress();

      setCoordinates(result.coordinates);
      setAddress(result.address);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al obtener ubicación';
      setError(errorMessage);
      setCoordinates(null);
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isSupported = locationService.isGeolocationSupported();

  return {
    coordinates,
    address,
    isLoading,
    error,
    getCurrentLocation,
    clearError,
    isSupported,
  };
};
