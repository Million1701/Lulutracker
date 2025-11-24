import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PetFormData } from '../types';
import PetCard from '../components/PetCard';
import { LoadingScreen } from '../components/LoadingScreen';

const Dashboard = () => {
  const [pets, setPets] = useState<PetFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []); // Se ejecuta al montar el componente

  const fetchPets = async () => {
    try {
      setLoading(true);

      // Obtener usuario actual
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) throw new Error('No autenticado');

      // Consultar mascotas del usuario
      const { data, error } = await supabase
        .from('pets')
        .select(
          'id, user_id, qr_code, name, species, breed, color, size, birth_date, description, personality, allergies, medications, diseases, care_recommendations, emergency_phone, emergency_email, general_location, recovery_instructions, photo_1_url, extra_photos, instagram, facebook, tiktok, other_links, is_active'
        )
        .eq('user_id', user.id);

      if (error) throw error;

      setPets(data || []);
    } catch (err) {
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading === true ? (
        <LoadingScreen />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
              <p className="mt-2 text-gray-600">
                Administra los perfiles de tus mascotas
              </p>
            </div>
            <Link to="/dashboard/new-pet">
              <Button>
                <Plus className="mr-2 h-5 w-5" />
                Agregar Mascota
              </Button>
            </Link>
          </div>
          <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.length <= 0 ? (
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                  No tienes mascotas registradas
                </h2>
                <p className="mb-6 text-gray-600">
                  Comienza creando el perfil de tu primera mascota
                </p>
                <Link to="/dashboard/new-pet">
                  <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Crear mi primera mascota
                  </Button>
                </Link>
              </div>
            ) : (
              pets.map((p) => <PetCard pet={p} />)
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default Dashboard;
