import { ReactNode, useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useThemeConfig } from '../../../hooks/useThemeConfig';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export type CardVariant = 'default' | 'glass' | 'gradient' | 'glow' | 'spotlight';
export type CardEffect = 'tilt' | 'lift' | 'glow' | 'none';

interface AnimatedCardProps {
  children: ReactNode;
  variant?: CardVariant;
  effect?: CardEffect;
  className?: string;
  onClick?: () => void;
  spotlight?: boolean;
}

/**
 * Componente Card animado con múltiples variantes y efectos
 * Soporta tilt 3D, spotlight effect, glassmorphism y más
 */
export const AnimatedCard = ({
  children,
  variant = 'default',
  effect = 'tilt',
  className = '',
  onClick,
  spotlight = false,
}: AnimatedCardProps) => {
  const { isDark } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values para el efecto tilt 3D
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations para movimiento suave
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  // Spotlight position
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calcular posición relativa del mouse (-0.5 a 0.5)
    const mouseXRelative = (e.clientX - centerX) / (rect.width / 2);
    const mouseYRelative = (e.clientY - centerY) / (rect.height / 2);

    if (effect === 'tilt') {
      mouseX.set(mouseXRelative);
      mouseY.set(mouseYRelative);
    }

    // Actualizar posición del spotlight
    if (spotlight || variant === 'spotlight') {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlightX.set(x);
      spotlightY.set(y);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (effect === 'tilt' && !prefersReducedMotion) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  // Estilos base según variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass';
      case 'gradient':
        return isDark
          ? 'bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/30'
          : 'bg-gradient-to-br from-primary-100 to-purple-100 border border-primary-200';
      case 'glow':
        return isDark
          ? 'bg-dark-800 border border-primary-500/50 shadow-glow'
          : 'bg-white border border-primary-300 shadow-lg';
      case 'spotlight':
        return 'modern-card overflow-hidden';
      default:
        return 'modern-card';
    }
  };

  // Animación del hover según efecto
  const getHoverAnimation = () => {
    if (prefersReducedMotion) return {};

    switch (effect) {
      case 'tilt':
        return {
          rotateX,
          rotateY,
          scale: isHovered ? 1.02 : 1,
        };
      case 'lift':
        return {
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
        };
      case 'glow':
        return {
          boxShadow: isHovered
            ? isDark
              ? '0 0 40px rgba(59, 130, 246, 0.6)'
              : '0 0 40px rgba(37, 99, 235, 0.4)'
            : '0 0 0px rgba(0, 0, 0, 0)',
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative p-6 rounded-2xl ${getVariantClasses()} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={
        effect === 'tilt' && !prefersReducedMotion
          ? {
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }
          : {}
      }
      animate={getHoverAnimation()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Spotlight effect */}
      {(spotlight || variant === 'spotlight') && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            background: `radial-gradient(circle 200px at ${spotlightX.get()}% ${spotlightY.get()}%, ${
              isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)'
            }, transparent 80%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Gradiente de brillo en hover */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
      )}

      {/* Border glow para variante glow */}
      {variant === 'glow' && isHovered && !prefersReducedMotion && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-30 -z-10" />
      )}

      {/* Content con transformación 3D para efecto tilt */}
      <div
        className="relative z-10"
        style={
          effect === 'tilt' && !prefersReducedMotion
            ? {
                transform: 'translateZ(20px)',
              }
            : {}
        }
      >
        {children}
      </div>
    </motion.div>
  );
};
