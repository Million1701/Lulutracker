import { ReactNode } from 'react';
import { useThemeConfig } from '../../../hooks/useThemeConfig';
import { HyperspeedBackground } from './HyperspeedBackground';
import { BeamsBackground } from './BeamsBackground';
import { GridBackground } from './GridBackground';
import { DotsBackground } from './DotsBackground';
import { MeshGradientBackground } from './MeshGradientBackground';

export type BackgroundVariant =
  | 'hyperspeed'
  | 'beams'
  | 'grid'
  | 'dots'
  | 'mesh'
  | 'none';

interface AnimatedBackgroundProps {
  variant?: BackgroundVariant;
  children?: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Componente wrapper para backgrounds animados
 * Soporta múltiples variantes de animación y se adapta al tema actual
 */
export const AnimatedBackground = ({
  variant = 'mesh',
  children,
  className = '',
  intensity = 'medium',
}: AnimatedBackgroundProps) => {
  const { isDark } = useThemeConfig();

  const renderBackground = () => {
    switch (variant) {
      case 'hyperspeed':
        return <HyperspeedBackground intensity={intensity} />;
      case 'beams':
        return <BeamsBackground intensity={intensity} />;
      case 'grid':
        return <GridBackground intensity={intensity} />;
      case 'dots':
        return <DotsBackground intensity={intensity} />;
      case 'mesh':
        return <MeshGradientBackground intensity={intensity} />;
      case 'none':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        {renderBackground()}

        {/* Overlay gradiente para mejor legibilidad */}
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-b from-dark-900/80 via-dark-900/50 to-dark-900/80'
            : 'bg-gradient-to-b from-white/80 via-white/50 to-white/80'
        }`} />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
