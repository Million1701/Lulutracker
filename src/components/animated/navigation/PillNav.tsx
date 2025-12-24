import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon?: LucideIcon;
}

interface PillNavProps {
  items: NavItem[];
  className?: string;
}

/**
 * Navegación moderna con efecto pill animado
 * El indicador se desliza suavemente al item activo
 */
export const PillNav = ({ items, className = '' }: PillNavProps) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = items.findIndex(item => location.pathname === item.path);

  return (
    <nav className={`flex items-center gap-1 p-1 glass rounded-full ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = index === activeIndex;
        const isHovered = index === hoveredIndex;

        return (
          <Link
            key={item.path}
            to={item.path}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <motion.div
              className={`relative z-10 px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>

            {/* Background activo */}
            {isActive && (
              <motion.div
                layoutId="pill-nav-active"
                className="absolute inset-0 bg-primary-600 dark:bg-primary-500 rounded-full"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 30 }
                }
              />
            )}

            {/* Background hover */}
            {isHovered && !isActive && (
              <motion.div
                layoutId="pill-nav-hover"
                className="absolute inset-0 bg-gray-200 dark:bg-dark-700 rounded-full"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 30 }
                }
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
