
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { LogOut, Kanban, List, Waves } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Header() {
  const { user, signOut } = useAuth();
  const { data: userRole } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-sky-500/10 backdrop-blur-sm border-blue-200/50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="water-drop">
            <Waves className="h-8 w-8 text-blue-600 wave-animation" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Sistema de Gestión de Edificios
          </h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={location.pathname === '/' ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate('/')}
                className={location.pathname === '/' ? 'water-gradient text-white shadow-lg' : 'border-blue-200 hover:bg-blue-50'}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={location.pathname === '/kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate('/kanban')}
                className={location.pathname === '/kanban' ? 'water-gradient text-white shadow-lg' : 'border-blue-200 hover:bg-blue-50'}
              >
                <Kanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
            
            <div className="text-sm">
              <span className="text-blue-700">{user.email}</span>
              {userRole && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                  {userRole}
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="border-blue-200 hover:bg-blue-50 text-blue-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
