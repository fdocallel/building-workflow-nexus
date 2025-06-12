
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { Tables } from '@/integrations/supabase/types';
import { EditForm } from './EditForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

type Edificio = Tables<'edificio'>;

export function EdificiosListWithEdit() {
  const { data: userRole } = useUserRole();
  const [editingEdificio, setEditingEdificio] = useState<Edificio | null>(null);

  const { data: edificios, isLoading, error } = useQuery({
    queryKey: ['edificios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('edificio')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Edificio[];
    },
  });

  const getStatusColor = (estado: string) => {
    const colors = {
      'Procesos': 'bg-blue-100 text-blue-800',
      'Mechanical': 'bg-orange-100 text-orange-800',
      'Estructuras': 'bg-green-100 text-green-800',
      'Geotecnia': 'bg-purple-100 text-purple-800',
      'Coordinación': 'bg-yellow-100 text-yellow-800',
      'Completado': 'bg-gray-100 text-gray-800',
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const canEditEdificio = (edificio: Edificio) => {
    return userRole === 'coordinacion' ||
      (edificio.estado === 'Procesos' && userRole === 'procesos') ||
      (edificio.estado === 'Mechanical' && userRole === 'mechanical') ||
      (edificio.estado === 'Estructuras' && userRole === 'estructuras');
  };

  if (isLoading) return <div className="p-4">Cargando edificios...</div>;
  if (error) return <div className="p-4 text-red-600">Error al cargar edificios</div>;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edificios</h2>
          {userRole && (
            <Badge variant="outline" className="text-sm">
              Rol: {userRole}
            </Badge>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {edificios?.map((edificio) => (
            <Card key={edificio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{edificio.nombre}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(edificio.estado || '')}>
                      {edificio.estado}
                    </Badge>
                    {canEditEdificio(edificio) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEdificio(edificio)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Código:</strong> {edificio.Code}</p>
                  <p><strong>Proyecto:</strong> {edificio.proyecto}</p>
                  {edificio.tipologia && (
                    <p><strong>Tipología:</strong> {edificio.tipologia}</p>
                  )}
                  {edificio.num_edificios && (
                    <p><strong>Núm. Edificios:</strong> {edificio.num_edificios}</p>
                  )}
                  {edificio.responsable && (
                    <p><strong>Responsable:</strong> {edificio.responsable}</p>
                  )}
                  {edificio.descripcion && (
                    <p className="text-gray-600">{edificio.descripcion}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!editingEdificio} onOpenChange={() => setEditingEdificio(null)}>
        <DialogContent className="max-w-2xl">
          {editingEdificio && (
            <EditForm
              edificio={editingEdificio}
              onClose={() => setEditingEdificio(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
