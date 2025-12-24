import { QrCode, Edit2, Trash2, MoreVertical, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PetFormData } from '../types';
import { Link } from 'react-router-dom';
import PetForm from './PetForm';
import { petService } from '../services/petService';
import Button from './ui/Button';
import { useClickOutside } from '../hooks/useClickOutside';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PetCardProps {
  pet: PetFormData;
  onEdit?: (pet: PetFormData) => void;
  onDelete?: (petId: string) => void;
  onViewQR?: (pet: PetFormData) => void;
}

/**
 * PetCard moderno con glassmorphism, animaciones y diseño premium
 */
const PetCard = ({ pet }: PetCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMenu, setIsEditMenu] = useState(false);
  const [isDeletePet, setIsDeletePet] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const menuRef = useClickOutside<HTMLDivElement>(() => setIsMenuOpen(false), isMenuOpen);

  useEffect(() => {
    if (isEditMenu) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isEditMenu]);

  const { deletePet } = petService;

  const handleDelete = async () => {
    if (pet?.id) {
      await deletePet(pet.id);
      // Recargar la página después de eliminar
      window.location.reload();
    }
  };

  return (
    <>
      <motion.div
        className="relative w-full h-72 rounded-2xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          {pet.photo_1_url ? (
            <motion.img
              src={pet.photo_1_url}
              alt={pet.name}
              className="h-full w-full object-cover"
              animate={
                prefersReducedMotion || !isHovered
                  ? {}
                  : { scale: 1.1 }
              }
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 via-purple-400 to-pink-400 animate-gradient-xy bg-300% text-8xl">
              🐾
            </div>
          )}

          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />

          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-purple-500/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Contenido */}
        <div className="relative h-full flex flex-col justify-between p-5">
          {/* Header con QR y Heart */}
          <div className="flex justify-between items-start">
            {/* Heart icon */}
            <motion.button
              className="glass p-2.5 rounded-full group/heart"
              whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
            >
              <Heart className="w-5 h-5 text-white group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-all duration-300" />
            </motion.button>

            {/* QR Button */}
            <Link to={`/dashboard/new-pet/qr_success?qr=${pet.qr_code}`}>
              <motion.div
                className="glass p-2.5 rounded-full"
                whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              >
                <QrCode className="w-5 h-5 text-white" />
              </motion.div>
            </Link>
          </div>

          {/* Información de la mascota */}
          <div className="space-y-3">
            <Link to={`/pet/${pet.qr_code}`}>
              <motion.h3
                className="text-3xl font-bold text-white drop-shadow-2xl hover:text-primary-300 transition-colors"
                whileHover={prefersReducedMotion ? {} : { x: 5 }}
              >
                {pet.name}
              </motion.h3>
            </Link>

            <div className="flex items-center gap-3">
              <span className="glass px-3 py-1 rounded-full text-sm font-medium text-white">
                {pet.species}
              </span>
              {pet.breed && (
                <span className="glass px-3 py-1 rounded-full text-sm text-white/90">
                  {pet.breed}
                </span>
              )}
            </div>

            {pet.color && (
              <p className="text-sm text-white/80 drop-shadow-lg flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: pet.color.toLowerCase() }} />
                {pet.color}
              </p>
            )}

            {/* Botón de opciones */}
            <div className="absolute bottom-5 right-5" ref={menuRef}>
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass p-2.5 rounded-full relative z-10"
                whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 90 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              >
                <MoreVertical className="w-5 h-5 text-white" />
              </motion.button>

              {/* Menú desplegable */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    className="absolute bottom-full right-0 mb-2 w-44 glass-strong rounded-xl overflow-hidden shadow-2xl border border-white/10"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary-500/30 transition-colors"
                      onClick={() => {
                        setIsEditMenu(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setIsDeletePet(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Borde con gradiente animado en hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          style={{
            background: 'linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </motion.div>

      {/* Modal de edición */}
      <AnimatePresence>
        {isEditMenu && (
          <motion.div
            className="fixed z-50 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PetForm
                mode="edit"
                initialData={pet}
                key={pet.id}
                closeModal={setIsEditMenu}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {isDeletePet && pet.id && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                ¿Eliminar a {pet.name}?
              </h3>
              <p className="text-center text-gray-300 mb-6">
                Esta acción no se puede deshacer. Se eliminará toda la información de la mascota.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDeletePet(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PetCard;
