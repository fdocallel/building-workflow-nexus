
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CreateFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateForm({ onClose, onSuccess }: CreateFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    Code: '',
    nombre: '',
    proyecto: '',
    num_edificios: 1,
    tipologia: '',
    equipamiento: '{}',
    analisis_estructural: '{}'
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Parse JSON fields
      let equipamiento = {};
      let analisis_estructural = {};

      try {
        equipamiento = data.equipamiento ? JSON.parse(data.equipamiento) : {};
      } catch (error) {
        throw new Error('El formato del equipamiento no es JSON válido');
      }

      try {
        analisis_estructural = data.analisis_estructural ? JSON.parse(data.analisis_estructural) : {};
      } catch (error) {
        throw new Error('El formato del análisis estructural no es JSON válido');
      }

      const insertData = {
        Code: data.Code,
        nombre: data.nombre,
        proyecto: data.proyecto,
        num_edificios: data.num_edificios,
        tipologia: data.tipologia || null,
        equipamiento: Object.keys(equipamiento).length > 0 ? equipamiento : null,
        analisis_estructural: Object.keys(analisis_estructural).length > 0 ? analisis_estructural : null,
        estado: 'Procesos' as const
      };

      const { error } = await supabase
        .from('edificio')
        .insert([insertData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edificios'] });
      queryClient.invalidateQueries({ queryKey: ['edificios-kanban'] });
      toast({
        title: "Edificio creado",
        description: "El nuevo edificio se ha creado correctamente.",
      });
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el edificio.",
        variant: "destructive",
      });
      console.error('Error creating edificio:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!formData.Code.trim()) {
      toast({
        title: "Error",
        description: "El código es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.proyecto.trim()) {
      toast({
        title: "Error",
        description: "El proyecto es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    if (formData.num_edificios < 1) {
      toast({
        title: "Error",
        description: "El número de edificios debe ser al menos 1.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.tipologia.trim()) {
      toast({
        title: "Error",
        description: "La tipología es obligatoria.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Edificio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="Code">Código *</Label>
            <Input
              id="Code"
              type="text"
              value={formData.Code}
              onChange={(e) => setFormData({...formData, Code: e.target.value})}
              placeholder="Ingrese el código del edificio"
              required
            />
          </div>

          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ingrese el nombre del edificio"
              required
            />
          </div>

          <div>
            <Label htmlFor="proyecto">Proyecto *</Label>
            <Input
              id="proyecto"
              type="text"
              value={formData.proyecto}
              onChange={(e) => setFormData({...formData, proyecto: e.target.value})}
              placeholder="Ingrese el nombre del proyecto"
              required
            />
          </div>

          <div>
            <Label htmlFor="num_edificios">Número de Edificios *</Label>
            <Input
              id="num_edificios"
              type="number"
              min="1"
              value={formData.num_edificios}
              onChange={(e) => setFormData({...formData, num_edificios: parseInt(e.target.value) || 1})}
              required
            />
          </div>

          <div>
            <Label htmlFor="tipologia">Tipología *</Label>
            <Select 
              value={formData.tipologia} 
              onValueChange={(value) => setFormData({...formData, tipologia: value})}
              required
            >
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

          <div>
            <Label htmlFor="equipamiento">Equipamiento (JSON opcional)</Label>
            <Textarea
              id="equipamiento"
              value={formData.equipamiento}
              onChange={(e) => setFormData({...formData, equipamiento: e.target.value})}
              rows={4}
              placeholder='{"hvac": "Central", "elevadores": 2}'
            />
          </div>

          <div>
            <Label htmlFor="analisis_estructural">Análisis Estructural (JSON opcional)</Label>
            <Textarea
              id="analisis_estructural"
              value={formData.analisis_estructural}
              onChange={(e) => setFormData({...formData, analisis_estructural: e.target.value})}
              rows={4}
              placeholder='{"cimientos": "Pilotes", "estructura": "Hormigón armado"}'
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creando...' : 'Crear Edificio'}
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
