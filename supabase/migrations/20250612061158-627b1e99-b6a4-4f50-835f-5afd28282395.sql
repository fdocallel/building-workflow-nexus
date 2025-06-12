
-- Crear el rol manager
CREATE ROLE manager;

-- Conceder permisos de conexión
GRANT CONNECT ON DATABASE postgres TO manager;
GRANT USAGE ON SCHEMA public TO manager;

-- Conceder permisos sobre todas las tablas existentes y futuras
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO manager;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO manager;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO manager;

-- Asegurar permisos para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO manager;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO manager;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO manager;

-- Habilitar RLS en todas las tablas (si no está ya habilitado)
ALTER TABLE public.edificio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Crear políticas para el rol manager en la tabla edificio
CREATE POLICY "Manager has full access to edificio"
ON public.edificio
FOR ALL
TO manager
USING (true)
WITH CHECK (true);

-- Crear políticas para el rol manager en la tabla user_roles
CREATE POLICY "Manager has full access to user_roles"
ON public.user_roles
FOR ALL
TO manager
USING (true)
WITH CHECK (true);

-- Permitir que el rol manager pueda cambiar a otros roles si es necesario
GRANT manager TO authenticator;
