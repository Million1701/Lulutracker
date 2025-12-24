import { motion } from 'framer-motion';
import { useThemeConfig } from '../../../hooks/useThemeConfig';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface MeshGradientBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Background animado con mesh gradients
 * Tendencia de diseño 2024-2025 - Gradientes orgánicos en movimiento
 */
export const MeshGradientBackground = ({ intensity = 'medium' }: MeshGradientBackgroundProps) => {
  const { isDark } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  const getBlur = () => {
    switch (intensity) {
      case 'low': return 'blur-3xl';
      case 'medium': return 'blur-4xl';
      case 'high': return 'blur-[128px]';
      default: return 'blur-4xl';
    }
  };

  const getScale = () => {
    switch (intensity) {
      case 'low': return 0.8;
      case 'medium': return 1;
      case 'high': return 1.2;
      default: return 1;
    }
  };

  const duration = prefersReducedMotion ? 0 : 20;
  const scale = getScale();

  return (
    <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-dark-950' : 'bg-gray-50'}`}>
      {/* Blob 1 - Azul/Morado */}
      <motion.div
        className={`absolute top-0 left-0 w-96 h-96 ${getBlur()} ${
          isDark ? 'bg-primary-600/40' : 'bg-primary-500/30'
        } rounded-full`}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [-100, 100, -100],
                y: [-50, 50, -50],
                scale: [scale, scale * 1.1, scale],
              }
        }
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2 - Rosa/Púrpura */}
      <motion.div
        className={`absolute top-1/4 right-0 w-[28rem] h-[28rem] ${getBlur()} ${
          isDark ? 'bg-accent-purple/30' : 'bg-accent-pink/25'
        } rounded-full`}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [100, -50, 100],
                y: [0, 100, 0],
                scale: [scale, scale * 0.9, scale],
              }
        }
        transition={{
          duration: duration * 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Blob 3 - Cyan/Turquesa */}
      <motion.div
        className={`absolute bottom-0 left-1/4 w-[32rem] h-[32rem] ${getBlur()} ${
          isDark ? 'bg-accent-cyan/25' : 'bg-accent-emerald/20'
        } rounded-full`}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [-50, 50, -50],
                y: [50, -50, 50],
                scale: [scale * 0.9, scale * 1.1, scale * 0.9],
              }
        }
        transition={{
          duration: duration * 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Blob 4 - Naranja/Amarillo (solo en alta intensidad) */}
      {intensity === 'high' && (
        <motion.div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${getBlur()} ${
            isDark ? 'bg-accent-orange/20' : 'bg-accent-orange/15'
          } rounded-full`}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [50, -50, 50],
                  y: [-50, 50, -50],
                  scale: [scale * 0.8, scale, scale * 0.8],
                }
          }
          transition={{
            duration: duration * 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 6,
          }}
        />
      )}

      {/* Overlay de textura sutil */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {/* Gradiente de fade en los bordes */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isDark
          ? 'from-dark-950/60 via-transparent to-dark-950/60'
          : 'from-gray-50/60 via-transparent to-gray-50/60'
      }`} />
    </div>
  );
};
