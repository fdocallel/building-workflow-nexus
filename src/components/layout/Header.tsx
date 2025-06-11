
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { LogOut, Kanban, List } from 'lucide-react';
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
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sistema de Gestión de Edificios</h1>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={location.pathname === '/' ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate('/')}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={location.pathname === '/kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate('/kanban')}
              >
                <Kanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-600">{user.email}</span>
              {userRole && (
                <Badge variant="secondary" className="ml-2">
                  {userRole}
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
