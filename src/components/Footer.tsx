import { Heart, Mail, ShoppingBag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoLulu from '../assets/logo-lulu.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logoLulu} alt="Lulu" className="h-16 w-16 invert" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              La forma más segura y moderna de proteger a tu mascota con
              tecnología QR.
            </p>
            <div className="mt-6">
              <a
                href="https://lulutracker.myshopify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                <ShoppingBag className="h-4 w-4" />
                Visitar Tienda
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Navegación
            </h3>
            <ul className="space-y-3">
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

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Recursos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/como-funciona"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  ¿Cómo Funciona?
                </Link>
              </li>
              <li>
                <Link
                  to="/preguntas-frecuentes"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <a
                  href="https://lulutracker.myshopify.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  Tienda Online
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <a
                  href="mailto:lulubrandco@gmail.com"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                >
                  lulubrandco@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Norte de Santander, Colombia
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-900">
                Horario de Atención
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Lunes a Viernes: 9:00 AM - 6:00 PM
              </p>
              <p className="text-sm text-gray-600">
                Sábados: 9:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="flex items-center text-sm text-gray-600">
              Hecho con <Heart className="mx-1 h-4 w-4 text-red-500" /> para
              nuestras mascotas © {currentYear} Lulutracker
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                to="/privacidad"
                className="text-sm text-gray-600 transition-colors hover:text-blue-600"
              >
                Privacidad
              </Link>
              <Link
                to="/terminos"
                className="text-sm text-gray-600 transition-colors hover:text-blue-600"
              >
                Términos
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-600 transition-colors hover:text-blue-600"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
