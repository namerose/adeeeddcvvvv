import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Heart,
  Share2,
  ExternalLink,
  Globe,
  Tag,
  Calendar,
  Users,
  MessageSquare,
  ChevronLeft,
  Code2,
  Database,
  Cloud,
  Layout,
  Server,
  CheckCircle,
  Github
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from '@/hooks/use-navigate';
import { useProjects } from '@/context/ProjectContext';
import { cn } from '@/lib/utils';
import { Project } from '@/types/project';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { navigate } = useNavigate();
  const { toggleStar } = useProjects();

  // Get thumbnail from first project image or use fallback
  const thumbnailImage = project.images && project.images.length > 0 
    ? project.images[0] 
    : null;

  const hasStarred = user?.id && Array.isArray(project.voters) 
    ? project.voters.includes(user.id)
    : false;

  const handleStarClick = async () => {
    if (!user?.id) return;
    await toggleStar(project.id, user.id);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url
        });
      } catch (err) {
        await navigator.clipboard.writeText(url);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-8 gap-2"
        onClick={() => navigate('/projects')}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Projects
      </Button>

      {/* Project Header */}
      <div className="flex items-start gap-6 mb-8">
        {/* Project Thumbnail */}
        <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
          {thumbnailImage ? (
            <img 
              src={thumbnailImage} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Globe className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                {project.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
              <p className="text-xl text-muted-foreground mb-4">
                {project.tagline}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.category && (
                  <Badge variant="outline" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {project.category}
                  </Badge>
                )}
                {project.pricing && (
                  <Badge variant="outline" className="text-sm capitalize">
                    {project.pricing}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                size="lg"
                className={cn(
                  "gap-2",
                  hasStarred && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={handleStarClick}
              >
                {hasStarred ? (
                  <Heart className="h-4 w-4 fill-current" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
                <span>{project.upvotes || 0}</span>
              </Button>

              {project.projectUrl && (
                <Button 
                  size="lg"
                  className="gap-2"
                  asChild
                >
                  <a 
                    href={project.projectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project Stats */}
          <div className="flex items-center gap-6 mt-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Launched {format(new Date(project.launchDate || ''), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{project.subscribers?.length || 0} subscribers</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{project.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[1fr,300px] gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="tech">Tech Stack</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h3>About the Project</h3>
                  <p>{project.description}</p>

                  {project.features && (
                    <>
                      <h3>Key Features</h3>
                      <ul>
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gallery">
                <Carousel>
                  <CarouselContent>
                    {project.images?.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </TabsContent>

              <TabsContent value="tech">
                <div className="grid grid-cols-2 gap-6">
                  {/* Frontend */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Layout className="h-5 w-5 text-blue-500" />
                      </div>
                      <h3 className="font-semibold">Frontend</h3>
                    </div>
                    <div className="space-y-2">
                      {project.techStack
                        ?.filter(tech => ['React', 'Vue', 'Angular'].includes(tech))
                        .map(tech => (
                          <div 
                            key={tech}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted"
                          >
                            <span>{tech}</span>
                          </div>
                        ))
                      }
                    </div>
                  </Card>

                  {/* Backend */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Server className="h-5 w-5 text-green-500" />
                      </div>
                      <h3 className="font-semibold">Backend</h3>
                    </div>
                    <div className="space-y-2">
                      {project.techStack
                        ?.filter(tech => ['Node.js', 'Python', 'Java'].includes(tech))
                        .map(tech => (
                          <div 
                            key={tech}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted"
                          >
                            <span>{tech}</span>
                          </div>
                        ))
                      }
                    </div>
                  </Card>

                  {/* Database */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Database className="h-5 w-5 text-purple-500" />
                      </div>
                      <h3 className="font-semibold">Database</h3>
                    </div>
                    <div className="space-y-2">
                      {project.techStack
                        ?.filter(tech => ['PostgreSQL', 'MongoDB', 'MySQL'].includes(tech))
                        .map(tech => (
                          <div 
                            key={tech}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted"
                          >
                            <span>{tech}</span>
                          </div>
                        ))
                      }
                    </div>
                  </Card>

                  {/* Infrastructure */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <Cloud className="h-5 w-5 text-orange-500" />
                      </div>
                      <h3 className="font-semibold">Infrastructure</h3>
                    </div>
                    <div className="space-y-2">
                      {project.techStack
                        ?.filter(tech => ['AWS', 'Docker', 'Kubernetes'].includes(tech))
                        .map(tech => (
                          <div 
                            key={tech}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted"
                          >
                            <span>{tech}</span>
                          </div>
                        ))
                      }
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comments">
                {/* Comments Section */}
                {user ? (
                  <div className="flex items-start gap-4 mb-8">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea 
                        placeholder="Share your thoughts..."
                        className="mb-2 resize-none"
                        rows={3}
                      />
                      <Button>Post Comment</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center bg-muted/50 rounded-lg p-6 mb-6">
                    <p className="text-muted-foreground mb-2">
                      Sign in to join the discussion
                    </p>
                    <Button variant="outline">Sign In</Button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {project.comments && project.comments.length > 0 ? (
                    project.comments.map((comment, index) => (
                      <div key={comment.id || index}>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.author.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            
                            {/* Comment Actions */}
                            <div className="flex items-center gap-4 mt-2">
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Heart className="h-4 w-4" />
                                <span className="text-xs">12</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-xs">Reply</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Add separator except for last comment */}
                        {index < (project.comments?.length || 0) - 1 && (
                          <Separator className="my-6" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-6">
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={project.author?.avatar} />
                <AvatarFallback>{project.author?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{project.author?.name}</div>
                <div className="text-sm text-muted-foreground">Project Creator</div>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Profile</Button>
          </Card>

          {/* Links Card */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Project Links</h3>
            <div className="space-y-3">
              {project.projectUrl && (
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a 
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              )}
              {project.github && (
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    View Source
                  </a>
                </Button>
              )}
            </div>
          </Card>

          {/* Tech Stack Summary */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map(tech => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
