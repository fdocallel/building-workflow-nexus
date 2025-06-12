
-- Agregar columna para tracking de tiempo de creación
ALTER TABLE public.edificio ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Actualizar registros existentes con la fecha actual si no tienen created_at
UPDATE public.edificio SET created_at = now() WHERE created_at IS NULL;

-- Hacer la columna no nullable
ALTER TABLE public.edificio ALTER COLUMN created_at SET NOT NULL;
