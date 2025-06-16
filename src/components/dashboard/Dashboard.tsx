
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tables } from '@/integrations/supabase/types';

type Edificio = Tables<'edificio'>;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function Dashboard() {
  const { data: edificios, isLoading, error } = useQuery({
    queryKey: ['edificios-dashboard'],
    queryFn: async () => {
      console.log('Fetching edificios for dashboard...');
      const { data, error } = await supabase
        .from('edificio')
        .select('*');

      if (error) {
        console.error('Error fetching edificios for dashboard:', error);
        throw error;
      }
      
      console.log('Edificios fetched for dashboard:', data?.length || 0, 'records');
      return data as Edificio[];
    },
  });

  const getEstadosData = () => {
    if (!edificios) return [];
    
    const estadoCounts: Record<string, number> = {};
    edificios.forEach(edificio => {
      const estado = edificio.estado || 'Sin estado';
      estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
    });

    return Object.entries(estadoCounts).map(([estado, count]) => ({
      estado,
      cantidad: count
    }));
  };

  const getProyectosData = () => {
    if (!edificios) return [];
    
    const proyectoCounts: Record<string, number> = {};
    edificios.forEach(edificio => {
      const proyecto = edificio.proyecto || 'Sin proyecto';
      proyectoCounts[proyecto] = (proyectoCounts[proyecto] || 0) + 1;
    });

    return Object.entries(proyectoCounts).map(([proyecto, count]) => ({
      proyecto,
      cantidad: count
    }));
  };

  const getTiempoMedio = () => {
    if (!edificios) return 0;
    
    const completados = edificios.filter(e => e.estado === 'Completado');
    if (completados.length === 0) return 0;

    const tiempos = completados.map(edificio => {
      const created = new Date(edificio.created_at);
      const updated = new Date(edificio.updated_at);
      return (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // días
    });

    return tiempos.reduce((sum, tiempo) => sum + tiempo, 0) / tiempos.length;
  };

  if (isLoading) {
    return <div className="p-4">Cargando dashboard...</div>;
  }

  if (error) {
    console.error('Dashboard query error:', error);
    return <div className="p-4 text-red-600">Error al cargar dashboard: {error.message}</div>;
  }

  const estadosData = getEstadosData();
  const proyectosData = getProyectosData();
  const tiempoMedio = getTiempoMedio();

  console.log('Rendering dashboard with edificios:', edificios?.length || 0);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard de Edificios</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Estadísticas generales */}
        <Card>
          <CardHeader>
            <CardTitle>Total de Edificios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{edificios?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edificios Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {edificios?.filter(e => e.estado === 'Completado').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiempo Medio hasta Completado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tiempoMedio.toFixed(1)} días
            </div>
          </CardContent>
        </Card>
      </div>

      {edificios && edificios.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay datos para mostrar en el dashboard</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Gráfico de barras - Estados */}
            <Card>
              <CardHeader>
                <CardTitle>Edificios por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estadosData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="estado" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de pie - Proyectos */}
            <Card>
              <CardHeader>
                <CardTitle>Edificios por Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={proyectosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ proyecto, percent }) => `${proyecto} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                    >
                      {proyectosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de resumen por proyecto */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Proyecto</th>
                      <th className="text-left p-2">Total</th>
                      <th className="text-left p-2">En Proceso</th>
                      <th className="text-left p-2">Completados</th>
                      <th className="text-left p-2">% Completado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectosData.map((proyecto) => {
                      const edificiosProyecto = edificios?.filter(e => e.proyecto === proyecto.proyecto) || [];
                      const completados = edificiosProyecto.filter(e => e.estado === 'Completado').length;
                      const enProceso = edificiosProyecto.length - completados;
                      const porcentaje = edificiosProyecto.length > 0 ? (completados / edificiosProyecto.length * 100) : 0;
                      
                      return (
                        <tr key={proyecto.proyecto} className="border-b">
                          <td className="p-2">{proyecto.proyecto}</td>
                          <td className="p-2">{proyecto.cantidad}</td>
                          <td className="p-2">{enProceso}</td>
                          <td className="p-2">{completados}</td>
                          <td className="p-2">{porcentaje.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
