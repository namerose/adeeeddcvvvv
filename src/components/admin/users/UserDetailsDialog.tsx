import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Shield, Ban, History, Star, MessageSquare, Calendar } from 'lucide-react';

interface UserDetailsDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Demo data
const userDetails = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://avatar.vercel.sh/john',
  role: 'user',
  status: 'active',
  verified: true,
  createdAt: '2024-01-15T10:00:00Z',
  lastActive: '2024-03-20T15:30:00Z',
  bio: 'Full-stack developer passionate about React and Node.js',
  location: 'San Francisco, CA',
  projects: 12,
  discussions: 45,
  events: 8,
  recentActivity: [
    {
      type: 'project',
      action: 'created a new project',
      target: 'AI Code Assistant',
      date: '2024-03-19T10:00:00Z'
    },
    {
      type: 'discussion',
      action: 'commented on',
      target: 'Future of Web Development',
      date: '2024-03-18T15:30:00Z'
    },
    {
      type: 'event',
      action: 'registered for',
      target: 'React Meetup 2024',
      date: '2024-03-17T09:00:00Z'
    }
  ]
};

export function UserDetailsDialog({ userId, open, onOpenChange }: UserDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Profile */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userDetails.avatar} />
                <AvatarFallback>{userDetails.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{userDetails.name}</h3>
                <p className="text-sm text-muted-foreground">{userDetails.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{userDetails.role}</Badge>
                  <Badge 
                    variant={
                      userDetails.status === 'active' ? 'success' :
                      userDetails.status === 'banned' ? 'destructive' :
                      'secondary'
                    }
                  >
                    {userDetails.status}
                  </Badge>
                  {userDetails.verified && (
                    <Badge variant="outline">Verified</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{userDetails.projects}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{userDetails.discussions}</div>
                <div className="text-sm text-muted-foreground">Discussions</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{userDetails.events}</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Shield className="h-4 w-4" />
                Change Role
              </Button>
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                View Activity
              </Button>
              <Button variant="destructive" className="gap-2">
                <Ban className="h-4 w-4" />
                Ban User
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {userDetails.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 rounded-lg bg-primary/10">
                  {activity.type === 'project' && <Star className="h-4 w-4" />}
                  {activity.type === 'discussion' && <MessageSquare className="h-4 w-4" />}
                  {activity.type === 'event' && <Calendar className="h-4 w-4" />}
                </div>
                <div>
                  <p>
                    <span className="font-medium">{activity.action}</span>
                    {' '}{activity.target}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(activity.date), 'PPp')}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            {/* Security settings would go here */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}