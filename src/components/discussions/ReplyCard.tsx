import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpIcon, MessageCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReplyCardProps {
  reply: any;
}

export function ReplyCard({ reply }: ReplyCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={reply.author.avatar} />
          <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium hover:text-primary">
                {reply.author.name}
              </span>
              <span className="text-sm text-muted-foreground">
                • {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-2">{reply.content}</p>

          {reply.media && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img 
                src={reply.media} 
                alt="Reply attachment" 
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowUpIcon className="h-4 w-4" />
              {reply.upvotes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Reply
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}