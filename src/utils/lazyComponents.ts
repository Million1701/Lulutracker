import { lazy } from 'react';

/**
 * Lazy loading de componentes animados para optimización de performance
 * Reduce el bundle size inicial y mejora el tiempo de carga
 */

// Backgrounds animados
export const AnimatedBackground = lazy(() =>
  import('../components/animated/backgrounds/AnimatedBackground').then((module) => ({
    default: module.AnimatedBackground,
  }))
);

export const MeshGradientBackground = lazy(() =>
  import('../components/animated/backgrounds/MeshGradientBackground').then((module) => ({
    default: module.MeshGradientBackground,
  }))
);

export const HyperspeedBackground = lazy(() =>
  import('../components/animated/backgrounds/HyperspeedBackground').then((module) => ({
    default: module.HyperspeedBackground,
  }))
);

export const BeamsBackground = lazy(() =>
  import('../components/animated/backgrounds/BeamsBackground').then((module) => ({
    default: module.BeamsBackground,
  }))
);

export const GridBackground = lazy(() =>
  import('../components/animated/backgrounds/GridBackground').then((module) => ({
    default: module.GridBackground,
  }))
);

export const DotsBackground = lazy(() =>
  import('../components/animated/backgrounds/DotsBackground').then((module) => ({
    default: module.DotsBackground,
  }))
);

// Cards animados
export const AnimatedCard = lazy(() =>
  import('../components/animated/cards/AnimatedCard').then((module) => ({
    default: module.AnimatedCard,
  }))
);

// Texto animado
export const GradientTitle = lazy(() =>
  import('../components/animated/text/AnimatedText').then((module) => ({
    default: module.GradientTitle,
  }))
);

export const IridescentText = lazy(() =>
  import('../components/animated/text/AnimatedText').then((module) => ({
    default: module.IridescentText,
  }))
);

export const AnimatedText = lazy(() =>
  import('../components/animated/text/AnimatedText').then((module) => ({
    default: module.AnimatedText,
  }))
);

// Navegación
export const MobileDrawer = lazy(() =>
  import('../components/animated/navigation/MobileDrawer').then((module) => ({
    default: module.MobileDrawer,
  }))
);

export const PillNav = lazy(() =>
  import('../components/animated/navigation/PillNav').then((module) => ({
    default: module.PillNav,
  }))
);
