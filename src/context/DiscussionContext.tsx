import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Discussion, Reply, PollOption } from '@/types/discussion';
import { discussionOperations } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface DiscussionContextType {
  discussions: Discussion[];
  addDiscussion: (discussion: Omit<Discussion, 'id'>) => Promise<void>;
  addReply: (discussionId: string, reply: Omit<Reply, 'id' | 'createdAt' | 'upvotes' | 'voters'>) => Promise<void>;
  toggleUpvote: (discussionId: string, userId: string) => Promise<void>;
  votePoll: (discussionId: string, optionId: string, userId: string) => Promise<void>;
  getDiscussionById: (id: string) => Promise<Discussion | undefined>;
  deleteDiscussion: (discussionId: string) => Promise<void>;
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);

export function DiscussionProvider({ children }: { children: ReactNode }) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load discussions on mount
  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      const loadedDiscussions = await discussionOperations.getAll();
      setDiscussions(loadedDiscussions);
    } catch (error) {
      console.error('Failed to load discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addDiscussion = async (discussion: Omit<Discussion, 'id'>) => {
    try {
      const newDiscussion = await discussionOperations.create({
        ...discussion,
        id: crypto.randomUUID(),
      });
      
      setDiscussions(prev => [newDiscussion, ...prev]);
      
      toast({
        title: "Success",
        description: "Discussion created successfully!",
      });
    } catch (error) {
      console.error('Failed to create discussion:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addReply = async (discussionId: string, reply: Omit<Reply, 'id' | 'createdAt' | 'upvotes' | 'voters'>) => {
    try {
      const newReply = await discussionOperations.addReply(discussionId, reply);
      
      setDiscussions(prev => prev.map(d => 
        d.id === discussionId 
          ? { ...d, replies: [...d.replies, newReply] }
          : d
      ));

      toast({
        title: "Success",
        description: "Reply added successfully!",
      });
    } catch (error) {
      console.error('Failed to add reply:', error);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleUpvote = async (discussionId: string, userId: string) => {
    try {
      const updatedDiscussion = await discussionOperations.toggleUpvote(discussionId, userId);
      setDiscussions(prev => 
        prev.map(d => d.id === discussionId ? updatedDiscussion : d)
      );
    } catch (error) {
      console.error('Failed to toggle upvote:', error);
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const votePoll = async (discussionId: string, optionId: string, userId: string) => {
    try {
      const updatedDiscussion = await discussionOperations.votePoll(discussionId, optionId, userId);
      setDiscussions(prev => 
        prev.map(d => d.id === discussionId ? updatedDiscussion : d)
      );
    } catch (error) {
      console.error('Failed to vote in poll:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getDiscussionById = async (id: string) => {
    try {
      const discussion = await discussionOperations.getById(id);
      if (discussion) {
        await discussionOperations.incrementViews(id);
      }
      return discussion;
    } catch (error) {
      console.error('Failed to get discussion:', error);
      toast({
        title: "Error",
        description: "Failed to load discussion. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteDiscussion = async (discussionId: string) => {
    if (!user) return;

    try {
      await discussionOperations.delete(discussionId, user.id);
      setDiscussions(prev => prev.filter(d => d.id !== discussionId));
      toast({
        title: "Success",
        description: "Discussion deleted successfully!",
      });
    } catch (error) {
      console.error('Failed to delete discussion:', error);
      toast({
        title: "Error",
        description: "Failed to delete discussion. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <DiscussionContext.Provider value={{
      discussions,
      addDiscussion,
      addReply,
      toggleUpvote,
      votePoll,
      getDiscussionById,
      deleteDiscussion,
    }}>
      {children}
    </DiscussionContext.Provider>
  );
}

export function useDiscussions() {
  const context = useContext(DiscussionContext);
  if (context === undefined) {
    throw new Error('useDiscussions must be used within a DiscussionProvider');
  }
  return context;
}