import logoLulu from '../assets/logo-lulu.png';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoLulu} alt="Lulu" className="w-10 h-10 invert" />
          </Link>

          {user ? (
            <div className="hidden items-center space-x-8 md:flex">
              <Link
                to="/dashboard"
                className="text-gray-700 transition-colors hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Mis Mascotas
              </Link>
              <Button size="sm" className="w-auto" onClick={handleLogout}>
                Cerrar sesion
              </Button>
            </div>
          ) : (
            <div className="hidden items-center space-x-8 md:flex">
              <Link
                to="/"
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                Inicio
              </Link>
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
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 transition-colors hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis Mascotas
                  </Link>
                  <Button size="sm" className="w-full" onClick={handleLogout}>
                    Cerrar sesion
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="text-gray-700 transition-colors hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inicio
                  </Link>
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
