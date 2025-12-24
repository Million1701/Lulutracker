import { motion } from 'framer-motion';
import { useThemeConfig } from '../../../hooks/useThemeConfig';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useMemo } from 'react';

interface DotsBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Background animado con puntos flotantes
 * Efecto minimalista y elegante
 */
export const DotsBackground = ({ intensity = 'medium' }: DotsBackgroundProps) => {
  const { isDark } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  const dotCount = useMemo(() => {
    switch (intensity) {
      case 'low': return 30;
      case 'medium': return 60;
      case 'high': return 100;
      default: return 60;
    }
  }, [intensity]);

  const dots = useMemo(() => {
    return Array.from({ length: dotCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.4,
    }));
  }, [dotCount]);

  return (
    <div className={`absolute inset-0 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={isDark ? '#3b82f6' : '#2563eb'}
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor={isDark ? '#1e40af' : '#1d4ed8'}
              stopOpacity="0"
            />
          </radialGradient>

          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={isDark ? '#60a5fa' : '#3b82f6'}
              stopOpacity="0.6"
            />
            <stop
              offset="100%"
              stopColor="transparent"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r={dot.size}
            fill="url(#dotGradient)"
            initial={{ opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: dot.opacity }
                : {
                    opacity: [0, dot.opacity, 0],
                    scale: [0.5, 1, 0.5],
                    y: [`${dot.y}%`, `${dot.y - 10}%`, `${dot.y}%`],
                  }
            }
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Puntos con glow (menos cantidad, más grandes) */}
        {dots.slice(0, Math.floor(dotCount / 5)).map((dot) => (
          <motion.circle
            key={`glow-${dot.id}`}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r={dot.size * 3}
            fill="url(#glowGradient)"
            initial={{ opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: dot.opacity * 0.5 }
                : {
                    opacity: [0, dot.opacity * 0.5, 0],
                    scale: [0.8, 1.2, 0.8],
                  }
            }
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Gradiente de overlay */}
      <div className={`absolute inset-0 bg-gradient-radial ${
        isDark
          ? 'from-transparent via-dark-900/30 to-dark-900/80'
          : 'from-transparent via-gray-50/30 to-gray-50/80'
      }`} />
    </div>
  );
};
