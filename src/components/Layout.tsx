import { useState, useEffect, useCallback } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from './ui/button';
import { 
  Search, 
  Rocket, 
  Users, 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Calendar, 
  Award,
  Flame,
  TrendingUp,
  Zap,
  UserPlus,
  Trophy,
  Target,
  Store,
  Briefcase,
  GraduationCap,
  ScrollText,
  BookOpen,
  Heart,
  Shield
} from 'lucide-react';
import { Input } from './ui/input';
import { LoginDialog } from './auth/LoginDialog';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/context/AuthContext';
import { SubmitProject } from './SubmitProject';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from '@/hooks/use-navigate';
import { cn } from '@/lib/utils';

const launchesMenuItems = [
  {
    label: "Today's Projects",
    description: "Discover the hottest products launching today",
    icon: Flame,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    path: '/today'
  },
  {
    label: "Upcoming Projects",
    description: "Get notified about future product launches",
    icon: Sparkles,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    path: '/upcoming'
  },
  {
    label: "Popular Projects",
    description: "Browse trending and most upvoted products",
    icon: TrendingUp,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    path: '/popular'
  },
  {
    label: "Launch Guidelines",
    description: "Best practices for launching your project",
    icon: BookOpen,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    path: '/launch-guidelines'
  }
];

const communityMenuItems = [
  {
    label: "Discussions",
    description: "Join conversations with fellow makers",
    icon: MessageSquare,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    path: '/discussions'
  },
  {
    label: "Events",
    description: "Attend virtual events and meetups",
    icon: Calendar,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    path: '/events'
  },
  {
    label: "Badges",
    description: "Earn badges and showcase achievements",
    icon: Trophy,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    path: '/badges'
  },
  {
    label: "Connect",
    description: "Find and follow other makers",
    icon: UserPlus,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    path: '/connect'
  },
  {
    label: "Marketplace",
    description: "Buy and sell code, templates, and components",
    icon: Store,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    path: '/marketplace'
  },
  {
    label: "Community Guidelines",
    description: "Our community rules and values",
    icon: Shield,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    path: '/community-guidelines'
  }
];

const jobBoardMenuItems = [
  {
    label: "Cari Lowongan",
    description: "Temukan peluang kamu",
    icon: Briefcase,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    path: '/jobs'
  },
  {
    label: "Syarat & Panduan",
    description: "Informasi untuk Perusahaan perekrut",
    icon: ScrollText,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    path: '/employer-guidelines'
  }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigate();
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1).replace('/', '') || 'today');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1).replace('/', '') || 'today';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // Empty dependency array since we don't need any dependencies

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 max-screen-2xl mx-auto px-4">
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2"
            onClick={() => handleNavigation('/today')}
          >
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ProjectLaunch</span>
          </Button>
          
          <div className="flex-1 ml-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9 h-10 bg-secondary/50"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  <Flame className="mr-2 h-4 w-4 text-orange-500" />
                  Launches
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel className="text-muted-foreground">
                  Discover Projects
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {launchesMenuItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <div className={cn("p-2 rounded-lg", item.iconBg)}>
                      <item.icon className={cn("h-4 w-4", item.iconColor)} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  <Users className="mr-2 h-4 w-4 text-violet-500" />
                  Community
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel className="text-muted-foreground">
                  Connect & Engage
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {communityMenuItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <div className={cn("p-2 rounded-lg", item.iconBg)}>
                      <item.icon className={cn("h-4 w-4", item.iconColor)} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
                  Lowongan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel className="text-muted-foreground">
                  Peluang Karir
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {jobBoardMenuItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <div className={cn("p-2 rounded-lg", item.iconBg)}>
                      <item.icon className={cn("h-4 w-4", item.iconColor)} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <SubmitProject />
          </nav>

          <div className="flex items-center gap-4 ml-4">
            <ModeToggle />
            {isAuthenticated ? <UserMenu /> : <LoginDialog />}
          </div>
        </div>
      </header>

      <div className="gradient-bg min-h-[calc(100vh-4rem)]">
        <div className="max-w-screen-xl mx-auto px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
