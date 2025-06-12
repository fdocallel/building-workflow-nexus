
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

type Edificio = Tables<'edificio'>;

interface KanbanCardProps {
  edificio: Edificio;
  isDragging?: boolean;
  canDrag?: boolean;
}

export function KanbanCard({ edificio, isDragging = false, canDrag = true }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: edificio.id.toString(),
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        (isDragging || isSortableDragging) && "opacity-50",
        !canDrag && "cursor-not-allowed opacity-75"
      )}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {edificio.Code}
              </span>
              {canDrag && <GripVertical className="h-3 w-3 text-muted-foreground" />}
            </div>
            
            <h4 className="font-medium text-sm mb-1 truncate">
              {edificio.nombre}
            </h4>
            
            {edificio.responsable && (
              <p className="text-xs text-muted-foreground truncate">
                {edificio.responsable}
              </p>
            )}

            {edificio.proyecto && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                Proyecto: {edificio.proyecto}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
