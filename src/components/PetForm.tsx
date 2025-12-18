import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PET_SIZES, PET_SPECIES } from '../utils/constants';
import { Upload, X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { petService } from '../services/petService';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import MultiPhotoUploader from './MultiPhotoUploader';

// Tipos e Interfaces
interface OtherLink {
  name: string;
  url: string;
}

interface PetFormData {
  id?: string;
  user_id: string;
  qr_code: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  size: string;
  birth_date: string;
  description: string;
  personality: string;
  allergies: string;
  medications: string;
  diseases: string;
  care_recommendations: string;
  emergency_phone: string;
  emergency_email: string;
  general_location: string;
  recovery_instructions: string;
  photo_1_url: string | null;
  extra_photos: string[];
  instagram: string;
  facebook: string;
  tiktok: string;
  other_links: OtherLink[];
  is_active: boolean | null;
}

interface FormErrors {
  name?: string;
  breed?: string;
  emergency_phone?: string;
  emergency_email?: string;
  photo_1?: string;
  extra_photos?: string;
}

interface PhotoPreviews {
  photo_1: string | null;
  photo_2: string | null;
  extra_photos: string[];
}

type SectionId = 'basic' | 'health' | 'emergency' | 'photos' | 'social';

interface Section {
  id: SectionId;
  label: string;
}

interface PetFormProps {
  mode?: 'create' | 'edit';
  initialData?: PetFormData;
  closeModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Opciones predefinidas para personalidad
const PERSONALITY_OPTIONS = [
  'Juguetón',
  'Tranquilo',
  'Cariñoso',
  'Tímido',
  'Energético',
  'Sociable',
  'Independiente',
  'Protector',
];

// Razas por especie
const BREEDS_BY_SPECIES: Record<string, string[]> = {
  Perro: [
    'Labrador',
    'Golden Retriever',
    'Pastor Alemán',
    'Bulldog',
    'Beagle',
    'Poodle',
    'Chihuahua',
    'Yorkshire',
    'Husky',
    'Pitbull',
    'Schnauzer',
    'Cocker Spaniel',
    'Dálmata',
    'Boxer',
    'Mestizo',
    'Otra',
  ],
  Gato: [
    'Persa',
    'Siamés',
    'Angora',
    'Maine Coon',
    'British Shorthair',
    'Bengalí',
    'Ragdoll',
    'Sphynx',
    'Común/Criollo',
    'Otra',
  ],
};

// Componente Card
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`bg-white dark:bg-gray-800 shadow-lg ${className}`}>
    {children}
  </div>
);

// Componente Input
const Input: React.FC<{
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
      }`}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    )}
  </div>
);

// Componente Button
const Button: React.FC<{
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
}) => {
  const baseStyles =
    'px-4 py-3 rounded-lg font-medium transition-all min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
      'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95',
    outline:
      'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Componente MultiSelect para personalidad
const MultiSelect: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected.includes(option)
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// Componente Principal
const PetForm: React.FC<PetFormProps> = ({
  mode = 'create',
  initialData,
  closeModal,
}) => {
  const navigate = useNavigate();
  const isEditMode = mode === 'edit' || !!initialData?.id;
  const actualPetId = initialData?.id;

  const [loading, setLoading] = useState(false);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>(
    []
  );
  const [showCustomBreed, setShowCustomBreed] = useState(false);
  const [availableBreeds, setAvailableBreeds] = useState<string[]>(
    BREEDS_BY_SPECIES['Perro']
  );

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

      // Cargar personalidades seleccionadas
      if (initialData.personality) {
        const personalities = initialData.personality.split(', ');
        setSelectedPersonalities(personalities);
      }

      // Actualizar razas disponibles según especie
      const breeds =
        BREEDS_BY_SPECIES[initialData.species] || BREEDS_BY_SPECIES['Perro'];
      setAvailableBreeds(breeds);

      // Verificar si la raza es personalizada
      if (initialData.breed && !breeds.includes(initialData.breed)) {
        setShowCustomBreed(true);
      }
    }
  }, [initialData]);

  // Actualizar personality cuando cambian las selecciones
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      personality: selectedPersonalities.join(', '),
    }));
  }, [selectedPersonalities]);

  const generateQRCode = (): string => {
    return 'LLQr-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Validaciones específicas
  const validatePhone = (phone: string): boolean => {
    const phoneRegex =
      /^(?:\+57\s?)?(?:3\d{2}\s?\d{3}\s?\d{4}|60[1-9]\s?\d{7}|\d{7})$/;
    return phoneRegex.test(phone.trim());
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;

    // Si cambia la especie, actualizar las razas disponibles
    if (name === 'species') {
      const breeds = BREEDS_BY_SPECIES[value] || BREEDS_BY_SPECIES['Perro'];
      setAvailableBreeds(breeds);
      setFormData((prev) => ({ ...prev, species: value, breed: '' }));
      setShowCustomBreed(false);
      return;
    }

    // Si selecciona "Otra" en raza, mostrar campo personalizado
    if (name === 'breed' && value === 'Otra') {
      setShowCustomBreed(true);
      setFormData((prev) => ({ ...prev, breed: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo al editarlo
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

  // ⬇️ NUEVO: Handler para fotos extras usando el componente
  const handleExtraPhotosChange = (photos: string[]): void => {
    setPreviews((prev) => ({
      ...prev,
      extra_photos: photos,
    }));
    setFormData((prev) => ({
      ...prev,
      extra_photos: photos,
    }));
  };

  // ⬇️ NUEVO: Handler para errores de fotos extras
  const handleExtraPhotosError = (errorMessage: string): void => {
    setErrors((prev) => ({
      ...prev,
      extra_photos: errorMessage,
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

    // Validaciones obligatorias
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'La raza es requerida';
    }

    if (!formData.emergency_phone.trim()) {
      newErrors.emergency_phone = 'El teléfono de emergencia es requerido';
    } else if (!validatePhone(formData.emergency_phone)) {
      newErrors.emergency_phone = 'Ingresa un teléfono válido';
    }

    // Validar email requerido
    if (!formData.emergency_email.trim()) {
      newErrors.emergency_email = 'El email es obligatorio';
    }
    // Validar formato SOLO si sí hay contenido
    else if (!validateEmail(formData.emergency_email)) {
      newErrors.emergency_email = 'Ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorSection =
        errors.name || errors.breed
          ? 'basic'
          : errors.emergency_phone || errors.emergency_email
            ? 'emergency'
            : 'basic';

      setActiveSection(firstErrorSection);
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
        const { updatePet } = petService;
        const updatedData = await updatePet(actualPetId!, dataToSubmit);

        if (updatedData) {
          navigate(`/pet/${updatedData.qr_code}`);
        }
      } else {
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
    <div className="max-w-2xl mx-auto w-full h-full sm:h-fit sm:max-h-[800px] overflow-auto my-0 sm:my-8">
      <Card className="p-4 sm:p-8 rounded-none sm:rounded-lg pb-24 sm:pb-8 sm:bg-white dark:sm:bg-gray-800 sm:border sm:border-gray-200 dark:sm:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEditMode ? 'Editar mascota' : 'Registra tu mascota'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {isEditMode
            ? 'Actualiza la información de tu mascota'
            : 'Completa la información de tu mascota para crear su perfil QR'}
        </p>

        {/* Navegación por pestañas */}
        <div className="flex overflow-x-auto overflow-hidden mb-8 border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 sm:mx-0 sm:px-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
              className={`px-4 py-3 font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          {activeSection === 'basic' && (
            <div className="space-y-6 animate-fadeIn">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Especie *
                  </label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                  >
                    {PET_SPECIES.map((species) => (
                      <option key={species} value={species}>
                        {species}
                      </option>
                    ))}
                  </select>
                </div>

                {showCustomBreed ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Raza personalizada *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="breed"
                        placeholder="Escribe la raza"
                        value={formData.breed}
                        onChange={handleInputChange}
                        className={`flex-1 rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
                          errors.breed
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomBreed(false);
                          setFormData((prev) => ({ ...prev, breed: '' }));
                        }}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Volver
                      </button>
                    </div>
                    {errors.breed && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.breed}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Raza *
                    </label>
                    <select
                      name="breed"
                      value={formData.breed}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
                        errors.breed
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Selecciona una raza</option>
                      {availableBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                    </select>
                    {errors.breed && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.breed}
                      </p>
                    )}
                  </div>
                )}

                <Input
                  label="Color"
                  name="color"
                  placeholder="Ej: Negro, Café y blanco"
                  value={formData.color}
                  onChange={handleInputChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Tamaño
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
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
                  className="w-[95%] sm:w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Descripción general
                </label>
                <textarea
                  name="description"
                  placeholder="Describe a tu mascota: apariencia, comportamiento general..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>
            </div>
          )}

          {/* Salud */}
          {activeSection === 'health' && (
            <div className="space-y-6 animate-fadeIn">
              <MultiSelect
                label="Personalidad (selecciona varias opciones)"
                options={PERSONALITY_OPTIONS}
                selected={selectedPersonalities}
                onChange={setSelectedPersonalities}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Alergias
                </label>
                <textarea
                  name="allergies"
                  placeholder="Lista las alergias conocidas (alimentos, medicamentos, etc.)"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Medicamentos
                </label>
                <textarea
                  name="medications"
                  placeholder="Medicamentos que toma regularmente, dosis y frecuencia"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Enfermedades o condiciones médicas
                </label>
                <textarea
                  name="diseases"
                  placeholder="Enfermedades crónicas o condiciones médicas"
                  value={formData.diseases}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Recomendaciones de cuidado
                </label>
                <textarea
                  name="care_recommendations"
                  placeholder="Cuidados especiales, rutinas, alimentación..."
                  value={formData.care_recommendations}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>
            </div>
          )}

          {/* Emergencia */}
          {activeSection === 'emergency' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Importante:</strong> Esta información será visible en
                  el QR para que puedan contactarte si encuentran a tu mascota.
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
                  error={errors.emergency_email}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Instrucciones de recuperación
                </label>
                <textarea
                  name="recovery_instructions"
                  placeholder="Instrucciones sobre qué hacer si encuentran a tu mascota..."
                  value={formData.recovery_instructions}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
              </div>
            </div>
          )}

          {/* Fotos */}
          {activeSection === 'photos' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 dark:bg-red-600 p-1 text-white transition-colors hover:bg-red-600 dark:hover:bg-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 py-12 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Upload className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subir foto principal
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
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

              {/* ⬇️ NUEVO: Usar el componente MultiPhotoUploader */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Fotos adicionales (máximo 5)
                </label>
                <MultiPhotoUploader
                  photos={previews.extra_photos}
                  maxPhotos={5}
                  maxSizeMB={5}
                  onPhotosChange={handleExtraPhotosChange}
                  error={errors.extra_photos}
                  onError={handleExtraPhotosError}
                />
              </div>
            </div>
          )}

          {/* Redes Sociales */}
          {activeSection === 'social' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Opcional:</strong> Agrega tus redes sociales para que
                  puedan identificarte como el dueño de la mascota.
                </p>
              </div>

              <Input
                label="Instagram"
                name="instagram"
                placeholder="@usuario"
                value={formData.instagram}
                onChange={handleInputChange}
              />

              <Input
                label="Facebook"
                name="facebook"
                placeholder="facebook.com/perfil"
                value={formData.facebook}
                onChange={handleInputChange}
              />

              <Input
                label="TikTok"
                name="tiktok"
                placeholder="@usuario"
                value={formData.tiktok}
                onChange={handleInputChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Otros enlaces
                </label>

                {formData.other_links.map((link, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nombre (ej: Twitter)"
                      value={link.name}
                      onChange={(e) =>
                        updateOtherLink(index, 'name', e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateOtherLink(index, 'url', e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherLink(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addOtherLink}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-all hover:gap-3"
                >
                  <Plus className="h-4 w-4" />
                  Agregar enlace
                </button>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-12 sm:pb-0 border-t border-gray-200 dark:border-gray-700">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading
                ? 'Guardando...'
                : isEditMode
                  ? 'Actualizar mascota'
                  : 'Crear mascota'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() =>
                closeModal ? closeModal(false) : window.history.back()
              }
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {isEditMode ? 'Actualizando...' : 'Creando perfil...'}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PetForm;
