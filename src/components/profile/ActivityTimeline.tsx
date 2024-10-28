import { Activity } from '@/types/activity';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Rocket,
  MessageSquare,
  Award,
  ThumbsUp,
  MessagesSquare,
  Medal
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { HeatMap } from './HeatMap';

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const activityIcons = {
    project_launch: Rocket,
    project_upvote: ThumbsUp,
    comment: MessageSquare,
    discussion: MessagesSquare,
    badge_earned: Award,
    skill_endorsed: Medal
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'project_launch':
        return `Launched ${activity.data.projectTitle}`;
      case 'project_upvote':
        return `Upvoted ${activity.data.projectTitle}`;
      case 'comment':
        return `Commented on ${activity.data.projectTitle}`;
      case 'discussion':
        return `Started a discussion: ${activity.data.discussionTitle}`;
      case 'badge_earned':
        return `Earned the ${activity.data.badgeName} badge`;
      case 'skill_endorsed':
        return `Received an endorsement for ${activity.data.skillName}`;
      default:
        return '';
    }
  };

  // Group activities by month
  const groupedActivities = activities.reduce((acc, activity) => {
    const month = format(new Date(activity.timestamp), 'MMMM yyyy');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="space-y-8">
      {/* Contribution Heatmap */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contribution Activity</h3>
        <HeatMap activities={activities} />
      </Card>

      {/* Activity Feed */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        
        {Object.entries(groupedActivities).map(([month, monthActivities]) => (
          <div key={month}>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              {month}
            </h4>
            <div className="space-y-4">
              {monthActivities.map((activity) => {
                const Icon = activityIcons[activity.type];
                
                return (
                  <Card key={activity.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg bg-primary/10`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          {getActivityText(activity)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}