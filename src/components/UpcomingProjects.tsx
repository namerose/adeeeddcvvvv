import { useState } from 'react';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  BellOff,
  Calendar,
  ExternalLink,
  Github,
  Link2,
  Search,
  Filter,
  Rocket,
  Clock,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Tag
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function UpcomingProjects() {
  const { projects, toggleSubscribe } = useProjects();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const upcomingProjects = projects.filter(p => p.status === 'upcoming');

  // Filter and sort projects
  const filteredProjects = upcomingProjects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.launchDate || '').getTime() - new Date(b.launchDate || '').getTime();
        case 'subscribers':
          return (b.subscribers?.length || 0) - (a.subscribers?.length || 0);
        default:
          return 0;
      }
    });

  // Calculate time until launch
  const getTimeUntilLaunch = (launchDate: string) => {
    const now = new Date();
    const launch = new Date(launchDate);
    const distance = formatDistanceToNow(launch, { addSuffix: true });
    const progress = Math.max(0, Math.min(100, (
      (now.getTime() - new Date(launch).getTime()) / 
      (new Date(launch).getTime() - now.getTime())
    ) * 100));
    return { distance, progress };
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search upcoming projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ai">AI & ML</SelectItem>
            <SelectItem value="web">Web Development</SelectItem>
            <SelectItem value="mobile">Mobile Apps</SelectItem>
            <SelectItem value="design">Design Tools</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Launch Date</SelectItem>
            <SelectItem value="subscribers">Most Subscribed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-6">
        {filteredProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No upcoming projects found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or check back later for new projects
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setSortBy('date');
            }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          filteredProjects.map((project) => {
            const isSubscribed = project.subscribers?.includes(user?.id || '');
            const { distance, progress } = getTimeUntilLaunch(project.launchDate || '');

            return (
              <Card key={project.id} className="p-6">
                <div className="flex gap-6">
                  {/* Project Thumbnail */}
                  <div className="w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {project.thumbnail ? (
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <Rocket className="h-8 w-8 text-primary/40" />
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{project.title}</h3>
                          {project.featured && (
                            <Badge variant="secondary" className="gap-1">
                              <Rocket className="h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {project.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Launching {format(new Date(project.launchDate || ''), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.subscribers?.length || 0} subscribers
                          </span>
                          {project.category && (
                            <Badge variant="outline" className="gap-1">
                              <Tag className="h-3 w-3" />
                              {project.category}
                            </Badge>
                          )}
                        </div>

                        {/* Launch Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Launching {distance}</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant={isSubscribed ? "secondary" : "default"}
                          className="gap-2"
                          onClick={() => user && toggleSubscribe(project.id, user.id)}
                          disabled={!isAuthenticated}
                        >
                          {isSubscribed ? (
                            <>
                              <BellOff className="h-4 w-4" />
                              Subscribed
                            </>
                          ) : (
                            <>
                              <Bell className="h-4 w-4" />
                              Get Notified
                            </>
                          )}
                        </Button>

                        {project.projectUrl && (
                          <Button variant="outline" className="gap-2" asChild>
                            <a 
                              href={project.projectUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Link2 className="h-4 w-4" />
                              Preview
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}