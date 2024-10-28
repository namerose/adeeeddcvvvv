import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Thread } from './discussions/Thread';
import { DiscussionSidebar } from './discussions/DiscussionSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDiscussions } from '@/context/DiscussionContext';
import { 
  Image,
  FileCode,
  Smile,
  MapPin,
  Link2,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Discussions() {
  const { isAuthenticated, user } = useAuth();
  const [sortBy, setSortBy] = useState('trending');
  const [content, setContent] = useState('');
  const { discussions, addDiscussion } = useDiscussions();
  const [localDiscussions, setLocalDiscussions] = useState(discussions);

  // Update local discussions when global discussions change
  useEffect(() => {
    setLocalDiscussions(discussions);
  }, [discussions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    const newDiscussion = {
      title: content,
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

    // Update local state immediately for better UX
    setLocalDiscussions(prev => [newDiscussion, ...prev]);
    setContent('');
  };

  // Sort discussions based on selected sort option
  const sortedDiscussions = [...localDiscussions].sort((a, b) => {
    if (sortBy === 'trending') {
      return b.upvotes - a.upvotes;
    }
    // Sort by date for 'latest'
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-[320px,1fr] gap-8">
        {/* Sidebar - Now on the left */}
        <DiscussionSidebar />

        {/* Main Content */}
        <div>
          {/* New Discussion Input */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-background">
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
                  disabled={!isAuthenticated}
                />
                
                {isAuthenticated && (
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
                      Push
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Sort Options */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant={sortBy === 'trending' ? 'default' : 'outline'}
              onClick={() => setSortBy('trending')}
            >
              Trending
            </Button>
            <Button
              variant={sortBy === 'latest' ? 'default' : 'outline'}
              onClick={() => setSortBy('latest')}
            >
              Latest
            </Button>
          </div>

          {/* Threads */}
          <div className="space-y-6">
            {sortedDiscussions.map((thread) => (
              <Thread key={thread.id} thread={thread} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}