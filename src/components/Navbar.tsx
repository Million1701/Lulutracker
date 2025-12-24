import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, LogOut, Home } from 'lucide-react';
import logoLulu from '../assets/logo-lulu.png';
import { useAuth } from '../hooks/useAuth';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from './ui/ThemeToggle';
import { MobileDrawer } from './animated/navigation/MobileDrawer';
import NotificationBell from './NotificationBell';
import Button from './ui/Button';

/**
 * Navbar moderno con glassmorphism y animaciones fluidas
 * Diseño premium con efectos visuales de última generación
 */
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Error al cerrar sesión: ' + error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-strong shadow-lg border-b border-white/10'
            : 'bg-transparent border-b border-white/5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to={user ? '/dashboard' : '/'}
              className="flex items-center group"
            >
              <motion.div
                className="relative"
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, rotate: 5 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              >
                <img
                  src={logoLulu}
                  alt="Lulu"
                  className="w-10 h-10 invert dark:invert-0 transition-all duration-300 group-hover:drop-shadow-glow"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 blur-xl bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            {user ? (
              <div className="hidden items-center gap-4 md:flex">
                {/* Mis Mascotas Link */}
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  <Link
                    to="/dashboard"
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl glass hover:glass-strong transition-all duration-300"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                      Mis Mascotas
                    </span>
                  </Link>
                </motion.div>

                {/* Notification Bell */}
                <NotificationBell userId={user.id} />

                {/* Theme Toggle */}
                <ThemeToggle variant="icon" />

                {/* Logout Button */}
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-neon-pink transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Salir</span>
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="hidden items-center gap-4 md:flex">
                {/* Theme Toggle */}
                <ThemeToggle variant="icon" />

                {/* Login Button */}
                <Link to="/login">
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-glow"
                    >
                      Mis mascotas
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              {user && <NotificationBell userId={user.id} />}

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl glass hover:glass-strong transition-all duration-300"
                whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer con diseño moderno */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Menú"
        position="right"
      >
        <div className="flex flex-col gap-4">
          {user ? (
            <>
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full"
              >
                <motion.div
                  className="flex items-center gap-3 p-4 rounded-xl glass hover:glass-strong transition-all duration-300"
                  whileHover={prefersReducedMotion ? {} : { x: 5 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  <Home className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Mis Mascotas</span>
                </motion.div>
              </Link>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl glass">
                <span className="font-medium">Tema</span>
                <ThemeToggle variant="switch" />
              </div>

              {/* Logout Button */}
              <motion.button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-neon-pink transition-all duration-300"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar sesión</span>
              </motion.button>
            </>
          ) : (
            <>
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl glass">
                <span className="font-medium">Tema</span>
                <ThemeToggle variant="switch" />
              </div>

              {/* Login Button */}
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full"
              >
                <motion.div
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-glow transition-all duration-300"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  <span className="font-medium">Acceder</span>
                </motion.div>
              </Link>
            </>
          )}
        </div>
      </MobileDrawer>

      {/* Spacer para evitar que el contenido quede debajo del navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
