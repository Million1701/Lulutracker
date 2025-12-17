import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PetFormData, PetStatus } from '../types';
import { LoadingScreen } from '../components/LoadingScreen';
import { useLocation } from '../hooks/useLocation';
import { locationReportService, petStatusService } from '../services/locationReportService';
import { locationService } from '../services/locationService';
import Button from '../components/ui/Button';

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<PetFormData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(true);
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const {
    coordinates,
    address,
    isLoading: locationLoading,
    error: locationError,
    getCurrentLocation,
    isSupported,
  } = useLocation();

  // Verificar si el usuario actual es el dueño
  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && pet && pet.user_id === user.id) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        console.error('Error verificando propiedad:', error);
        setIsOwner(false);
      } finally {
        setIsCheckingOwnership(false);
      }
    };

    if (pet) {
      checkOwnership();
    }
  }, [pet]);

  // Fetch pet data
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
      setPet(data);
    };

    fetchPet();
  }, [id]);

  // Solicitar ubicación automáticamente si la mascota está perdida y NO es el dueño
  useEffect(() => {
    const requestLocationAutomatically = async () => {
      if (
        !isCheckingOwnership &&
        !isOwner &&
        pet?.status === 'lost' &&
        !reportSent &&
        !coordinates &&
        isSupported
      ) {
        // Solicitar ubicación automáticamente
        try {
          await getCurrentLocation();
        } catch (error) {
          console.error('Error al solicitar ubicación automática:', error);
        }
      }
    };

    requestLocationAutomatically();
  }, [
    isCheckingOwnership,
    isOwner,
    pet?.status,
    reportSent,
    coordinates,
    isSupported,
    getCurrentLocation,
  ]);

  // Enviar reporte automáticamente cuando se obtengan las coordenadas
  useEffect(() => {
    const sendReportAutomatically = async () => {
      if (
        !isOwner &&
        pet?.status === 'lost' &&
        coordinates &&
        !reportSent &&
        pet.id
      ) {
        try {
          await locationReportService.createReport({
            pet_id: pet.id,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            accuracy: coordinates.accuracy,
            address: address || undefined,
          });

          setReportSent(true);
          setReportError(null);
        } catch (error) {
          console.error('Error enviando reporte:', error);
          setReportError('No se pudo enviar el reporte. Intenta de nuevo.');
        }
      }
    };

    sendReportAutomatically();
  }, [isOwner, pet, coordinates, address, reportSent]);

  // Manejar cambio de estado de la mascota (solo para dueños)
  const handleStatusChange = useCallback(
    async (newStatus: PetStatus) => {
      if (!pet?.id) return;

      setUpdatingStatus(true);
      try {
        await petStatusService.updatePetStatus(pet.id, newStatus);
        setPet((prev) => (prev ? { ...prev, status: newStatus } : null));
      } catch (error) {
        console.error('Error actualizando estado:', error);
        alert('No se pudo actualizar el estado de la mascota');
      } finally {
        setUpdatingStatus(false);
      }
    },
    [pet?.id]
  );

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

  const age = pet?.birth_date ? calculateAge(pet.birth_date) : null;

  // Función para abrir enlaces de redes sociales
  const openSocialMedia = (platform: string, username: string) => {
    const urls: { [key: string]: string } = {
      instagram: `https://instagram.com/${username.replace('@', '')}`,
      facebook: `https://facebook.com/${username}`,
      tiktok: `https://tiktok.com/@${username.replace('@', '')}`,
    };
    window.open(urls[platform], '_blank');
  };

  if (!pet) {
    return <LoadingScreen />;
  }

  const petStatus = pet.status || 'normal';
  const isLost = petStatus === 'lost';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Banner de Mascota Perdida (solo para NO dueños) */}
        {!isOwner && isLost && (
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white shadow-xl animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-8 w-8" />
              <h2 className="text-2xl font-bold">
                🚨 MASCOTA PERDIDA
              </h2>
            </div>
            <p className="text-lg mb-4">
              ¡Ayuda a {pet.name} a regresar a casa!
            </p>

            {/* Estados de ubicación */}
            {reportSent ? (
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">✅ Ubicación enviada al dueño</span>
                </div>
                {coordinates && (
                  <div className="mt-3">
                    <a
                      href={locationService.getGoogleMapsUrl(
                        coordinates.latitude,
                        coordinates.longitude
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full font-medium hover:bg-red-50 transition"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                )}
              </div>
            ) : locationLoading ? (
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Obteniendo tu ubicación...</span>
                </div>
              </div>
            ) : locationError ? (
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <p className="mb-3">{locationError}</p>
                <Button
                  onClick={getCurrentLocation}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Compartir mi Ubicación
                </Button>
              </div>
            ) : !isSupported ? (
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <p>Tu navegador no soporta geolocalización</p>
              </div>
            ) : (
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <Button
                  onClick={getCurrentLocation}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  📍 Compartir mi Ubicación
                </Button>
              </div>
            )}

            {reportError && (
              <div className="mt-3 bg-red-800 rounded-lg p-3">
                <p className="text-sm">{reportError}</p>
              </div>
            )}
          </div>
        )}

        {/* Panel de control para el dueño */}
        {isOwner && (
          <div className="mb-6 rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Panel de Control del Dueño
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Estado actual:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    petStatus === 'lost'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : petStatus === 'found'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {petStatus === 'lost'
                    ? '🚨 Perdido'
                    : petStatus === 'found'
                    ? '✅ Encontrado'
                    : '✓ Normal'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {petStatus !== 'lost' && (
                  <Button
                    onClick={() => handleStatusChange('lost')}
                    disabled={updatingStatus}
                    variant="outline"
                    className="border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    🚨 Marcar como Perdido
                  </Button>
                )}

                {petStatus === 'lost' && (
                  <Button
                    onClick={() => handleStatusChange('found')}
                    disabled={updatingStatus}
                    variant="outline"
                    className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    ✅ Marcar como Encontrado
                  </Button>
                )}

                {petStatus !== 'normal' && (
                  <Button
                    onClick={() => handleStatusChange('normal')}
                    disabled={updatingStatus}
                    variant="outline"
                  >
                    ✓ Estado Normal
                  </Button>
                )}
              </div>

              <Link
                to="/location-reports"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <MapPin className="h-4 w-4" />
                Ver Reportes de Ubicación →
              </Link>
            </div>
          </div>
        )}

        {/* Header con foto */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-white dark:border-gray-700 shadow-2xl">
            {pet.photo_1_url ? (
              <img
                src={pet.photo_1_url}
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 text-8xl">
                🐾
              </div>
            )}
          </div>

          <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-gray-100">{pet.name}</h1>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-lg">
            <span className="rounded-full bg-white dark:bg-gray-700 dark:text-gray-100 px-4 py-2 shadow-sm">
              {pet.species === 'Perro'
                ? '🐶'
                : pet.species === 'Gato'
                  ? '🐱'
                  : '🐾'}{' '}
              {pet.breed}
            </span>
            {age !== null && (
              <span className="rounded-full bg-white dark:bg-gray-700 dark:text-gray-100 px-4 py-2 shadow-sm">
                🎂 {age} {age === 1 ? 'año' : 'años'}
              </span>
            )}
            {pet.color && (
              <span className="rounded-full bg-white dark:bg-gray-700 dark:text-gray-100 px-4 py-2 shadow-sm">
                🎨 {pet.color}
              </span>
            )}
            {pet.size && (
              <span className="rounded-full bg-white dark:bg-gray-700 dark:text-gray-100 px-4 py-2 shadow-sm">
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

          {/* Descripción */}
          {pet.description && (
            <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-3 text-2xl">✨</div>
              <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">Sobre mí</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {pet.description}
              </p>
            </div>
          )}

          {/* Personalidad */}
          {pet.personality && (
            <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-3 text-2xl">💫</div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                Mi personalidad
              </h2>

              <div className="flex flex-wrap gap-2">
                {pet.personality.split(',').map((trait, index) => (
                  <span
                    key={index}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600"
                  >
                    {trait.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Salud */}
          {(pet.allergies ||
            pet.medications ||
            pet.diseases ||
            pet.care_recommendations) && (
            <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-3 text-2xl">💊</div>
              <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                Información de salud
              </h2>
              <div className="space-y-4">
                {pet.allergies && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                      ⚠️ Alergias
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {pet.allergies}
                    </p>
                  </div>
                )}
                {pet.medications && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                      💉 Medicamentos
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {pet.medications}
                    </p>
                  </div>
                )}
                {pet.diseases && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                      🩺 Condiciones Médicas
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {pet.diseases}
                    </p>
                  </div>
                )}
                {pet.care_recommendations && (
                  <div>
                    <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                      💝 Recomendaciones de Cuidado
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {pet.care_recommendations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contacto de emergencia */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg">
            <div className="mb-3 text-2xl">📞</div>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              Contacto de emergencia
            </h2>
            <div className="space-y-3">
              {pet.emergency_phone && (
                <a
                  href={`tel:${pet.emergency_phone}`}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-4 text-white transition hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">{pet.emergency_phone}</span>
                </a>
              )}
              {pet.emergency_email && (
                <a
                  href={`mailto:${pet.emergency_email}`}
                  className="flex items-center gap-3 rounded-2xl bg-gray-100 dark:bg-gray-700 p-4 text-gray-700 dark:text-gray-300 transition hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">{pet.emergency_email}</span>
                </a>
              )}
              {pet.general_location && (
                <div className="flex items-center gap-3 rounded-2xl bg-gray-100 dark:bg-gray-700 p-4 text-gray-700 dark:text-gray-300">
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
            <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="mb-3 text-2xl">🌐</div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                Mis redes sociales
              </h2>
              <div className="flex flex-wrap gap-3">
                {pet.instagram && (
                  <button
                    onClick={() => openSocialMedia('instagram', pet.instagram)}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 px-6 py-3 font-medium text-white shadow-md transition hover:shadow-lg"
                  >
                    📸 Instagram
                  </button>
                )}
                {pet.facebook && (
                  <button
                    onClick={() => openSocialMedia('facebook', pet.facebook)}
                    className="rounded-full bg-blue-600 dark:bg-blue-700 px-6 py-3 font-medium text-white shadow-md transition hover:shadow-lg"
                  >
                    👍 Facebook
                  </button>
                )}
                {pet.tiktok && (
                  <button
                    onClick={() => openSocialMedia('tiktok', pet.tiktok)}
                    className="rounded-full bg-gray-900 dark:bg-gray-950 px-6 py-3 font-medium text-white shadow-md transition hover:shadow-lg"
                  >
                    🎵 TikTok
                  </button>
                )}
                {pet.other_links?.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => window.open(link.url, '_blank')}
                    className="rounded-full bg-gray-200 dark:bg-gray-700 px-6 py-3 font-medium text-gray-700 dark:text-gray-300 shadow-md transition hover:bg-gray-300 dark:hover:bg-gray-600"
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
              className="w-full rounded-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
            >
              <Phone className="mr-2 inline h-6 w-6" />
              Contactar al Dueño
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-2">🐾 ID: {id}</div>
          <div className="text-xs">Hecho con ❤️ para mascotas</div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
