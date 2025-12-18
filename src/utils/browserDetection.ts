/**
 * Detecta si el navegador es Safari, iOS o tiene restricciones de geolocalización
 * Safari y iOS requieren que las solicitudes de geolocalización sean iniciadas
 * por una interacción directa del usuario (click), no automáticamente.
 */
export const isSafariOrRestrictive = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;

  // Detectar iOS (iPhone, iPad, iPod)
  const isIOS = /iPad|iPhone|iPod/.test(ua);

  // Detectar Safari (pero no Chrome en iOS que también tiene "Safari" en UA)
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);

  // Detectar navegadores en iOS que usan WebKit (todos los navegadores en iOS)
  const isIOSWebView = /AppleWebKit/.test(ua) && /Mobile/.test(ua);

  return isIOS || isSafari || isIOSWebView;
};

/**
 * Detecta el nombre del navegador para mensajes personalizados
 */
export const getBrowserName = (): string => {
  if (typeof navigator === 'undefined') return 'unknown';

  const ua = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'iOS';
  } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    return 'Safari';
  } else if (/Chrome/.test(ua)) {
    return 'Chrome';
  } else if (/Firefox/.test(ua)) {
    return 'Firefox';
  } else if (/Edge/.test(ua)) {
    return 'Edge';
  }

  return 'navegador';
};

/**
 * Verifica si el navegador soporta Geolocation API
 */
export const supportsGeolocation = (): boolean => {
  return 'geolocation' in navigator;
};
