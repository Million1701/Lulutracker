import { ReactNode, ElementType } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export type TextEffect = 'gradient' | 'glitch' | 'shimmer' | 'fade' | 'slide' | 'none';
export type GradientVariant = 'primary' | 'aurora' | 'sunset' | 'ocean' | 'fire';

interface AnimatedTextProps {
  children: ReactNode;
  as?: ElementType;
  effect?: TextEffect;
  gradient?: GradientVariant;
  className?: string;
  delay?: number;
}

const gradientClasses: Record<GradientVariant, string> = {
  primary: 'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400',
  aurora: 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500',
  sunset: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
  ocean: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600',
  fire: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600',
};

/**
 * Componente de texto animado con múltiples efectos
 */
export const AnimatedText = ({
  children,
  as: Component = 'h1',
  effect = 'gradient',
  gradient = 'primary',
  className = '',
  delay = 0,
}: AnimatedTextProps) => {
  const prefersReducedMotion = useReducedMotion();

  const getEffectClasses = () => {
    switch (effect) {
      case 'gradient':
        return `${gradientClasses[gradient]} bg-clip-text text-transparent bg-200% animate-gradient-x`;
      case 'glitch':
        return 'relative';
      case 'shimmer':
        return 'relative inline-block';
      case 'fade':
      case 'slide':
        return '';
      default:
        return '';
    }
  };

  const getAnimation = () => {
    if (prefersReducedMotion) return {};

    switch (effect) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8, delay },
        };
      case 'slide':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay },
        };
    }
  };

  if (effect === 'glitch') {
    return (
      <Component className={`relative inline-block ${className}`}>
        <motion.span
          {...getAnimation()}
          className="relative z-10"
        >
          {children}
        </motion.span>
        {!prefersReducedMotion && (
          <>
            <span
              className="absolute top-0 left-0 text-red-500 opacity-70 animate-glitch-1"
              aria-hidden="true"
            >
              {children}
            </span>
            <span
              className="absolute top-0 left-0 text-blue-500 opacity-70 animate-glitch-2"
              aria-hidden="true"
            >
              {children}
            </span>
          </>
        )}
      </Component>
    );
  }

  if (effect === 'shimmer') {
    return (
      <Component className={`${className}`}>
        <motion.span
          {...getAnimation()}
          className={`relative inline-block ${gradientClasses[gradient]} bg-clip-text text-transparent`}
        >
          {children}
          {!prefersReducedMotion && (
            <span className="absolute inset-0 shimmer-effect bg-200% animate-shimmer" />
          )}
        </motion.span>
      </Component>
    );
  }

  return (
    <motion.div {...getAnimation()}>
      <Component className={`${getEffectClasses()} ${className}`}>
        {children}
      </Component>
    </motion.div>
  );
};

/**
 * Componente especializado para títulos con gradiente
 */
export const GradientTitle = ({
  children,
  gradient = 'aurora',
  as = 'h1',
  className = '',
}: Omit<AnimatedTextProps, 'effect'>) => {
  return (
    <AnimatedText
      as={as}
      effect="gradient"
      gradient={gradient}
      className={`font-bold ${className}`}
    >
      {children}
    </AnimatedText>
  );
};

/**
 * Componente para títulos con efecto iridiscente
 */
export const IridescentText = ({
  children,
  as = 'h2',
  className = '',
}: Pick<AnimatedTextProps, 'children' | 'as' | 'className'>) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Component
        as={as}
        className={`bg-iridescent bg-300% ${
          !prefersReducedMotion && 'animate-gradient-xy'
        } bg-clip-text text-transparent font-bold ${className}`}
      >
        {children}
      </Component>
    </motion.div>
  );
};

const Component = ({ as: As, ...props }: any) => <As {...props} />;
