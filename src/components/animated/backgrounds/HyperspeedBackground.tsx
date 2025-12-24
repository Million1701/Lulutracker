import { motion } from 'framer-motion';
import { useThemeConfig } from '../../../hooks/useThemeConfig';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useMemo } from 'react';

interface HyperspeedBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Background animado con efecto de velocidad hiperlumínica
 * Líneas que se mueven desde el centro hacia afuera creando efecto de movimiento
 */
export const HyperspeedBackground = ({ intensity = 'medium' }: HyperspeedBackgroundProps) => {
  const { isDark } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  const lineCount = useMemo(() => {
    switch (intensity) {
      case 'low': return 20;
      case 'medium': return 40;
      case 'high': return 60;
      default: return 40;
    }
  }, [intensity]);

  const speed = useMemo(() => {
    switch (intensity) {
      case 'low': return 3;
      case 'medium': return 2;
      case 'high': return 1.5;
      default: return 2;
    }
  }, [intensity]);

  // Generar líneas con posiciones y rotaciones aleatorias
  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => ({
      id: i,
      angle: (360 / lineCount) * i,
      delay: Math.random() * speed,
      length: 20 + Math.random() * 60,
      width: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  }, [lineCount, speed]);

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
        <div className={`absolute inset-0 opacity-10 ${
          isDark ? 'bg-gradient-radial from-primary-500/20 to-transparent' : 'bg-gradient-radial from-primary-300/20 to-transparent'
        }`} />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {lines.map((line) => (
            <motion.div
              key={line.id}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                rotate: line.angle,
                width: '50%',
                height: `${line.width}px`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, line.opacity, 0],
                x: ['0%', '100%'],
              }}
              transition={{
                duration: speed,
                repeat: Infinity,
                delay: line.delay,
                ease: 'easeOut',
              }}
            >
              <div
                className={`h-full ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent via-primary-400 to-primary-500'
                    : 'bg-gradient-to-r from-transparent via-primary-500 to-primary-600'
                }`}
                style={{
                  width: `${line.length}%`,
                }}
              />
            </motion.div>
          ))}

          {/* Centro brillante */}
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
              isDark ? 'bg-primary-400 shadow-glow' : 'bg-primary-500 shadow-glow'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </div>
  );
};
