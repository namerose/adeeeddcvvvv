import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flag, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

// Demo data
const reports = [
  {
    id: 1,
    type: 'comment',
    content: 'This is spam content promoting unauthorized services',
    reporter: {
      name: 'John Doe',
      avatar: 'https://avatar.vercel.sh/john'
    },
    reported: {
      name: 'Spam Account',
      avatar: 'https://avatar.vercel.sh/spam'
    },
    time: '5 minutes ago',
    status: 'pending'
  },
  {
    id: 2,
    type: 'project',
    content: 'Project contains inappropriate or offensive content',
    reporter: {
      name: 'Emma Wilson',
      avatar: 'https://avatar.vercel.sh/emma'
    },
    reported: {
      name: 'Bad Project',
      avatar: 'https://avatar.vercel.sh/bad'
    },
    time: '15 minutes ago',
    status: 'pending'
  },
  {
    id: 3,
    type: 'user',
    content: 'User is harassing others in discussions',
    reporter: {
      name: 'Mike Chen',
      avatar: 'https://avatar.vercel.sh/mike'
    },
    reported: {
      name: 'Toxic User',
      avatar: 'https://avatar.vercel.sh/toxic'
    },
    time: '1 hour ago',
    status: 'pending'
  }
];

export function ModQueue() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Moderation Queue</h2>
          <Badge variant="destructive" className="rounded-full">
            {reports.length}
          </Badge>
        </div>
        <Button variant="outline">View All</Button>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Flag className="h-4 w-4 text-red-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={report.reporter.avatar} />
                  <AvatarFallback>{report.reporter.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{report.reporter.name}</span>
                <span className="text-muted-foreground">reported</span>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={report.reported.avatar} />
                  <AvatarFallback>{report.reported.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{report.reported.name}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-2">{report.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {report.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {report.time}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <ThumbsDown className="h-4 w-4" />
                    Dismiss
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    Take Action
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}