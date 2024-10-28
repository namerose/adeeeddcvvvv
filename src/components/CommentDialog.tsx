import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/context/ProjectContext';
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface CommentDialogProps {
  projectId: string;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: Date;
  }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentDialog({
  projectId,
  comments,
  open,
  onOpenChange,
}: CommentDialogProps) {
  const [newComment, setNewComment] = useState('');
  const { addComment } = useProjects();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(projectId, {
      author: 'Current User', // In a real app, this would come from auth
      content: newComment,
      createdAt: new Date(),
    });
    setNewComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            Join the discussion about this project.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(comment.createdAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" className="w-full">
            Post Comment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}