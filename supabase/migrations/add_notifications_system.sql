-- ==========================================
-- SISTEMA DE NOTIFICACIONES EN TIEMPO REAL
-- ==========================================

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  location_report_id UUID REFERENCES location_reports(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'location_report',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para optimizar queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Los usuarios pueden actualizar (marcar como leída) sus propias notificaciones
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- Los usuarios pueden eliminar sus propias notificaciones
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  USING (user_id = auth.uid());

-- ==========================================
-- Trigger para crear notificación automáticamente
-- ==========================================

-- Función que se ejecuta cuando se inserta un location_report
CREATE OR REPLACE FUNCTION create_location_notification()
RETURNS TRIGGER AS $$
DECLARE
  pet_name TEXT;
  pet_owner_id UUID;
BEGIN
  -- Obtener información de la mascota
  SELECT name, user_id
  INTO pet_name, pet_owner_id
  FROM pets
  WHERE id = NEW.pet_id;

  -- Solo crear notificación si encontramos la mascota y tiene dueño
  IF pet_owner_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id,
      pet_id,
      location_report_id,
      type,
      title,
      message
    ) VALUES (
      pet_owner_id,
      NEW.pet_id,
      NEW.id,
      'location_report',
      '🐾 Nueva ubicación reportada',
      'Alguien ha reportado ver a ' || COALESCE(pet_name, 'tu mascota') || ' en una ubicación'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger que se activa DESPUÉS de insertar un location_report
DROP TRIGGER IF EXISTS on_location_report_created ON location_reports;
CREATE TRIGGER on_location_report_created
  AFTER INSERT ON location_reports
  FOR EACH ROW
  EXECUTE FUNCTION create_location_notification();

-- ==========================================
-- Función para marcar todas las notificaciones como leídas
-- ==========================================

CREATE OR REPLACE FUNCTION mark_all_notifications_as_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE notifications
  SET read = TRUE
  WHERE user_id = p_user_id AND read = FALSE;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Comentarios descriptivos
-- ==========================================

COMMENT ON TABLE notifications IS 'Almacena notificaciones para los usuarios del sistema';
COMMENT ON COLUMN notifications.user_id IS 'ID del usuario que recibirá la notificación';
COMMENT ON COLUMN notifications.pet_id IS 'ID de la mascota relacionada (si aplica)';
COMMENT ON COLUMN notifications.location_report_id IS 'ID del reporte de ubicación relacionado (si aplica)';
COMMENT ON COLUMN notifications.type IS 'Tipo de notificación: location_report, pet_status_change, etc.';
COMMENT ON COLUMN notifications.title IS 'Título de la notificación';
COMMENT ON COLUMN notifications.message IS 'Mensaje descriptivo de la notificación';
COMMENT ON COLUMN notifications.read IS 'Indica si la notificación ha sido leída';
COMMENT ON COLUMN notifications.created_at IS 'Fecha y hora de creación de la notificación';

-- ==========================================
-- Habilitar Realtime para notificaciones
-- ==========================================

-- Nota: Esto debe ejecutarse en el dashboard de Supabase:
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
