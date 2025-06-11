
-- Crear el tipo enum para los roles de la aplicación
CREATE TYPE app_role AS ENUM ('procesos', 'mechanical', 'estructuras', 'geotecnia', 'coordinacion');

-- Crear tabla para los roles de usuario
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Habilitar RLS en la tabla user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función de seguridad para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Función para obtener el rol actual del usuario
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- Habilitar RLS en la tabla edificio
ALTER TABLE public.edificio ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: cada rol solo puede ver registros en su fase + coordinacion ve todo
CREATE POLICY "Users can view records in their phase"
ON public.edificio
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'coordinacion'::app_role) OR
  (estado::text = public.get_current_user_role()::text)
);

-- Política para INSERT: rol procesos puede crear nuevos registros
CREATE POLICY "Procesos role can insert new records"
ON public.edificio
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'procesos'::app_role)
);

-- Política para UPDATE: cada rol puede actualizar solo sus campos específicos en su fase
CREATE POLICY "Procesos can update num_edificios and tipologia"
ON public.edificio
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'procesos'::app_role) AND
  estado = 'Procesos'::workflow_state
)
WITH CHECK (
  public.has_role(auth.uid(), 'procesos'::app_role) AND
  estado = 'Procesos'::workflow_state
);

CREATE POLICY "Mechanical can update equipamiento"
ON public.edificio
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'mechanical'::app_role) AND
  estado = 'Mechanical'::workflow_state
)
WITH CHECK (
  public.has_role(auth.uid(), 'mechanical'::app_role) AND
  estado = 'Mechanical'::workflow_state
);

CREATE POLICY "Estructuras can update analisis_estructural"
ON public.edificio
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'estructuras'::app_role) AND
  estado = 'Estructuras'::workflow_state
)
WITH CHECK (
  public.has_role(auth.uid(), 'estructuras'::app_role) AND
  estado = 'Estructuras'::workflow_state
);

-- Política especial para coordinación: puede actualizar cualquier campo
CREATE POLICY "Coordinacion can update all fields"
ON public.edificio
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'coordinacion'::app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'coordinacion'::app_role)
);

-- Política para DELETE: solo coordinación puede eliminar
CREATE POLICY "Only coordinacion can delete records"
ON public.edificio
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'coordinacion'::app_role)
);

-- Políticas para la tabla user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Only coordinacion can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'coordinacion'::app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'coordinacion'::app_role)
);
