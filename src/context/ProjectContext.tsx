import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { projectOperations } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => Promise<void>;
  toggleStar: (projectId: string, userId: string) => Promise<void>;
  toggleSubscribe: (projectId: string, userId: string) => Promise<void>;
  addComment: (projectId: string, comment: Comment) => Promise<void>;
  getComments: (projectId: string) => Comment[];
  deleteProject: (projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const loadedProjects = await projectOperations.getAll();
      // Ensure voters is always an array when loading from DB
      const projectsWithArrayVoters = loadedProjects.map(project => ({
        ...project,
        voters: Array.isArray(project.voters) ? project.voters : []
      }));
      setProjects(projectsWithArrayVoters);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
    }
  }

  const addProject = async (project: Project) => {
  try {
    // Ensure new projects have required fields
    const projectWithDefaults = {
      ...project,
      voters: Array.isArray(project.voters) ? project.voters : [],
      status: 'published',
      createdAt: new Date().toISOString(),
      launchDate: new Date().toISOString(),
      upvotes: 0,
      comments: [],
      rank: projects.length + 1 // Simple ranking based on order
    };

    await projectOperations.create(projectWithDefaults);
    setProjects(prev => [projectWithDefaults, ...prev]);
    
    toast({
      title: "Success",
      description: "Project created successfully!",
    });
  } catch (error) {
    console.error('Failed to create project:', error);
    toast({
      title: "Error",
      description: "Failed to create project. Please try again.",
      variant: "destructive"
    });
  }
};

  const toggleStar = async (projectId: string, userId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const voters = Array.isArray(project.voters) ? [...project.voters] : [];
      const voterIndex = voters.indexOf(userId);
      
      if (voterIndex === -1) {
        voters.push(userId);
      } else {
        voters.splice(voterIndex, 1);
      }

      const updatedProject = {
        ...project,
        voters,
        upvotes: voters.length
      };

      await projectOperations.update(updatedProject);
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
    } catch (error) {
      console.error('Failed to toggle star:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    }
  };

   const toggleSubscribe = async (projectId: string, userId: string) => {
    try {
      const project = await projectOperations.getById(projectId);
      if (!project) return;

      const subscribers = new Set(project.subscribers || []);
      if (subscribers.has(userId)) {
        subscribers.delete(userId);
      } else {
        subscribers.add(userId);
      }

      await projectOperations.update({
        ...project,
        subscribers: Array.from(subscribers)
      });

      setProjects(prev =>
        prev.map(p => p.id === projectId ? {
          ...p,
          subscribers
        } : p)
      );
    } catch (error) {
      console.error('Failed to toggle subscribe:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addComment = async (projectId: string, comment: Comment) => {
    try {
      await projectOperations.addComment(projectId, comment);
      setProjects(prev =>
        prev.map(p => p.id === projectId ? {
          ...p,
          comments: [...(p.comments || []), comment]
        } : p)
      );
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getComments = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.comments || [];
  };

  const deleteProject = async (projectId: string) => {
    if (!user) return;

    try {
      await projectOperations.delete(projectId, user.id);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      toggleStar,
      toggleSubscribe,
      addComment,
      getComments,
      deleteProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}