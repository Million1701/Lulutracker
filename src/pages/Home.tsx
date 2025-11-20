import { Link } from 'react-router-dom';
import { QrCode, Shield, Smartphone, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
              Protege a tu mascota con{' '}
              <span className="text-blue-600">tecnología QR</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              Crea un perfil digital para tu mascota y genera un código QR
              único. Si se pierde, quien la encuentre podrá contactarte al
              instante.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login">
                <Button size="lg">Comenzar Gratis</Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            ¿Cómo funciona?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                1. Registra tu mascota
              </h3>
              <p className="text-gray-600">
                Crea un perfil con foto, nombre, raza y datos de contacto.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                2. Genera tu código QR
              </h3>
              <p className="text-gray-600">
                Descarga e imprime el QR para colocarlo en su collar o placa.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                3. Mantén la tranquilidad
              </h3>
              <p className="text-gray-600">
                Si alguien encuentra a tu mascota, podrá escanearlo y
                contactarte.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Smartphone className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-6 text-4xl font-bold">
            Siempre accesible desde cualquier dispositivo
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            No necesitas instalar ninguna app. Solo escanea el código QR con la
            cámara del teléfono.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary">
              Crear mi primera mascota
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
