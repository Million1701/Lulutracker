-- Agregar campo status a la tabla pets
ALTER TABLE pets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'lost', 'found'));

-- Crear tabla location_reports
CREATE TABLE IF NOT EXISTS location_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  address TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_location_reports_pet_id ON location_reports(pet_id);
CREATE INDEX IF NOT EXISTS idx_location_reports_status ON location_reports(status);
CREATE INDEX IF NOT EXISTS idx_location_reports_reported_at ON location_reports(reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_pets_status ON pets(status);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en location_reports
DROP TRIGGER IF EXISTS update_location_reports_updated_at ON location_reports;
CREATE TRIGGER update_location_reports_updated_at
  BEFORE UPDATE ON location_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

-- Habilitar RLS
ALTER TABLE location_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Cualquiera puede insertar reportes (para personas que encuentran mascotas perdidas)
CREATE POLICY "Anyone can insert location reports"
  ON location_reports
  FOR INSERT
  WITH CHECK (true);

-- Policy: Los dueños pueden ver sus propios reportes
CREATE POLICY "Owners can view their pet location reports"
  ON location_reports
  FOR SELECT
  USING (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );

-- Policy: Los dueños pueden actualizar sus propios reportes
CREATE POLICY "Owners can update their pet location reports"
  ON location_reports
  FOR UPDATE
  USING (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );

-- Policy: Los dueños pueden eliminar sus propios reportes
CREATE POLICY "Owners can delete their pet location reports"
  ON location_reports
  FOR DELETE
  USING (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );

-- Comentarios descriptivos
COMMENT ON TABLE location_reports IS 'Almacena reportes de ubicación de mascotas perdidas';
COMMENT ON COLUMN location_reports.pet_id IS 'ID de la mascota reportada';
COMMENT ON COLUMN location_reports.latitude IS 'Latitud de la ubicación reportada';
COMMENT ON COLUMN location_reports.longitude IS 'Longitud de la ubicación reportada';
COMMENT ON COLUMN location_reports.accuracy IS 'Precisión del GPS en metros';
COMMENT ON COLUMN location_reports.address IS 'Dirección obtenida por geocoding inverso';
COMMENT ON COLUMN location_reports.status IS 'Estado del reporte: pending, verified, dismissed';
COMMENT ON COLUMN pets.status IS 'Estado de la mascota: normal, lost, found';
