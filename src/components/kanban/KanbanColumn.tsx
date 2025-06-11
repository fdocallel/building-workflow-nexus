
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Tables } from '@/integrations/supabase/types';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';

type Edificio = Tables<'edificio'>;

interface KanbanColumnProps {
  id: string;
  title: string;
  edificios: Edificio[];
  userRole?: string | null;
}

export function KanbanColumn({ id, title, edificios, userRole }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const canDrop = userRole === 'coordinacion' || 
    (userRole === 'procesos' && title === 'Procesos') ||
    (userRole === 'mechanical' && title === 'Mechanical') ||
    (userRole === 'estructuras' && title === 'Estructuras') ||
    (userRole === 'geotecnia' && title === 'Geotecnia');

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/50 rounded-lg p-4 min-h-96",
        isOver && canDrop && "bg-primary/10 ring-2 ring-primary",
        isOver && !canDrop && "bg-destructive/10 ring-2 ring-destructive"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs bg-muted px-2 py-1 rounded">
          {edificios.length}
        </span>
      </div>

      <SortableContext items={edificios.map(e => e.id.toString())} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {edificios.map((edificio) => (
            <KanbanCard 
              key={edificio.id} 
              edificio={edificio} 
              canDrag={canDrop}
            />
          ))}
        </div>
      </SortableContext>

      {edificios.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          No hay edificios en esta fase
        </div>
      )}
    </div>
  );
}
