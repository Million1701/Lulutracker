import { motion } from 'framer-motion';
import { useThemeConfig } from '../../../hooks/useThemeConfig';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface GridBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Background animado con grid en perspectiva 3D
 * Estilo cyberpunk/futurista
 */
export const GridBackground = ({ intensity = 'medium' }: GridBackgroundProps) => {
  const { isDark } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  const getOpacity = () => {
    switch (intensity) {
      case 'low': return 0.1;
      case 'medium': return 0.2;
      case 'high': return 0.3;
      default: return 0.2;
    }
  };

  return (
    <div className={`absolute inset-0 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      {/* Grid en perspectiva */}
      <div className="absolute inset-0 perspective-1000">
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full preserve-3d"
          style={{
            transformOrigin: 'bottom center',
            transform: 'rotateX(60deg)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -50, 0],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Líneas horizontales */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className={`absolute left-0 right-0 border-t ${
                isDark ? 'border-primary-500/30' : 'border-primary-600/30'
              }`}
              style={{
                top: `${i * 5}%`,
                opacity: getOpacity() * (1 - i * 0.03),
              }}
            />
          ))}

          {/* Líneas verticales */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className={`absolute top-0 bottom-0 border-l ${
                isDark ? 'border-primary-500/30' : 'border-primary-600/30'
              }`}
              style={{
                left: `${i * 5}%`,
                opacity: getOpacity() * (1 - Math.abs(i - 10) * 0.05),
              }}
            />
          ))}

          {/* Línea horizontal destacada en movimiento */}
          <motion.div
            className={`absolute left-0 right-0 h-0.5 ${
              isDark ? 'bg-primary-400 shadow-glow' : 'bg-primary-500 shadow-glow'
            }`}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    top: ['0%', '100%'],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>

      {/* Gradiente de fade hacia arriba */}
      <div className={`absolute inset-0 bg-gradient-to-t ${
        isDark
          ? 'from-transparent via-dark-900/50 to-dark-900'
          : 'from-transparent via-gray-50/50 to-gray-50'
      }`} />

      {/* Glow en el horizonte */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 ${
        isDark
          ? 'bg-gradient-to-t from-primary-500/20 to-transparent'
          : 'bg-gradient-to-t from-primary-400/20 to-transparent'
      } blur-2xl`} />
    </div>
  );
};
