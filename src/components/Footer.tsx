import logoLulu from '../assets/logo-lulu.png';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <img src={logoLulu} alt="Lulu" className="w-16 h-16 invert" />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              La forma más segura y moderna de proteger a tu mascota con
              tecnología QR.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Enlaces
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  Mis Mascotas
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contacto
            </h3>
            <p className="text-sm text-gray-600">
              ¿Tienes preguntas? Contáctanos en:
            </p>
            <p className="mt-2 text-sm font-medium text-blue-600">
              contacto@lulutracker.com
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="flex items-center justify-center text-sm text-gray-600">
            Hecho con <Heart className="mx-1 h-4 w-4 text-red-500" /> para
            nuestras mascotas © {currentYear} Lulutracker
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
