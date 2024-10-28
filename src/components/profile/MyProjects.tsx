import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pencil, 
  Trash2, 
  Eye, 
  ArrowUpRight,
  Calendar,
  MessageSquare,
  ArrowBigUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { SubmitProject } from '../SubmitProject';
import { useNavigate } from '@/hooks/use-navigate';

export function MyProjects() {
  const { projects, deleteProject } = useProjects();
  const { user } = useAuth();
  const { toast } = useToast();
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const { navigate } = useNavigate();

  // Filter user's projects
  const userProjects = projects.filter(project => project.author?.id === user?.id);
  const publishedProjects = userProjects.filter(p => p.status === 'published');
  const upcomingProjects = userProjects.filter(p => p.status === 'upcoming');

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setDeleteProjectId(null);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your submitted and upcoming projects
          </p>
        </div>
        <SubmitProject />
      </div>

      <Tabs defaultValue="published">
        <TabsList className="mb-6">
          <TabsTrigger value="published">
            Published ({publishedProjects.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          <div className="space-y-4">
            {publishedProjects.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No published projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start sharing your work with the community
                </p>
                <SubmitProject />
              </Card>
            ) : (
              publishedProjects.map((project) => (
                <Card key={project.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        {project.rank && project.rank <= 3 && (
                          <Badge variant="secondary">#{project.rank}</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(project.launchDate || ''), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <ArrowBigUp className="h-4 w-4" />
                          {project.upvotes || 0} upvotes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {project.comments?.length || 0} comments
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleViewProject(project.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setEditingProject(project.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setDeleteProjectId(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="space-y-4">
            {upcomingProjects.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No upcoming projects</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your next project launch
                </p>
                <SubmitProject />
              </Card>
            ) : (
              upcomingProjects.map((project) => (
                <Card key={project.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <Badge>Launching Soon</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Launching {format(new Date(project.launchDate || ''), 'MMM d, yyyy')}
                        </span>
                        {project.subscribers?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {project.subscribers.length} subscribers
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setEditingProject(project.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setDeleteProjectId(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteProjectId && handleDelete(deleteProjectId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Project Dialog */}
      {editingProject && (
        <SubmitProject 
          projectId={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={() => {
            setEditingProject(null);
            toast({
              title: "Success",
              description: "Project updated successfully",
            });
          }}
        />
      )}
    </div>
  );
}