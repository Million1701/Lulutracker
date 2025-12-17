import { QrCode, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PetFormData } from '../types';
import { Link } from 'react-router-dom';
import PetForm from './PetForm';
import { petService } from '../services/petService';
import Button from './ui/Button';

interface PetCardProps {
  pet: PetFormData;
  onEdit?: (pet: PetFormData) => void;
  onDelete?: (petId: string) => void;
  onViewQR?: (pet: PetFormData) => void;
}

const PetCard = ({ pet }: PetCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMenu, setIsEditMenu] = useState(false);
  const [isDeletePet, setIsDeletePet] = useState(false);

  useEffect(() => {
    if (isEditMenu) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isEditMenu]);

  const { deletePet } = petService;

  return (
    <>
      <div
        key={pet.qr_code}
        className="relative w-full h-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-2xl transition-all duration-300"
      >
        {/* Imagen de fondo con degradado */}
        <div className="absolute inset-0">
          {pet.photo_1_url ? (
            <img
              src={pet.photo_1_url}
              alt={pet.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 text-8xl">
              🐾
            </div>
          )}
          {/* Degradado oscuro para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          {/* Degradado adicional en la parte inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Contenido */}
        <div className="relative h-full flex flex-col  justify-between p-4">
          {/* QR en esquina superior derecha */}
          <div className="flex justify-end">
            <Link
              to={`/dashboard/new-pet/qr_success?qr=${pet.qr_code}`}
              className="rounded-full bg-white/95 backdrop-blur-sm p-2.5 shadow-lg transition-all hover:bg-white hover:scale-110"
              title="Ver QR"
            >
              <QrCode className="h-6 w-6 text-gray-800" />
            </Link>
          </div>

          {/* Información en esquina inferior izquierda */}
          <div className="flex">
            <div className="space-y-1">
              <Link to={`/pet/${pet.qr_code}`}>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg hover:underline">
                  {pet.name}
                </h3>
              </Link>

              <div className="flex items-center gap-3 text-white/90 drop-shadow-md">
                <span className="text-lg font-medium">{pet.species}</span>
                {pet.breed && (
                  <>
                    <span className="text-white/60">•</span>
                    <span className="text-base">{pet.breed}</span>
                  </>
                )}
              </div>
              {pet.color && (
                <p className="text-sm text-white/80 drop-shadow-md">
                  <span className="text-base">{pet.color}</span>
                </p>
              )}
            </div>
          </div>

          <div className="absolute right-0 bottom-0 p-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
                title="Opciones"
              >
                <MoreHorizontal className="h-6 w-6 text-gray-800" />
              </button>

              {/* Panel desplegable */}
              {isMenuOpen && (
                <div className="absolute right-0 top-[-110px] mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                  <button
                    className="text-sm font-medium flex w-full gap-2 items-center py-3 px-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    onClick={() => setIsEditMenu(true)}
                  >
                    <Edit2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Editar
                  </button>
                  <button
                    onClick={() => setIsDeletePet(true)}
                    className="text-sm font-medium flex w-full gap-2 items-center py-3 px-3 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditMenu ? (
        <div className="fixed z-50 w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center">
          <PetForm
            mode="edit"
            initialData={pet}
            key={pet.id}
            closeModal={setIsEditMenu}
          />
        </div>
      ) : (
        <></>
      )}

      {isDeletePet && pet.id ? (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-sm shadow-lg">
            <p className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
              ¿Deseas eliminar <span className="font-bold">{pet.name}</span>?
            </p>

            <div className="flex items-center justify-center gap-3 mt-2">
              <Button
                type="button"
                className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
                onClick={() => pet?.id && deletePet(pet.id)}
              >
                Eliminar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDeletePet(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PetCard;
