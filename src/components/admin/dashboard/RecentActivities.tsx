import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  Rocket,
  MessageSquare,
  Flag,
  UserPlus,
  Star,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo data
const activities = [
  {
    id: 1,
    type: 'project_launch',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://avatar.vercel.sh/sarah'
    },
    content: 'launched a new project',
    target: 'AI Code Assistant',
    time: new Date(Date.now() - 25 * 60 * 1000)
  },
  {
    id: 2,
    type: 'report',
    user: {
      name: 'Mike Wilson',
      avatar: 'https://avatar.vercel.sh/mike'
    },
    content: 'reported a comment',
    target: 'Inappropriate content',
    time: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 3,
    type: 'new_user',
    user: {
      name: 'Emma Davis',
      avatar: 'https://avatar.vercel.sh/emma'
    },
    content: 'joined the platform',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'featured',
    user: {
      name: 'Admin',
      avatar: 'https://avatar.vercel.sh/admin'
    },
    content: 'featured a project',
    target: 'Design System Builder',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: 5,
    type: 'comment',
    user: {
      name: 'Alex Rivera',
      avatar: 'https://avatar.vercel.sh/alex'
    },
    content: 'commented on',
    target: 'React Component Library',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

const activityIcons = {
  project_launch: Rocket,
  report: Flag,
  new_user: UserPlus,
  featured: Star,
  comment: MessageSquare,
  moderation: Shield
};

const activityColors = {
  project_launch: 'text-green-500 bg-green-500/10',
  report: 'text-red-500 bg-red-500/10',
  new_user: 'text-blue-500 bg-blue-500/10',
  featured: 'text-yellow-500 bg-yellow-500/10',
  comment: 'text-purple-500 bg-purple-500/10',
  moderation: 'text-orange-500 bg-orange-500/10'
};

export function RecentActivities() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Recent Activities</h2>
      
      <div className="space-y-6">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={cn("p-2 rounded-lg", colorClass)}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground">{activity.content}</span>
                  {activity.target && (
                    <Badge variant="secondary">{activity.target}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}