import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useProjects } from '@/context/ProjectContext';
import { format } from 'date-fns';

interface CommentSectionProps {
  projectId: string;
}

export function CommentSection({ projectId }: CommentSectionProps) {
  const [comment, setComment] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { addComment, getComments } = useProjects();
  const comments = getComments(projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    addComment(projectId, {
      id: crypto.randomUUID(),
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      content: comment,
      createdAt: new Date().toISOString(),
    });

    setComment('');
  };

  return (
    <div className="p-4">
      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What do you think?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" disabled={!comment.trim()}>
                Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Please sign in to comment
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}