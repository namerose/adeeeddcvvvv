import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flame, TrendingUp, Users } from 'lucide-react';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { projects } = useProjects();
  const { user } = useAuth();

   // Calculate trending topics based on project tags and upvotes
  const trendingTopics = useMemo(() => {
    const topicCounts = new Map<string, number>();
    
    projects.forEach(project => {
      project.tags?.forEach(tag => {
        const currentCount = topicCounts.get(tag) || 0;
        topicCounts.set(tag, currentCount + project.upvotes);
      });
    });

    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [projects]);

  // Calculate top makers based on total upvotes across their projects
  const topMakers = useMemo(() => {
    const makerStats = new Map<string, {
      id: string;
      name: string;
      username: string;
      avatar: string;
      launches: number;
      upvotes: number;
    }>();

    projects.forEach(project => {
      if (project.author) {
        const current = makerStats.get(project.author.id) || {
          id: project.author.id,
          name: project.author.name,
          username: project.author.username || `@${project.author.name.toLowerCase().replace(' ', '')}`,
          avatar: project.author.avatar,
          launches: 0,
          upvotes: 0
        };

        makerStats.set(project.author.id, {
          ...current,
          launches: current.launches + 1,
          upvotes: current.upvotes + project.upvotes
        });
      }
    });

    return Array.from(makerStats.values())
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);
  }, [projects]);

  // Get recent activity feed including project submissions
  const activityFeed = useMemo(() => {
    const activities: Array<{
      user: { name: string; avatar: string };
      action: string;
      project: string;
      comment?: string;
      time: string;
    }> = [];

    // Add project submissions
    projects.forEach(project => {
      if (project.author) {
        activities.push({
          user: {
            name: project.author.name,
            avatar: project.author.avatar || `https://avatar.vercel.sh/${project.author.name}`
          },
          action: 'launched',
          project: project.title,
          time: project.launchDate ? formatDistanceToNow(new Date(project.launchDate), { addSuffix: true }) : 'recently'
        });
      }

      // Add recent upvotes
      Array.from(project.voters || []).forEach(voterId => {
        const voter = project.comments?.find(c => c.author.id === voterId)?.author;
        if (voter) {
          activities.push({
            user: { 
              name: voter.name, 
              avatar: voter.avatar || `https://avatar.vercel.sh/${voter.name}`
            },
            action: 'upvoted',
            project: project.title,
            time: 'recently'
          });
        }
      });

      // Add recent comments
      project.comments?.slice(-2).forEach(comment => {
        activities.push({
          user: {
            name: comment.author.name,
            avatar: comment.author.avatar || `https://avatar.vercel.sh/${comment.author.name}`
          },
          action: 'commented on',
          project: project.title,
          comment: `"${comment.content}"`,
          time: comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'recently'
        });
      });
    });

    // Sort by time (newest first) and take the most recent 6 activities
    return activities
      .sort((a, b) => {
        if (a.action === 'launched' && b.action !== 'launched') return -1;
        if (a.action !== 'launched' && b.action === 'launched') return 1;
        return 0;
      })
      .slice(0, 6);
  }, [projects]);

  return (
    <div className="w-80 space-y-8">
      {/* Trending Topics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="font-semibold text-lg">Trending Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <Button
              key={topic.name}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              {topic.name}
              <Badge variant="secondary" className="ml-1">
                {topic.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Top Makers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h2 className="font-semibold text-lg">Top Makers</h2>
        </div>
        <div className="space-y-4">
          {topMakers.map((maker) => (
            <Card key={maker.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={maker.avatar} />
                  <AvatarFallback>{maker.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{maker.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {maker.username}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">{maker.launches}</div>
                  <div className="text-muted-foreground">launches</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Feed */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-500" />
          <h2 className="font-semibold text-lg">Community Feed</h2>
        </div>
        <div className="space-y-4">
          {activityFeed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity yet
            </p>
          ) : (
            activityFeed.map((activity, i) => (
              <div key={i} className="flex gap-3 group">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-sm">
                  <p>
                    <span className="font-medium hover:text-primary cursor-pointer">
                      {activity.user.name}
                    </span>{' '}
                    <span className={cn(
                      activity.action === 'launched' && 'text-green-500 font-medium',
                      activity.action === 'upvoted' && 'text-orange-500',
                      activity.action === 'commented on' && 'text-blue-500'
                    )}>
                      {activity.action}
                    </span>{' '}
                    <span className="text-primary hover:underline cursor-pointer group-hover:text-primary/80">
                      {activity.project}
                    </span>
                  </p>
                  {activity.comment && (
                    <p className="mt-1 text-muted-foreground line-clamp-2">
                      {activity.comment}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}