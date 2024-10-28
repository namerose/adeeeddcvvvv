import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectListItem } from '@/components/ProjectListItem';
import { BadgeDisplay } from '../badges/BadgeDisplay';
import { BADGES } from '@/lib/badges';
import { Calendar, MapPin, Link2, Twitter, Github, Linkedin, Share2 } from 'lucide-react';
import { User } from '@/types/user';
import { Project } from '@/types/project';
import { Badge as BadgeType } from '@/types/badge';
import { ProfileTheme } from '@/types/profile-theme';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PublicProfileProps {
  username: string;
}

export function PublicProfile({ username }: PublicProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ProfileTheme>({
    gradient: 'none',
    pattern: 'none',
    showStats: true,
    showBadges: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, [username]);

  const loadUserData = async () => {
    try {
      // Get user data
      const users = JSON.parse(localStorage.getItem('project_launch_users') || '[]');
      const foundUser = users.find((u: User) => u.username === username);
      
      if (foundUser) {
        setUser(foundUser);
        
        // Get user's theme
        if (foundUser.theme) {
          setTheme(foundUser.theme);
        }
        
        // Get user's badges
        const userBadgesData = localStorage.getItem(`badges_${foundUser.id}`);
        const userBadges = userBadgesData ? JSON.parse(userBadgesData).badges || [] : [];
        setBadges(userBadges);

        // Get user's projects
        const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        const userProjects = allProjects.filter((p: Project) => p.author?.id === foundUser.id);
        setProjects(userProjects);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/#/@${username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name}'s Profile`,
          text: `Check out ${user?.name}'s profile on ProjectLaunch`,
          url
        });
      } catch (err) {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Profile URL has been copied to your clipboard.",
        });
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Profile URL has been copied to your clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-8 w-48 bg-muted rounded mb-2" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or has changed their username.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="overflow-hidden">
        {/* Banner */}
        <div 
          className={cn(
            "h-48 relative",
            !theme.backgroundImage && theme.gradient && `bg-gradient-${theme.gradient}`,
            !theme.backgroundImage && theme.pattern && `bg-${theme.pattern}`
          )}
          style={theme.backgroundImage ? {
            backgroundImage: `url(${theme.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : undefined}
        >
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24 ring-4 ring-background -mt-12 relative z-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="mt-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground">@{user?.username}</p>
                
                {user?.bio && (
                  <p className="mt-2 text-sm">{user.bio}</p>
                )}

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {user?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 mt-4">
                  {user?.website && (
                    <a 
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Link2 className="h-5 w-5" />
                    </a>
                  )}
                  {user?.twitter && (
                    <a 
                      href={`https://twitter.com/${user.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {user?.github && (
                    <a 
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {user?.linkedin && (
                    <a 
                      href={user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              <Button 
                variant="outline" 
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          {theme.showStats !== false && (
            <div className="grid grid-cols-4 gap-4 mt-8 text-center">
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main Content */}
      <div className="mt-6">
        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  No projects yet
                </Card>
              ) : (
                projects.map((project) => (
                  <ProjectListItem key={project.id} project={project} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="badges">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BADGES.map((badge) => (
                <BadgeDisplay
                  key={badge.id}
                  badge={badge}
                  isUnlocked={Array.isArray(badges) && badges.some(b => b.id === badge.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}