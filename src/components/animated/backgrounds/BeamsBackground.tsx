import { motion } from 'framer-motion';
import { useThemeConfig } from '../../../hooks/useThemeConfig';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useMemo } from 'react';

interface BeamsBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Background animado con rayos de luz verticales
 * Efecto cinematográfico moderno
 */
export const BeamsBackground = ({ intensity = 'medium' }: BeamsBackgroundProps) => {
  const { isDark } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  const beamCount = useMemo(() => {
    switch (intensity) {
      case 'low': return 3;
      case 'medium': return 5;
      case 'high': return 8;
      default: return 5;
    }
  }, [intensity]);

  const beams = useMemo(() => {
    return Array.from({ length: beamCount }, (_, i) => ({
      id: i,
      left: `${(100 / (beamCount + 1)) * (i + 1)}%`,
      delay: i * 0.3,
      width: 60 + Math.random() * 100,
      duration: 3 + Math.random() * 2,
    }));
  }, [beamCount]);

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
        {beams.map((beam) => (
          <div
            key={beam.id}
            className={`absolute top-0 bottom-0 blur-3xl opacity-10 ${
              isDark ? 'bg-primary-500/30' : 'bg-primary-400/30'
            }`}
            style={{
              left: beam.left,
              width: `${beam.width}px`,
              transform: 'translateX(-50%)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${isDark ? 'bg-dark-900' : 'bg-gray-50'} overflow-hidden`}>
      {beams.map((beam) => (
        <motion.div
          key={beam.id}
          className={`absolute top-0 bottom-0 ${
            isDark
              ? 'bg-gradient-to-b from-primary-500/40 via-primary-400/20 to-transparent'
              : 'bg-gradient-to-b from-primary-400/40 via-primary-300/20 to-transparent'
          }`}
          style={{
            left: beam.left,
            width: `${beam.width}px`,
            transform: 'translateX(-50%)',
            filter: 'blur(40px)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            delay: beam.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Overlay de ruido para textura */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
    </div>
  );
};
