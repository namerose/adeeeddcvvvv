import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Image,
  FileCode,
  Smile,
  MapPin,
  Link2,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDiscussions } from '@/context/DiscussionContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function NewDiscussionDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { addDiscussion } = useDiscussions();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !content.trim()) return;

  const newDiscussion = {
    id: crypto.randomUUID(), // Pastikan ID dibuat
    title: '', 
    content: content,
    type: 'discussion',
    category: 'general',
    subcategory: 'general',
    tags: [],
    author: {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    },
    createdAt: new Date().toISOString(),
    upvotes: 0,
    voters: new Set(),
    replies: [],
    views: 0,
    status: 'active' as const
  };

  await addDiscussion(newDiscussion);
  setContent('');
  setOpen(false);
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input 
              placeholder="What is happening?!"
              className="bg-transparent border-0 text-lg focus-visible:ring-0 px-0"
              onClick={() => isAuthenticated && setOpen(true)}
              readOnly
            />
            <div className="text-sm text-primary mt-1">Everyone can reply</div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Input 
                placeholder="What is happening?!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-transparent border-0 text-lg focus-visible:ring-0 px-0"
                autoFocus
              />
              <div className="text-sm text-primary">Everyone can reply</div>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-full hover:bg-primary/10 hover:text-primary",
                      "h-9 w-9 p-0"
                    )}
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "rounded-full hover:bg-primary/10 hover:text-primary",
                      "h-9 w-9 p-0"
                    )}
                  >
                    <FileCode className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "rounded-full hover:bg-primary/10 hover:text-primary",
                      "h-9 w-9 p-0"
                    )}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "rounded-full hover:bg-primary/10 hover:text-primary",
                      "h-9 w-9 p-0"
                    )}
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "rounded-full hover:bg-primary/10 hover:text-primary",
                      "h-9 w-9 p-0"
                    )}
                  >
                    <Link2 className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "rounded-full hover:bg-primary/10 hover:text-primary",
                      "h-9 w-9 p-0"
                    )}
                  >
                    <Globe className="h-5 w-5" />
                  </Button>
                </div>

                <Button 
                  type="submit"
                  className="rounded-full px-6"
                  disabled={!content.trim()}
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}