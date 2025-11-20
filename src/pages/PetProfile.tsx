import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PetFormData } from '../types';

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<PetFormData | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('qr_code', id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      console.log(data);
      setPet(data);
    };

    fetchPet();
  }, [id]);

  if (!pet) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-600">Cargando información de la mascota...</p>
      </div>
    );
  }

  // Calcular edad desde birth_date
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = pet.birth_date ? calculateAge(pet.birth_date) : null;

  // Función para abrir enlaces de redes sociales
  const openSocialMedia = (platform: string, username: string) => {
    const urls: { [key: string]: string } = {
      instagram: `https://instagram.com/${username.replace('@', '')}`,
      facebook: `https://facebook.com/${username}`,
      tiktok: `https://tiktok.com/@${username.replace('@', '')}`,
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header con foto */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-2xl">
            {pet.photo_1_url ? (
              <img
                src={pet.photo_1_url}
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 text-8xl">
                🐾
              </div>
            )}
          </div>

          <h1 className="mb-6 text-5xl font-bold text-gray-900">{pet.name}</h1>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-lg">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              {pet.species === 'Perro'
                ? '🐶'
                : pet.species === 'Gato'
                  ? '🐱'
                  : '🐾'}{' '}
              {pet.breed}
            </span>
            {age !== null && (
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                🎂 {age} {age === 1 ? 'año' : 'años'}
              </span>
            )}
            {pet.color && (
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                🎨 {pet.color}
              </span>
            )}
            {pet.size && (
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                📏 {pet.size}
              </span>
            )}
          </div>
        </div>

        {/* Galería de fotos */}
        {pet.extra_photos && pet.extra_photos.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pet.extra_photos?.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${pet.name}`}
                className="aspect-square w-full rounded-2xl object-cover shadow-lg"
              />
            ))}
          </div>
        )}

        <div className="space-y-4">
          {/* Descripción */}
          {pet.description && (
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="mb-3 text-2xl">✨</div>
              <h2 className="mb-3 text-xl font-bold text-gray-900">Sobre mí</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {pet.description}
              </p>
            </div>
          )}

          {/* Personalidad */}
          {pet.personality && (
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="mb-3 text-2xl">💫</div>
              <h2 className="mb-3 text-xl font-bold text-gray-900">
                Mi personalidad
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {pet.personality}
              </p>
            </div>
          )}

          {/* Salud */}
          {(pet.allergies ||
            pet.medications ||
            pet.diseases ||
            pet.care_recommendations) && (
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="mb-3 text-2xl">💊</div>
              <h2 className="mb-3 text-xl font-bold text-gray-900">
                Información de salud
              </h2>
              <div className="space-y-4">
                {pet.allergies && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900">
                      ⚠️ Alergias
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">
                      {pet.allergies}
                    </p>
                  </div>
                )}
                {pet.medications && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900">
                      💉 Medicamentos
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">
                      {pet.medications}
                    </p>
                  </div>
                )}
                {pet.diseases && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900">
                      🩺 Condiciones Médicas
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">
                      {pet.diseases}
                    </p>
                  </div>
                )}
                {pet.care_recommendations && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900">
                      💝 Recomendaciones de Cuidado
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">
                      {pet.care_recommendations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instrucciones de recuperación */}
          {pet.recovery_instructions && (
            <div className="rounded-3xl bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white shadow-lg">
              <div className="mb-3 text-3xl">🚨</div>
              <h2 className="mb-3 text-xl font-bold">
                ¡Me perdí! Por favor ayúdame
              </h2>
              <p className="leading-relaxed whitespace-pre-line">
                {pet.recovery_instructions}
              </p>
            </div>
          )}

          {/* Contacto de emergencia */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-3 text-2xl">📞</div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Contacto de emergencia
            </h2>
            <div className="space-y-3">
              {pet.emergency_phone && (
                <a
                  href={`tel:${pet.emergency_phone}`}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white transition hover:from-blue-600 hover:to-blue-700"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">{pet.emergency_phone}</span>
                </a>
              )}
              {pet.emergency_email && (
                <a
                  href={`mailto:${pet.emergency_email}`}
                  className="flex items-center gap-3 rounded-2xl bg-gray-100 p-4 text-gray-700 transition hover:bg-gray-200"
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">{pet.emergency_email}</span>
                </a>
              )}
              {pet.general_location && (
                <div className="flex items-center gap-3 rounded-2xl bg-gray-100 p-4 text-gray-700">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">{pet.general_location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Redes sociales */}
          {(pet.instagram ||
            pet.facebook ||
            pet.tiktok ||
            (pet.other_links && pet.other_links.length > 0)) && (
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="mb-3 text-2xl">🌐</div>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Mis redes sociales
              </h2>
              <div className="flex flex-wrap gap-3">
                {pet.instagram && (
                  <button
                    onClick={() => openSocialMedia('instagram', pet.instagram)}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium text-white shadow-md transition hover:shadow-lg"
                  >
                    📸 Instagram
                  </button>
                )}
                {pet.facebook && (
                  <button
                    onClick={() => openSocialMedia('facebook', pet.facebook)}
                    className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition hover:shadow-lg"
                  >
                    👍 Facebook
                  </button>
                )}
                {pet.tiktok && (
                  <button
                    onClick={() => openSocialMedia('tiktok', pet.tiktok)}
                    className="rounded-full bg-gray-900 px-6 py-3 font-medium text-white shadow-md transition hover:shadow-lg"
                  >
                    🎵 TikTok
                  </button>
                )}
                {pet.other_links?.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => window.open(link.url, '_blank')}
                    className="rounded-full bg-gray-200 px-6 py-3 font-medium text-gray-700 shadow-md transition hover:bg-gray-300"
                  >
                    🔗 {link.name || `Enlace ${index + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botón de contacto principal */}
        {pet.emergency_phone && (
          <div className="mt-8">
            <button
              onClick={() =>
                (window.location.href = `tel:${pet.emergency_phone}`)
              }
              className="w-full rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:from-green-600 hover:to-green-700"
            >
              <Phone className="mr-2 inline h-6 w-6" />
              Contactar al Dueño
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="mb-2">🐾 ID: {id}</div>
          <div className="text-xs">Hecho con ❤️ para mascotas</div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
