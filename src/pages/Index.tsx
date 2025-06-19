
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Header } from '@/components/layout/Header';
import { Dashboard as DashboardComponent } from '@/components/dashboard/Dashboard';
import { EdificiosListWithEdit } from '@/components/edificios/EdificiosListWithEdit';
import { LoginForm } from '@/components/auth/LoginForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Waves, Building, BarChart3 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center water-gradient">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="ripple-effect">
            <Waves className="h-12 w-12 text-blue-600 mx-auto mb-4 wave-animation" />
          </div>
          <p className="text-blue-700 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen water-gradient flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <LoginForm />
        </div>
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 water-gradient flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <div className="ripple-effect">
              <Waves className="h-12 w-12 text-blue-600 mx-auto mb-4 wave-animation" />
            </div>
            <p className="text-blue-700 font-medium">Verificando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 water-gradient flex items-center justify-center p-4">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <Waves className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Sin rol asignado
            </h2>
            <p className="text-blue-600">
              Contacta al administrador para asignar un rol a tu cuenta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen water-gradient">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:water-gradient data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="edificios"
              className="data-[state=active]:water-gradient data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Building className="h-4 w-4 mr-2" />
              Edificios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50">
              <DashboardComponent />
            </div>
          </TabsContent>
          
          <TabsContent value="edificios" className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50">
              <EdificiosListWithEdit />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
