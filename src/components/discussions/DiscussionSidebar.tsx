import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp, Users, MessageSquare, Tag, Search } from 'lucide-react';
import { useDiscussions } from '@/context/DiscussionContext';
import { useEffect, useMemo, useState } from 'react';
import { Discussion } from '@/types/discussion';
import { userOperations } from '@/lib/db';

export function DiscussionSidebar() {
  const { discussions } = useDiscussions();
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  // Ambil active users dari database
  useEffect(() => {
    const loadActiveUsers = async () => {
      const users = await userOperations.getAll();
      // Filter user yang aktif dalam 24 jam terakhir
      const activeUsers = users.filter(user => {
        const lastActive = new Date(user.lastActive);
        const now = new Date();
        const diff = now.getTime() - lastActive.getTime();
        return diff < 24 * 60 * 60 * 1000; // 24 jam
      });
      setActiveUsers(activeUsers.slice(0, 3)); // Ambil 3 user teraktif
    };

    loadActiveUsers();
  }, []);

  // Hitung trending threads berdasarkan upvotes dan waktu
  const trendingThreads = useMemo(() => {
    return [...discussions]
      .sort((a, b) => {
        // Hitung skor berdasarkan upvotes dan waktu
        const aScore = (a.upvotes || 0) + (new Date(a.createdAt).getTime() / 1000000000);
        const bScore = (b.upvotes || 0) + (new Date(b.createdAt).getTime() / 1000000000);
        return bScore - aScore;
      })
      .slice(0, 3); // Ambil 3 thread teratas
  }, [discussions]);

  // Hitung popular tags dari semua diskusi
  const popularTags = useMemo(() => {
    const tagCounts = discussions.reduce((acc, discussion) => {
      discussion.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [discussions]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search discussions..." 
          className="pl-9 bg-muted/50"
        />
      </div>

      {/* Trending Threads */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="font-semibold text-lg">Trending Threads</h2>
        </div>
        <div className="space-y-4">
          {trendingThreads.map((thread) => (
            <div key={thread.id} className="flex items-start gap-3 group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={thread.author.avatar} />
                <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm group-hover:text-primary truncate">
                  {thread.content || thread.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {thread.upvotes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {thread.replies?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Users */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-green-500" />
          <h2 className="font-semibold text-lg">Active Users</h2>
        </div>
        <div className="space-y-4">
          {activeUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.role || 'Member'}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Popular Tags */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-blue-500" />
          <h2 className="font-semibold text-lg">Popular Tags</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Button
              key={tag.name}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-muted/50"
            >
              {tag.name}
              <Badge variant="secondary" className="ml-1">
                {tag.count}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Community Guidelines */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <h3 className="font-semibold mb-2">Community Guidelines</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Help us maintain a healthy and constructive discussion environment.
        </p>
        <Button variant="outline" className="w-full">
          Read Guidelines
        </Button>
      </Card>
    </div>
  );
}
