import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { userOperations, projectOperations, activityOperations } from '@/lib/db';
import { ModQueue } from './dashboard/ModQueue';
import { UserGrowthChart } from './dashboard/UserGrowthChart';
import { ProjectStats } from './dashboard/ProjectStats';
import { RecentActivities } from './dashboard/RecentActivities';
import {
  Users,
  Package,
  MessageSquare,
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    banned: number;
    newThisMonth: number;
    growthRate: number;
  };
  projects: {
    total: number;
    published: number;
    upcoming: number;
    featured: number;
    newThisMonth: number;
    growthRate: number;
  };
  activities: {
    total: number;
    discussions: number;
    comments: number;
    events: number;
    recentActivities: any[];
  };
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, [timeframe]);

  const loadDashboardData = async () => {
    try {
      // Load user statistics
      const userStats = await userOperations.getUserStats();
      const allUsers = await userOperations.getAll();
      
      // Calculate new users this month
      const thisMonth = new Date().getMonth();
      const newUsers = allUsers.filter(user => 
        new Date(user.createdAt).getMonth() === thisMonth
      ).length;

      // Load project statistics
      const allProjects = await projectOperations.getAll();
      const publishedProjects = allProjects.filter(p => p.status === 'published');
      const upcomingProjects = allProjects.filter(p => p.status === 'upcoming');
      const featuredProjects = allProjects.filter(p => p.featured);

      // Load recent activities
      const recentActivities = await activityOperations.getRecent(10);

      setStats({
        users: {
          ...userStats,
          newThisMonth: newUsers,
          growthRate: calculateGrowthRate(allUsers, timeframe),
        },
        projects: {
          total: allProjects.length,
          published: publishedProjects.length,
          upcoming: upcomingProjects.length,
          featured: featuredProjects.length,
          newThisMonth: calculateNewProjects(allProjects),
          growthRate: calculateGrowthRate(allProjects, timeframe),
        },
        activities: {
          total: recentActivities.length,
          discussions: countActivitiesByType(recentActivities, 'discussion'),
          comments: countActivitiesByType(recentActivities, 'comment'),
          events: countActivitiesByType(recentActivities, 'event'),
          recentActivities,
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowthRate = (items: any[], timeframe: string) => {
    const now = new Date();
    const periods = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const periodDays = periods[timeframe] || 7;
    const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
    
    const newItems = items.filter(item => new Date(item.createdAt) >= periodStart).length;
    const oldItems = items.filter(item => new Date(item.createdAt) < periodStart).length;
    
    if (oldItems === 0) return 100;
    return ((newItems - oldItems) / oldItems) * 100;
  };

  const calculateNewProjects = (projects: any[]) => {
    const thisMonth = new Date().getMonth();
    return projects.filter(project => 
      new Date(project.createdAt).getMonth() === thisMonth
    ).length;
  };

  const countActivitiesByType = (activities: any[], type: string) => {
    return activities.filter(activity => activity.type === type).length;
  };

  if (loading || !stats) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <Badge variant={stats.users.growthRate > 0 ? "default" : "destructive"}>
              {stats.users.growthRate > 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {Math.abs(stats.users.growthRate).toFixed(1)}%
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{stats.users.total}</h3>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
          <Progress 
            value={(stats.users.active / stats.users.total) * 100} 
            className="mt-4"
          />
          <div className="mt-2 text-sm text-muted-foreground">
            {stats.users.active} active users
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <Badge variant={stats.projects.growthRate > 0 ? "default" : "destructive"}>
              {stats.projects.growthRate > 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {Math.abs(stats.projects.growthRate).toFixed(1)}%
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{stats.projects.total}</h3>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </div>
          <Progress 
            value={(stats.projects.published / stats.projects.total) * 100} 
            className="mt-4"
          />
          <div className="mt-2 text-sm text-muted-foreground">
            {stats.projects.published} published projects
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
            <Badge variant="secondary">
              {stats.activities.discussions} new
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{stats.activities.total}</h3>
            <p className="text-sm text-muted-foreground">Total Activities</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Comments</div>
            <div className="text-right font-medium">{stats.activities.comments}</div>
            <div className="text-muted-foreground">Events</div>
            <div className="text-right font-medium">{stats.activities.events}</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-500" />
            </div>
            <Badge variant="secondary">This month</Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{stats.users.newThisMonth}</h3>
            <p className="text-sm text-muted-foreground">New Users</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Projects</div>
            <div className="text-right font-medium">{stats.projects.newThisMonth}</div>
            <div className="text-muted-foreground">Featured</div>
            <div className="text-right font-medium">{stats.projects.featured}</div>
          </div>
        </Card>
      </div>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-2 gap-6">
        <UserGrowthChart />
        <ProjectStats />
      </div>

      {/* Recent Activity & Moderation */}
      <div className="grid grid-cols-2 gap-6">
        <RecentActivities activities={stats.activities.recentActivities} />
        <ModQueue />
      </div>
    </div>
  );
}