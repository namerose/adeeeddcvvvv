import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Download, Star } from 'lucide-react';

interface ProductGridProps {
  projects: any[];
  onViewProduct: (projectId: string) => void;
}

export function ProductGrid({ projects, onViewProduct }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map(project => (
        <Card key={project.id} className="overflow-hidden">
          {/* Preview Image */}
          <div className="aspect-video w-full bg-muted relative group">
            <img 
              src={`https://picsum.photos/seed/${project.id}/800/400`}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <Button 
                size="sm" 
                variant="secondary" 
                className="gap-2"
                onClick={() => onViewProduct(project.id)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button size="sm" variant="secondary" className="gap-2">
                <Download className="h-4 w-4" />
                Demo
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 
                    className="font-semibold hover:text-primary cursor-pointer"
                    onClick={() => onViewProduct(project.id)}
                  >
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">${project.price}</div>
                <div className="text-sm text-muted-foreground">One-time payment</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.author.avatar} />
                  <AvatarFallback>{project.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{project.author.name}</div>
                  <div className="text-muted-foreground">
                    {project.sales} sales
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{project.rating}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack.map((tech: string) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}