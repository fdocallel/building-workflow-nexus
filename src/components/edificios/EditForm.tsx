
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type Edificio = Tables<'edificio'>;

interface EditFormProps {
  edificio: Edificio;
  onClose: () => void;
}

export function EditForm({ edificio, onClose }: EditFormProps) {
  const { data: userRole } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    num_edificios: edificio.num_edificios || 0,
    tipologia: edificio.tipologia || '',
    equipamiento: edificio.equipamiento || {},
    analisis_estructural: edificio.analisis_estructural || {}
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Edificio>) => {
      const { error } = await supabase
        .from('edificio')
        .update(data)
        .eq('id', edificio.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edificios'] });
      queryClient.invalidateQueries({ queryKey: ['edificios-kanban'] });
      toast({
        title: "Edificio actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el edificio.",
        variant: "destructive",
      });
      console.error('Error updating edificio:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let updateData: Partial<Edificio> = {};

    // Manager tiene permisos completos
    if (userRole === 'manager') {
      updateData = {
        num_edificios: formData.num_edificios,
        tipologia: formData.tipologia,
        equipamiento: formData.equipamiento,
        analisis_estructural: formData.analisis_estructural
      };
    } else if (edificio.estado === 'Procesos' && userRole === 'procesos') {
      updateData = {
        num_edificios: formData.num_edificios,
        tipologia: formData.tipologia
      };
    } else if (edificio.estado === 'Mechanical' && userRole === 'mechanical') {
      updateData = {
        equipamiento: formData.equipamiento
      };
    } else if (edificio.estado === 'Estructuras' && userRole === 'estructuras') {
      updateData = {
        analisis_estructural: formData.analisis_estructural
      };
    }

    updateMutation.mutate(updateData);
  };

  const canEdit = () => {
    return userRole === 'manager' ||
           userRole === 'coordinacion' ||
           (edificio.estado === 'Procesos' && userRole === 'procesos') ||
           (edificio.estado === 'Mechanical' && userRole === 'mechanical') ||
           (edificio.estado === 'Estructuras' && userRole === 'estructuras');
  };

  if (!canEdit()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin permisos de edición</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No tienes permisos para editar este edificio en su estado actual.</p>
          <Button onClick={onClose} className="mt-4">Cerrar</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Edificio - {edificio.Code}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(userRole === 'manager' || (edificio.estado === 'Procesos' && userRole === 'procesos')) && (
            <>
              <div>
                <Label htmlFor="num_edificios">Número de Edificios</Label>
                <Input
                  id="num_edificios"
                  type="number"
                  value={formData.num_edificios}
                  onChange={(e) => setFormData({...formData, num_edificios: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="tipologia">Tipología</Label>
                <Select value={formData.tipologia} onValueChange={(value) => setFormData({...formData, tipologia: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipología" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residencial">Residencial</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Oficinas">Oficinas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {(userRole === 'manager' || (edificio.estado === 'Mechanical' && userRole === 'mechanical')) && (
            <div>
              <Label htmlFor="equipamiento">Equipamiento (JSON)</Label>
              <Textarea
                id="equipamiento"
                value={JSON.stringify(formData.equipamiento, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, equipamiento: parsed});
                  } catch (error) {
                    // Invalid JSON, keep the text for editing
                  }
                }}
                rows={6}
                placeholder='{"hvac": "Central", "elevadores": 2}'
              />
            </div>
          )}

          {(userRole === 'manager' || (edificio.estado === 'Estructuras' && userRole === 'estructuras')) && (
            <div>
              <Label htmlFor="analisis_estructural">Análisis Estructural (JSON)</Label>
              <Textarea
                id="analisis_estructural"
                value={JSON.stringify(formData.analisis_estructural, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, analisis_estructural: parsed});
                  } catch (error) {
                    // Invalid JSON, keep the text for editing
                  }
                }}
                rows={6}
                placeholder='{"cimientos": "Pilotes", "estructura": "Hormigón armado"}'
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
