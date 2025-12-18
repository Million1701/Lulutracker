/**
 * Detecta si el navegador es Safari, iOS o tiene restricciones de geolocalización
 * Safari y iOS requieren que las solicitudes de geolocalización sean iniciadas
 * por una interacción directa del usuario (click), no automáticamente.
 */
export const isSafariOrRestrictive = (): boolean => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;

  const ua = navigator.userAgent;
  const vendor = navigator.vendor || '';

  // Detectar iOS (iPhone, iPad, iPod) - método más robusto
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Detectar Safari (pero no Chrome en iOS que también tiene "Safari" en UA)
  const isSafari = /Safari/.test(ua) &&
                   !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) &&
                   vendor.indexOf('Apple') > -1;

  // Detectar todos los navegadores en iOS (todos usan WebKit)
  const isIOSWebView = /AppleWebKit/.test(ua) &&
                        /Mobile/.test(ua) &&
                        (isIOS || /iPhone|iPad|iPod/.test(ua));

  // Log para debugging
  console.log('🔍 Detección de navegador:', {
    userAgent: ua,
    vendor: vendor,
    isIOS: isIOS,
    isSafari: isSafari,
    isIOSWebView: isIOSWebView,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    resultado: isIOS || isSafari || isIOSWebView
  });

  return isIOS || isSafari || isIOSWebView;
};

/**
 * Detecta el nombre del navegador para mensajes personalizados
 */
export const getBrowserName = (): string => {
  if (typeof navigator === 'undefined') return 'unknown';

  const ua = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'iOS';
  } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    return 'Safari';
  } else if (/Chrome/.test(ua) || /CriOS/.test(ua)) {
    return 'Chrome';
  } else if (/Firefox/.test(ua) || /FxiOS/.test(ua)) {
    return 'Firefox';
  } else if (/Edge/.test(ua) || /EdgiOS/.test(ua)) {
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

