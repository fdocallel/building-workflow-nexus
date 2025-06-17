
-- Eliminar la política existente que no incluye manager
DROP POLICY IF EXISTS "Users can view records in their phase" ON public.edificio;

-- Crear nueva política que incluye el rol manager
CREATE POLICY "Users can view records in their phase or managers see all"
ON public.edificio
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'manager'::app_role) OR
  public.has_role(auth.uid(), 'coordinacion'::app_role) OR
  (estado::text = public.get_current_user_role()::text)
);

-- También actualizar la política de UPDATE para incluir manager
DROP POLICY IF EXISTS "Coordinacion can update all fields" ON public.edificio;

CREATE POLICY "Manager and Coordinacion can update all fields"
ON public.edificio
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'manager'::app_role) OR
  public.has_role(auth.uid(), 'coordinacion'::app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'manager'::app_role) OR
  public.has_role(auth.uid(), 'coordinacion'::app_role)
);

-- Actualizar política de DELETE para incluir manager
DROP POLICY IF EXISTS "Only coordinacion can delete records" ON public.edificio;

CREATE POLICY "Manager and coordinacion can delete records"
ON public.edificio
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'manager'::app_role) OR
  public.has_role(auth.uid(), 'coordinacion'::app_role)
);
