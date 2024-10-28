import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowBigUp, MessageSquare } from 'lucide-react';
import { useProjects } from '@/context/ProjectContext';
import { CommentDialog } from './CommentDialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  demo: string;
  github: string;
  tags: string[];
  stars: number;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: Date;
  }>;
  voters: Set<string>;
}

export function ProjectCard({
  id,
  title,
  description,
  demo,
  github,
  tags,
  stars,
  comments,
  voters,
}: ProjectCardProps) {
  const [showComments, setShowComments] = useState(false);
  const { toggleStar } = useProjects();
  const currentUserId = 'user-1';
  const hasStarred = voters.has(currentUserId);

  return (
    <Card className="flex flex-row items-start p-6 gap-6">
      <div className="flex flex-col items-center gap-1">
        <Button
          variant={hasStarred ? "secondary" : "ghost"}
          size="sm"
          className="rounded-lg px-3 py-6"
          onClick={() => toggleStar(id, currentUserId)}
        >
          <ArrowBigUp className={`h-6 w-6 ${hasStarred ? "fill-current" : ""}`} />
        </Button>
        <span className="text-sm font-medium">{stars}</span>
      </div>

      <div className="flex-1 space-y-4">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg hover:text-primary">
                <a href={demo} target="_blank" rel="noopener noreferrer">
                  {title}
                </a>
              </h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://avatar.vercel.sh/${id}`} />
              <AvatarFallback>PH</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setShowComments(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {comments.length}
            </Button>
          </div>
        </CardContent>
      </div>

      <CommentDialog
        projectId={id}
        comments={comments}
        open={showComments}
        onOpenChange={setShowComments}
      />
    </Card>
  );
}