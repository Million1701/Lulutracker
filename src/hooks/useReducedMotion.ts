import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el usuario prefiere animaciones reducidas
 * Respeta la configuración de accesibilidad del sistema operativo
 * @returns {boolean} true si el usuario prefiere animaciones reducidas
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verificar si el navegador soporta matchMedia
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Establecer valor inicial
    setPrefersReducedMotion(mediaQuery.matches);

    // Listener para cambios en la preferencia
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Agregar listener (compatible con versiones antiguas de Safari)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook para obtener configuración de animación basada en preferencias del usuario
 * @returns Objeto con configuración de animación
 */
export const useAnimationConfig = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Duraciones de animación
    duration: {
      fast: prefersReducedMotion ? 0 : 0.2,
      normal: prefersReducedMotion ? 0 : 0.3,
      slow: prefersReducedMotion ? 0 : 0.6,
    },
    // Configuración de Framer Motion
    transition: {
      type: prefersReducedMotion ? 'tween' : 'spring',
      duration: prefersReducedMotion ? 0 : 0.3,
    },
  };
};
