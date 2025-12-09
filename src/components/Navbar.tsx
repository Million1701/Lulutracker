import logoLulu from '../assets/logo-lulu.png';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Error al cerrar sesión: ' + error.message);
    } else {
      alert('Sesión cerrada correctamente.');
      window.location.href = '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to={`${user ? '/dashboard' : '/'}`}
            className="flex items-center space-x-2"
          >
            <img src={logoLulu} alt="Lulu" className="w-10 h-10 invert dark:invert-0" />
          </Link>

          {user ? (
            <div className="hidden items-center space-x-4 md:flex">
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-gray-200 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Mis Mascotas
              </Link>
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              <Button size="sm" className="w-auto" onClick={handleLogout}>
                Cerrar sesion
              </Button>
            </div>
          ) : (
            <div className="hidden items-center space-x-4 md:flex">
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              <Link to="/login">
                <Button size="sm">Mis mascotas</Button>
              </Link>
            </div>
          )}

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 dark:text-gray-200 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis Mascotas
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {theme === 'light' ? (
                      <>
                        <Moon className="h-5 w-5" />
                        Modo Oscuro
                      </>
                    ) : (
                      <>
                        <Sun className="h-5 w-5" />
                        Modo Claro
                      </>
                    )}
                  </button>
                  <Button size="sm" className="w-full" onClick={handleLogout}>
                    Cerrar sesion
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {theme === 'light' ? (
                      <>
                        <Moon className="h-5 w-5" />
                        Modo Oscuro
                      </>
                    ) : (
                      <>
                        <Sun className="h-5 w-5" />
                        Modo Claro
                      </>
                    )}
                  </button>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Mis mascotas
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
