import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

/**
 * Drawer moderno para navegación móvil
 * Con animaciones fluidas y backdrop blur
 */
export const MobileDrawer = ({
  isOpen,
  onClose,
  children,
  title,
  position = 'left',
}: MobileDrawerProps) => {
  const prefersReducedMotion = useReducedMotion();

  const getSlideVariants = () => {
    const distance = position === 'left' || position === 'right' ? 'X' : 'Y';
    const direction = position === 'left' || position === 'top' ? '-' : '';

    return {
      hidden: { [`${distance.toLowerCase()}`]: `${direction}100%` },
      visible: { [`${distance.toLowerCase()}`]: 0 },
      exit: { [`${distance.toLowerCase()}`]: `${direction}100%` },
    };
  };

  const getDrawerClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-0 h-full w-80 max-w-[85vw]';
      case 'right':
        return 'right-0 top-0 h-full w-80 max-w-[85vw]';
      case 'top':
        return 'top-0 left-0 w-full h-auto max-h-[85vh]';
      case 'bottom':
        return 'bottom-0 left-0 w-full h-auto max-h-[85vh]';
      default:
        return 'left-0 top-0 h-full w-80 max-w-[85vw]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className={`fixed ${getDrawerClasses()} glass-strong z-50 shadow-2xl`}
            variants={prefersReducedMotion ? {} : getSlideVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              <motion.button
                className="ml-auto p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                onClick={onClose}
                whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 90 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100%-64px)] p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
