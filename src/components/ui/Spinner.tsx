import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'gradient';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const sizeValues = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
};

/**
 * Componente Spinner moderno con múltiples variantes y animaciones suaves
 */
export const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
}: SpinnerProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Colores según variante
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          primary: '#3b82f6', // blue-500
          secondary: '#60a5fa', // blue-400
        };
      case 'secondary':
        return {
          primary: '#6b7280', // gray-500
          secondary: '#9ca3af', // gray-400
        };
      case 'white':
        return {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.5)',
        };
      case 'gradient':
        return {
          primary: '#a855f7', // purple-500
          secondary: '#ec4899', // pink-500
        };
      default:
        return {
          primary: '#3b82f6',
          secondary: '#60a5fa',
        };
    }
  };

  const colors = getColors();
  const spinnerSize = sizeValues[size];

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={colors.secondary}
          strokeWidth="4"
          opacity="0.2"
        />
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={variant === 'gradient' ? 'url(#gradient)' : colors.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80, 200"
          strokeDashoffset="0"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  rotate: 360,
                  strokeDashoffset: [0, -150],
                }
          }
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            },
            strokeDashoffset: {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />

        {/* Gradiente para variante gradient */}
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
          </defs>
        )}
      </svg>
    </div>
  );
};

/**
 * Spinner con efecto de puntos (dots)
 */
export const DotsSpinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
}: SpinnerProps) => {
  const prefersReducedMotion = useReducedMotion();

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  const getColorClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500';
      case 'secondary':
        return 'bg-gray-500';
      case 'white':
        return 'bg-white';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-primary-500';
    }
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: prefersReducedMotion ? 0 : [-8, 0],
    },
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSizes[size]} ${getColorClass()} rounded-full`}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Spinner con efecto de pulso
 */
export const PulseSpinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
}: SpinnerProps) => {
  const prefersReducedMotion = useReducedMotion();

  const getColorClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500';
      case 'secondary':
        return 'bg-gray-500';
      case 'white':
        return 'bg-white';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-primary-500';
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <motion.div
        className={`absolute inset-0 ${getColorClass()} rounded-full`}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.5],
                opacity: [0.6, 0],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className={`absolute inset-0 ${getColorClass()} rounded-full`}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.5],
                opacity: [0.6, 0],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.75,
        }}
      />
      <div className={`absolute inset-0 ${getColorClass()} rounded-full opacity-80`} />
    </div>
  );
};
