import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Home, Settings, Users, MessageSquare } from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/',
    color: 'text-blue-500',
  },
  {
    title: 'Chat',
    icon: MessageSquare,
    href: '/chat',
    color: 'text-green-500',
  },
  {
    title: 'Agentes',
    icon: Users,
    href: '/agents',
    color: 'text-purple-500',
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/settings',
    color: 'text-gray-500',
  },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">Aizzen</h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2',
                  location.pathname === item.href && 'bg-gray-100'
                )}
              >
                <item.icon className={cn('h-4 w-4', item.color)} />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
} 