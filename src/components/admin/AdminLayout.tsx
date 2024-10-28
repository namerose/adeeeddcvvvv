import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from '@/hooks/use-navigate';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageSquare,
  Calendar,
  Store,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: 'admin'
  },
  {
    title: 'Users',
    icon: Users,
    path: 'admin/users'
  },
  {
    title: 'Projects',
    icon: FolderKanban,
    path: 'admin/projects'
  },
  {
    title: 'Discussions',
    icon: MessageSquare,
    path: 'admin/discussions'
  },
  {
    title: 'Events',
    icon: Calendar,
    path: 'admin/events'
  },
  {
    title: 'Marketplace',
    icon: Store,
    path: 'admin/marketplace'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: 'admin/settings'
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { navigate } = useNavigate();

  // Get current path from hash
  const currentPath = window.location.hash.slice(1).replace('/', '');

  // Redirect if not admin
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user?.isAdmin) {
    return null;
  }

  const handleNavigation = (path: string) => {
    window.location.hash = `/${path}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 border-r bg-card">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  currentPath === item.path && "bg-secondary"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}