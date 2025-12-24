import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'switch';
  showLabel?: boolean;
  className?: string;
}

/**
 * Componente moderno para alternar entre light y dark mode
 * Con animaciones fluidas y soporte para diferentes variantes
 */
export const ThemeToggle = ({
  variant = 'icon',
  showLabel = false,
  className = '',
}: ThemeToggleProps) => {
  const context = useContext(ThemeContext);
  const prefersReducedMotion = useReducedMotion();

  if (!context) {
    throw new Error('ThemeToggle must be used within a ThemeProvider');
  }

  const { theme, toggleTheme } = context;
  const isDark = theme === 'dark';

  // Configuración de animación
  const animationConfig = {
    initial: { scale: 0.8, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0.8, rotate: 180, opacity: 0 },
    transition: {
      duration: prefersReducedMotion ? 0 : 0.3,
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  };

  // Variante Icon (solo ícono)
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full
          bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600
          transition-all duration-300 group ${className}`}
        aria-label="Toggle theme"
      >
        <motion.div
          key={theme}
          {...animationConfig}
          className="absolute"
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-primary-400" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
        </motion.div>

        {/* Efecto de glow en hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary-400/20 to-purple-400/20" />
      </button>
    );
  }

  // Variante Button (botón con texto)
  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl
          glass hover:glass-strong transition-all duration-300
          group ${className}`}
        aria-label="Toggle theme"
      >
        <motion.div
          key={theme}
          {...animationConfig}
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-primary-400" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
        </motion.div>

        {showLabel && (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}
      </button>
    );
  }

  // Variante Switch (interruptor animado)
  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center h-10 rounded-full w-20 transition-colors duration-300
          ${isDark ? 'bg-primary-600' : 'bg-amber-400'} ${className}`}
        aria-label="Toggle theme"
      >
        {/* Track del switch con gradiente */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Thumb del switch */}
        <motion.div
          className="absolute flex items-center justify-center w-8 h-8 bg-white dark:bg-dark-800 rounded-full shadow-lg"
          animate={{
            x: isDark ? 44 : 4,
          }}
          transition={{
            type: prefersReducedMotion ? 'tween' : 'spring',
            stiffness: 500,
            damping: 30,
            duration: prefersReducedMotion ? 0 : 0.3,
          }}
        >
          <motion.div
            key={theme}
            {...animationConfig}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-primary-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-600" />
            )}
          </motion.div>
        </motion.div>

        {/* Iconos de fondo (decorativos) */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <Sun className={`w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-70'} text-white`} />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Moon className={`w-4 h-4 transition-opacity duration-300 ${isDark ? 'opacity-70' : 'opacity-30'} text-white`} />
        </div>
      </button>
    );
  }

  return null;
};
