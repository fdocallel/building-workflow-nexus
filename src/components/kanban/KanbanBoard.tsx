
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { Tables } from '@/integrations/supabase/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { useToast } from '@/hooks/use-toast';

type Edificio = Tables<'edificio'>;
type WorkflowState = 'Procesos' | 'Mechanical' | 'Estructuras' | 'Geotecnia' | 'Coordinación' | 'Completado';

const WORKFLOW_STATES: WorkflowState[] = [
  'Procesos',
  'Mechanical', 
  'Estructuras',
  'Geotecnia',
  'Coordinación',
  'Completado'
];

const NEXT_ROLE_MAP: Record<WorkflowState, string | null> = {
  'Procesos': 'mechanical',
  'Mechanical': 'estructuras',
  'Estructuras': 'geotecnia', 
  'Geotecnia': 'coordinacion',
  'Coordinación': null,
  'Completado': null
};

export function KanbanBoard() {
  const { data: userRole } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: edificios, isLoading } = useQuery({
    queryKey: ['edificios-kanban'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('edificio')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Edificio[];
    },
  });

  const updateEstadoMutation = useMutation({
    mutationFn: async ({ id, newEstado, codigo }: { id: number; newEstado: WorkflowState; codigo: string }) => {
      const { error } = await supabase
        .from('edificio')
        .update({ 
          estado: newEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Enviar webhook a Slack
      try {
        await fetch('/api/slack-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ codigo, estado: newEstado }),
        });
      } catch (webhookError) {
        console.error('Error sending Slack webhook:', webhookError);
        // No fallar la operación si el webhook falla
      }
    },
    onSuccess: (_, { newEstado }) => {
      queryClient.invalidateQueries({ queryKey: ['edificios-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['edificios'] });
      
      const nextRole = NEXT_ROLE_MAP[newEstado];
      if (nextRole) {
        toast({
          title: "Estado actualizado",
          description: `El edificio ha pasado a ${newEstado}. Se ha notificado al equipo de ${nextRole}.`,
        });
      } else {
        toast({
          title: "Estado actualizado",
          description: `El edificio ha pasado a ${newEstado}.`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del edificio.",
        variant: "destructive",
      });
      console.error('Error updating estado:', error);
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const edificioId = parseInt(active.id as string);
    const newEstado = over.id as WorkflowState;
    const edificio = edificios?.find(e => e.id === edificioId);
    
    if (edificio) {
      updateEstadoMutation.mutate({ 
        id: edificioId, 
        newEstado, 
        codigo: edificio.Code 
      });
    }
  };

  const activeEdificio = activeId ? edificios?.find(e => e.id.toString() === activeId) : null;

  if (isLoading) {
    return <div className="p-4">Cargando vista Kanban...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vista Kanban - Edificios</h2>
        {userRole && (
          <div className="text-sm text-muted-foreground">
            Rol actual: {userRole}
          </div>
        )}
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-6 gap-4 min-h-96">
          {WORKFLOW_STATES.map((estado) => {
            const columnEdificios = edificios?.filter(e => e.estado === estado) || [];
            
            return (
              <KanbanColumn
                key={estado}
                id={estado}
                title={estado}
                edificios={columnEdificios}
                userRole={userRole}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeEdificio && (
            <KanbanCard edificio={activeEdificio} isDragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
