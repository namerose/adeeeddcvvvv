import { Project } from '@/types/project';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowUpIcon, ExternalLink, Briefcase, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { useNavigate } from '@/hooks/use-navigate';

interface ProjectListItemProps {
  project: Project;
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  const { user } = useAuth();
  const { toggleStar } = useProjects();
  const { navigate } = useNavigate();
  
  const hasStarred = user && Array.isArray(project.voters) && project.voters.includes(user.id);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleStar(project.id, user.id);
    }
  };

  return (
    <div 
      className="flex items-start gap-4 p-4 bg-background rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      {/* Project Thumbnail */}
      <div className="w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
  {project.thumbnail ? (
    <img 
      src={project.thumbnail} 
      alt={project.title}
      className="w-full h-full object-cover"
    />
  ) : project.images && project.images.length > 0 ? (
    <img 
      src={project.images[0]} 
      alt={project.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
      <ImageIcon className="h-8 w-8 text-muted-foreground" />
    </div>
  )}
</div>

      {/* Project Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold hover:text-primary">
                {project.title}
              </h3>
              {project.projectUrl && (
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              )}
              {project.hiring?.status && (
                <Badge variant="secondary" className="ml-2">
                  <Briefcase className="h-3 w-3 mr-1" />
                  Hiring
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
              {project.description}
            </p>
          </div>

          {/* Upvote Button */}
          <div className="flex flex-col items-center ml-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-lg px-3 py-6",
                hasStarred && "bg-secondary"
              )}
              onClick={handleStarClick}
            >
              <ArrowUpIcon className={cn(
                "h-5 w-5",
                hasStarred && "text-primary fill-primary"
              )} />
            </Button>
            <span className="text-sm font-medium">{project.upvotes || 0}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-2">
          {project.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="px-2 py-0.5 text-xs bg-secondary/50"
            >
              {tag}
            </Badge>
          ))}
          {project.hiring?.status && (
            <span className="text-sm text-muted-foreground">
              • {project.hiring.type} • {project.hiring.rate}
            </span>
          )}
        </div>

        {/* Project Meta */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={project.author?.avatar} />
              <AvatarFallback>{project.author?.name[0]}</AvatarFallback>
            </Avatar>
            <span>{project.author?.name}</span>
          </div>
          {project.launchDate && (
            <span>
              Launched {new Date(project.launchDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
