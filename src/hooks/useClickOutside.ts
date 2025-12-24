import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook para detectar clics fuera de un elemento
 * @param callback - Función a ejecutar cuando se hace clic fuera del elemento
 * @param enabled - Si el hook debe estar activo (default: true)
 * @returns RefObject para asignar al elemento
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void,
  enabled: boolean = true
): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Agregar event listeners para mouse y touch
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
};
