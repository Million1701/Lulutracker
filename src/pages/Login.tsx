import { Link } from 'react-router-dom';
import { PawPrint, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LoadingScreen } from '../components/LoadingScreen';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) return alert('Error al enviar el código: ' + error.message);
    } catch (err) {
      console.error('Error sending code:', err);
    } finally {
      setLoading(false);
      setIsModal(true);
    }
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-white dark:bg-gray-900">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <PawPrint className="mx-auto mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Bienvenido
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Inicia sesión en tu cuenta
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSendCode}>
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </Card>
      </div>

      {loading === true ? <LoadingScreen /> : <></>}

      {isModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-sm shadow-lg relative">
            {/* Botón X */}
            <button
              onClick={() => setIsModal(false)}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl"
            >
              <X className="h-6 w-6" />
            </button>

            <p className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
              Se ha enviado un correo a{' '}
              <span className="font-bold">{email}</span>. Por favor, revisa tu
              bandeja de entrada para continuar.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
