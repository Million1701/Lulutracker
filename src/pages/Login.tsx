import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState<string>('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) return alert('Error al enviar el código: ' + error.message);

    console.log(data);
    console.log('se envio un codigo al correo');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <PawPrint className="mx-auto mb-4 h-12 w-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
          <p className="mt-2 text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        <form className="space-y-6" onSubmit={handleSendCode}>
          <Input
            type="email"
            label="Correo electrónico"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Recordarme</span>
            </label>
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ¿Olvidaste tu correo?
            </Link>
          </div>

          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
