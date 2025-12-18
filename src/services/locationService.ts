import { GeocodeResult, LocationCoordinates } from '../types';

/**
 * Servicio para manejar operaciones de geolocalización y geocoding
 */
export const locationService = {
  /**
   * Obtener la ubicación actual del usuario usando la API de Geolocation
   * @param highAccuracy - Si se debe usar alta precisión (más lento pero más preciso)
   * @returns Promise con las coordenadas o error
   */
  async getCurrentLocation(
    highAccuracy = true
  ): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada en este navegador'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: highAccuracy,
        timeout: 10000, // 10 segundos
        maximumAge: 0, // No usar caché
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let errorMessage = 'Error al obtener ubicación';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                'Permiso de ubicación denegado. Por favor, habilita los permisos de ubicación en tu navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                'Información de ubicación no disponible. Verifica tu conexión GPS.';
              break;
            case error.TIMEOUT:
              errorMessage =
                'Tiempo de espera agotado al obtener ubicación. Intenta de nuevo.';
              break;
          }

          reject(new Error(errorMessage));
        },
        options
      );
    });
  },

  /**
   * Geocoding inverso: Convertir coordenadas a dirección legible
   * Usa Nominatim de OpenStreetMap (gratuito, sin API key requerida)
   * @param latitude - Latitud
   * @param longitude - Longitud
   * @returns Promise con la dirección o null si falla
   */
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      // Nominatim API de OpenStreetMap
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'es', // Preferir respuestas en español
          'User-Agent': 'Lulutracker/1.0', // Requerido por Nominatim
        },
      });

      if (!response.ok) {
        console.error('Error en geocoding inverso:', response.statusText);
        return null;
      }

      const data: GeocodeResult = await response.json();

      if (!data.display_name) {
        return null;
      }

      // Construir dirección más legible si hay detalles
      if (data.address) {
        const parts: string[] = [];

        if (data.address.road) {
          let road = data.address.road;
          if (data.address.house_number) {
            road += ` ${data.address.house_number}`;
          }
          parts.push(road);
        }

        if (data.address.suburb) {
          parts.push(data.address.suburb);
        }

        if (data.address.city) {
          parts.push(data.address.city);
        } else if (data.address.state) {
          parts.push(data.address.state);
        }

        if (parts.length > 0) {
          return parts.join(', ');
        }
      }

      // Fallback: usar display_name completo
      return data.display_name;
    } catch (error) {
      console.error('Error al hacer geocoding inverso:', error);
      return null;
    }
  },

  /**
   * Obtener ubicación actual con dirección
   * Combina getCurrentLocation y reverseGeocode
   */
  async getCurrentLocationWithAddress(): Promise<{
    coordinates: LocationCoordinates;
    address: string | null;
  }> {
    const coordinates = await this.getCurrentLocation();
    const address = await this.reverseGeocode(
      coordinates.latitude,
      coordinates.longitude
    );

    return {
      coordinates,
      address,
    };
  },

  /**
   * Generar URL de Google Maps para una ubicación
   */
  getGoogleMapsUrl(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  },

  /**
   * Verificar si el navegador soporta geolocalización
   */
  isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  },

  /**
   * Calcular distancia entre dos puntos usando la fórmula Haversine
   * @returns Distancia en kilómetros
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  },

  /**
   * Convertir grados a radianes
   */
  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },
};
