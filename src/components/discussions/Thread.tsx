import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpIcon, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { useNavigate } from '@/hooks/use-navigate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Discussion } from '@/types/discussion';

interface ThreadProps {
  thread: Discussion;
  preview?: boolean;
}

export function Thread({ thread, preview = true }: ThreadProps) {
  const { navigate } = useNavigate();
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleThreadClick = () => {
    if (preview && thread.id) { // Pastikan thread.id ada
      navigate(`/discussions/${thread.id}`);
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpvoted(!isUpvoted);
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle reply logic
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle share logic
  };

  if (!thread || !thread.author) {
    return null;
  }

  // Debug log untuk memeriksa ID thread
  console.log('Thread ID:', thread.id);

  return (
    <Card 
      className={cn(
        "p-4",
        preview && "hover:bg-accent/50 cursor-pointer transition-colors"
      )}
      onClick={handleThreadClick}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={thread.author.avatar} />
          <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium hover:text-primary">
                {thread.author.name}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Thread
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Menampilkan konten/pesan diskusi */}
          {thread.title && (
            <p className="font-medium mt-1">{thread.title}</p>
          )}
          {thread.content && (
            <p className="mt-2 whitespace-pre-wrap">{thread.content}</p>
          )}

          {thread.media && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img 
                src={thread.media} 
                alt="Thread attachment" 
                className="w-full h-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="flex items-center gap-6 mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleUpvote}
            >
              <ArrowUpIcon className={cn(
                "h-4 w-4",
                isUpvoted && "fill-primary text-primary"
              )} />
              {thread.upvotes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleReply}
            >
              <MessageCircle className="h-4 w-4" />
              {thread.replies?.length || 0}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
