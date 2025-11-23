// components/MultiPhotoUploader.tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Plus } from 'lucide-react';

interface MultiPhotoUploaderProps {
  photos: string[]; // Array de URLs en base64
  maxPhotos?: number;
  maxSizeMB?: number;
  onPhotosChange: (photos: string[]) => void;
  error?: string;
  onError?: (error: string) => void;
}

const MultiPhotoUploader: React.FC<MultiPhotoUploaderProps> = ({
  photos,
  maxPhotos = 5,
  maxSizeMB = 5,
  onPhotosChange,
  error,
  onError,
}) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
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

  // Manejador de drop
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Limpiar error previo
      if (onError) onError('');

      // Verificar si hay archivos rechazados
      if (rejectedFiles.length > 0) {
        const errorMessage = rejectedFiles[0].errors[0].message;
        if (onError) onError(errorMessage);
        return;
      }

      // Calcular cuántas fotos se pueden agregar
      const remainingSlots = maxPhotos - photos.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);

      // Advertencia si se intentan subir más fotos
      if (acceptedFiles.length > remainingSlots) {
        if (onError) {
          onError(
            `Solo puedes agregar ${remainingSlots} foto(s) más. Máximo ${maxPhotos} fotos.`
          );
        }
      }

      // Procesar archivos secuencialmente
      const newPhotos: string[] = [];

      for (const file of filesToAdd) {
        try {
          const base64 = await fileToBase64(file);
          newPhotos.push(base64);
        } catch (err) {
          console.error('Error al procesar imagen:', err);
          if (onError) {
            onError('Error al procesar una o más imágenes. Intenta de nuevo.');
          }
          return;
        }
      }

      // Actualizar el estado con todas las fotos
      onPhotosChange([...photos, ...newPhotos]);
    },
    [photos, maxPhotos, onPhotosChange, onError]
  );

  // Configuración de react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxSize: maxSizeBytes,
    maxFiles: maxPhotos - photos.length,
    disabled: photos.length >= maxPhotos,
  });

  // Eliminar foto
  const removePhoto = (indexToRemove: number) => {
    const updatedPhotos = photos.filter((_, index) => index !== indexToRemove);
    onPhotosChange(updatedPhotos);
    if (onError) onError('');
  };

  return (
    <div className="space-y-4">
      {/* Grid de fotos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                className="h-32 w-full rounded-lg object-cover shadow-sm"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white 
                  transition-all hover:bg-red-600 hover:scale-110 shadow-lg
                  opacity-0 group-hover:opacity-100 sm:opacity-100"
                aria-label={`Eliminar foto ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Área de drop */}
      {photos.length < maxPhotos && (
        <div
          {...getRootProps()}
          className={`
            cursor-pointer rounded-lg border-2 border-dashed p-8 text-center 
            transition-all duration-200
            ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }
            ${photos.length >= maxPhotos ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} capture="environment" />
          <Plus
            className={`mx-auto mb-2 h-8 w-8 transition-colors ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragActive
              ? '¡Suelta las fotos aquí!'
              : 'Arrastra fotos o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-500">
            {photos.length}/{maxPhotos} fotos • Máx {maxSizeMB}MB cada una
          </p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiPhotoUploader;
