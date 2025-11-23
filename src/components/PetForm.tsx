import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import {
  FormErrors,
  OtherLink,
  PetFormData,
  PhotoPreviews,
  Section,
  SectionId,
} from '../types';
import { petService } from '../services/petService';
import { PET_SIZES, PET_SPECIES } from '../utils/constants';
import { supabase } from '../lib/supabase';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface PetFormProps {
  mode?: 'create' | 'edit';
  initialData?: PetFormData;
  closeModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PetForm: React.FC<PetFormProps> = ({
  mode = 'create',
  initialData,
  closeModal,
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const isEditMode = mode === 'edit' || !!initialData?.id;
  const actualPetId = initialData?.id || params.petId;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<PetFormData>({
    user_id: '',
    qr_code: '',
    name: '',
    species: 'Perro',
    breed: '',
    color: '',
    size: 'Mediano',
    birth_date: '',
    description: '',
    personality: '',
    allergies: '',
    medications: '',
    diseases: '',
    care_recommendations: '',
    emergency_phone: '',
    emergency_email: '',
    general_location: '',
    recovery_instructions: '',
    photo_1_url: null,
    extra_photos: [],
    instagram: '',
    facebook: '',
    tiktok: '',
    other_links: [],
    is_active: null,
  });

  const [previews, setPreviews] = useState<PhotoPreviews>({
    photo_1: null,
    photo_2: null,
    extra_photos: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [activeSection, setActiveSection] = useState<SectionId>('basic');

  // Cargar datos existentes en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviews({
        photo_1: initialData.photo_1_url || null,
        photo_2: null,
        extra_photos: initialData.extra_photos || [],
      });
    }
  }, [initialData]);

  const generateQRCode = (): string => {
    return 'LLQr-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    photoField: 'photo_1' | 'photo_2'
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [photoField]: 'La imagen no debe superar 5MB',
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviews((prev) => ({ ...prev, [photoField]: imageUrl }));
        setFormData((prev) => ({ ...prev, [`${photoField}_url`]: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtraPhotosChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = Array.from(e.target.files || []);

    // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
    e.target.value = '';

    if (files.length === 0) return;

    const remainingSlots = 5 - previews.extra_photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Mostrar advertencia si se intentan subir más fotos de las permitidas
    if (files.length > remainingSlots) {
      setErrors((prev) => ({
        ...prev,
        extra_photos: `Solo puedes agregar ${remainingSlots} foto(s) más. Máximo 5 fotos adicionales.`,
      }));
    } else {
      // Limpiar error previo si existe
      setErrors((prev) => ({
        ...prev,
        extra_photos: '',
      }));
    }

    // Validar tamaño de archivos ANTES de procesarlos
    const invalidFiles = filesToAdd.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        extra_photos: 'Una o más imágenes superan el límite de 5MB',
      }));
      return; // Detener completamente si hay archivos inválidos
    }

    // Procesar archivos de forma secuencial para evitar problemas de memoria
    const newPreviews: string[] = [];

    for (const file of filesToAdd) {
      try {
        const imageUrl = await readFileAsDataURL(file);
        newPreviews.push(imageUrl);
      } catch (error) {
        console.error('Error al procesar imagen:', error);
        setErrors((prev) => ({
          ...prev,
          extra_photos:
            'Error al procesar una o más imágenes. Intenta de nuevo.',
        }));
        return;
      }
    }

    // Actualizar estado solo una vez con todas las imágenes procesadas
    setPreviews((prev) => ({
      ...prev,
      extra_photos: [...prev.extra_photos, ...newPreviews],
    }));

    setFormData((prev) => ({
      ...prev,
      extra_photos: [...(prev.extra_photos || []), ...newPreviews],
    }));
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.onabort = () => {
        reject(new Error('Lectura de archivo cancelada'));
      };

      reader.readAsDataURL(file);
    });
  };

  // Función para remover foto (asegúrate de tenerla implementada)
  const removeExtraPhoto = (indexToRemove: number): void => {
    setPreviews((prev) => ({
      ...prev,
      extra_photos: prev.extra_photos.filter(
        (_, index) => index !== indexToRemove
      ),
    }));

    setFormData((prev) => ({
      ...prev,
      extra_photos: (prev.extra_photos || []).filter(
        (_, index) => index !== indexToRemove
      ),
    }));

    // Limpiar error si existe
    setErrors((prev) => ({
      ...prev,
      extra_photos: '',
    }));
  };

  const removeImage = (photoField: 'photo_1' | 'photo_2'): void => {
    setPreviews((prev) => ({ ...prev, [photoField]: null }));
    setFormData((prev) => ({ ...prev, [`${photoField}_url`]: null }));
  };

  const addOtherLink = (): void => {
    setFormData((prev) => ({
      ...prev,
      other_links: [...prev.other_links, { name: '', url: '' }],
    }));
  };

  const updateOtherLink = (
    index: number,
    field: keyof OtherLink,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      other_links: prev.other_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const removeOtherLink = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      other_links: prev.other_links.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.breed.trim()) newErrors.breed = 'La raza es requerida';
    if (!formData.emergency_phone.trim())
      newErrors.emergency_phone = 'El teléfono de emergencia es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Usuario no autenticado');
        return;
      }

      const dataToSubmit = { ...formData };

      if (isEditMode) {
        // Modo edición
        const { updatePet } = petService;
        const updatedData = await updatePet(actualPetId!, dataToSubmit);

        if (updatedData) {
          alert('Mascota actualizada exitosamente');
          navigate(`/pet/${updatedData.qr_code}`);
        }
      } else {
        // Modo creación
        dataToSubmit.user_id = user.id;
        dataToSubmit.is_active = true;

        if (!dataToSubmit.qr_code) {
          dataToSubmit.qr_code = generateQRCode();
        }

        const { createPet } = petService;
        const createdData = await createPet(dataToSubmit);

        if (createdData) {
          navigate(`/dashboard/new-pet/qr_success?qr=${createdData.qr_code}`);
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(
        isEditMode
          ? 'Error al actualizar la mascota'
          : 'Error al crear la mascota'
      );
    } finally {
      setLoading(false);
    }
  };

  const sections: Section[] = [
    { id: 'basic', label: 'Información Básica' },
    { id: 'health', label: 'Salud' },
    { id: 'emergency', label: 'Emergencia' },
    { id: 'photos', label: 'Fotos' },
    { id: 'social', label: 'Redes Sociales' },
  ];

  return (
    <div className="max-w-2xl mx-auto w-full md-w-screen h-full sm:h-fit overflow-auto">
      <Card className="p-8 rounded-none sm:rounded-lg mb-32 sm:mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Editar mascota' : 'Registra tu mascota'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isEditMode
            ? 'Actualiza la información de tu mascota'
            : 'Completa la información de tu mascota para crear su perfil QR'}
        </p>

        {/* Navegación por pestañas */}
        <div className="flex overflow-x-auto mb-8 border-b border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Nombre de la mascota *"
                  name="name"
                  placeholder="Ej: Max, Luna"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Especie *
                  </label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                  >
                    {PET_SPECIES.map((species) => (
                      <option key={species} value={species}>
                        {species}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Raza *"
                  name="breed"
                  placeholder="Ej: Labrador, Persa"
                  value={formData.breed}
                  onChange={handleInputChange}
                  error={errors.breed}
                />

                <Input
                  label="Color"
                  name="color"
                  placeholder="Ej: Negro, Café y blanco"
                  value={formData.color}
                  onChange={handleInputChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tamaño
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                  >
                    {PET_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Fecha de nacimiento"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descripción general
                </label>
                <textarea
                  name="description"
                  placeholder="Describe a tu mascota: apariencia, comportamiento general..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>
            </div>
          )}

          {/* Salud */}
          {activeSection === 'health' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Personalidad
                </label>
                <textarea
                  name="personality"
                  placeholder="Ej: Juguetón, tímido con extraños, muy cariñoso..."
                  value={formData.personality}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Alergias
                </label>
                <textarea
                  name="allergies"
                  placeholder="Lista las alergias conocidas (alimentos, medicamentos, etc.)"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Medicamentos
                </label>
                <textarea
                  name="medications"
                  placeholder="Medicamentos que toma regularmente, dosis y frecuencia"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Enfermedades
                </label>
                <textarea
                  name="diseases"
                  placeholder="Enfermedades crónicas o condiciones médicas"
                  value={formData.diseases}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Recomendaciones de cuidado
                </label>
                <textarea
                  name="care_recommendations"
                  placeholder="Cuidados especiales, rutinas, alimentación..."
                  value={formData.care_recommendations}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>
            </div>
          )}

          {/* Emergencia */}
          {activeSection === 'emergency' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  Esta información será visible en el QR para que puedan
                  contactarte si encuentran a tu mascota.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Teléfono de emergencia *"
                  name="emergency_phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.emergency_phone}
                  onChange={handleInputChange}
                  error={errors.emergency_phone}
                />

                <Input
                  label="Email de emergencia"
                  name="emergency_email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.emergency_email}
                  onChange={handleInputChange}
                />
              </div>

              <Input
                label="Ubicación general"
                name="general_location"
                placeholder="Ej: Barrio Chapinero, Bogotá"
                value={formData.general_location}
                onChange={handleInputChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Instrucciones de recuperación
                </label>
                <textarea
                  name="recovery_instructions"
                  placeholder="Instrucciones sobre qué hacer si encuentran a tu mascota..."
                  value={formData.recovery_instructions}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>
            </div>
          )}

          {/* Fotos */}
          {activeSection === 'photos' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Foto principal *
                </label>
                {previews.photo_1 ? (
                  <div className="relative inline-block w-full">
                    <img
                      src={previews.photo_1}
                      alt="Foto principal"
                      className="h-64 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('photo_1')}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 transition-colors hover:border-blue-500 hover:bg-blue-50">
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Subir foto principal
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG hasta 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'photo_1')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fotos adicionales (máximo 5)
                </label>

                {previews.extra_photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {previews.extra_photos.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Extra ${index + 1}`}
                          className="h-32 w-full rounded-lg object-cover"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => removeExtraPhoto(index)}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600 shadow-lg"
                          aria-label={`Eliminar foto ${index + 1}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {previews.extra_photos.length < 5 && (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8 transition-colors hover:border-blue-500 hover:bg-blue-50">
                    <Plus className="mb-2 h-8 w-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Agregar más fotos
                    </span>
                    <span className="text-xs text-gray-500">
                      {previews.extra_photos.length}/5 fotos agregadas
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleExtraPhotosChange}
                      className="hidden"
                      capture="environment" // Añadido: Abre cámara en móviles
                    />
                  </label>
                )}

                {errors.extra_photos && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.extra_photos}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Redes Sociales */}
          {activeSection === 'social' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Información del dueño (opcional):</strong> Agrega tus
                  redes sociales para que puedan identificarte como el dueño de
                  la mascota.
                </p>
              </div>

              <Input
                label="Instagram del dueño"
                name="instagram"
                placeholder="@usuario"
                value={formData.instagram}
                onChange={handleInputChange}
              />

              <Input
                label="Facebook del dueño"
                name="facebook"
                placeholder="facebook.com/perfil"
                value={formData.facebook}
                onChange={handleInputChange}
              />

              <Input
                label="TikTok del dueño"
                name="tiktok"
                placeholder="@usuario"
                value={formData.tiktok}
                onChange={handleInputChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Otros enlaces del dueño
                </label>

                {formData.other_links.map((link, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nombre (ej: Twitter, LinkedIn)"
                      value={link.name}
                      onChange={(e) =>
                        updateOtherLink(index, 'name', e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateOtherLink(index, 'url', e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherLink(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addOtherLink}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Agregar enlace
                </button>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6 pb-12 sm:pb-0 border-t border-gray-200">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading
                ? 'Guardando...'
                : isEditMode
                  ? 'Actualizar mascota'
                  : 'Crear mascota'}
            </Button>

            {isEditMode ? (
              // Si está editando → mostrar botón de cancelar normal
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() =>
                  mode === 'edit' && closeModal ? closeModal(false) : null
                }
              >
                Cancelar
              </Button>
            ) : (
              // Si está creando → mostrar Link al dashboard
              <Link
                to="/dashboard"
                className="flex-1 px-4 py-2 border rounded-lg text-center border-gray-300 
                 hover:bg-gray-100 transition"
              >
                Cancelar
              </Link>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PetForm;
