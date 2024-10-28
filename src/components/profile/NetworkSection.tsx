import { useState } from 'react';
import { NetworkUser } from '@/types/connection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConnection } from '@/context/ConnectionContext';
import { useAuth } from '@/context/AuthContext';
import { NetworkGraph } from './NetworkGraph';
import { useNavigate } from '@/hooks/use-navigate';

interface NetworkSectionProps {
  userId: string;
  isOwner?: boolean;
}

export function NetworkSection({ userId, isOwner }: NetworkSectionProps) {
  const [activeTab, setActiveTab] = useState('mutual');
  const { user, isAuthenticated } = useAuth();
  const { 
    getNetworkStats, 
    getMutualConnections,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    isFollowing 
  } = useConnection();
  const { navigate } = useNavigate();

  const stats = getNetworkStats(userId);
  const mutualConnections = getMutualConnections(userId);
  const followers = getFollowers(userId);
  const following = getFollowing(userId);

  const handleFollowToggle = async (targetUserId: string) => {
    if (!isAuthenticated) return;
    
    if (isFollowing(targetUserId)) {
      await unfollowUser(targetUserId);
    } else {
      await followUser(targetUserId);
    }
  };

  const renderUserList = (users: NetworkUser[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="p-4">
          <div className="flex items-center gap-4">
            <Avatar 
              className="h-10 w-10 cursor-pointer"
              onClick={() => navigate(`/u/${user.username}`)}
            >
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 
                    className="font-medium truncate hover:text-primary cursor-pointer"
                    onClick={() => navigate(`/u/${user.username}`)}
                  >
                    {user.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
                {isAuthenticated && user.id !== user.id && (
                  <Button
                    variant={user.isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollowToggle(user.id)}
                  >
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
              {user.bio && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.followers}</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.following}</div>
          <div className="text-sm text-muted-foreground">Following</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.mutualConnections}</div>
          <div className="text-sm text-muted-foreground">Mutual</div>
        </Card>
      </div>

      {/* Network Graph */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Network Visualization</h3>
        <NetworkGraph 
          userId={userId}
          followers={followers}
          following={following}
          mutual={mutualConnections}
        />
      </Card>

      {/* Connection Lists */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="mutual">
            Mutual Connections ({mutualConnections.length})
          </TabsTrigger>
          <TabsTrigger value="followers">
            Followers ({followers.length})
          </TabsTrigger>
          <TabsTrigger value="following">
            Following ({following.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mutual">
          {mutualConnections.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No mutual connections yet
            </Card>
          ) : (
            renderUserList(mutualConnections)
          )}
        </TabsContent>

        <TabsContent value="followers">
          {followers.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No followers yet
            </Card>
          ) : (
            renderUserList(followers)
          )}
        </TabsContent>

        <TabsContent value="following">
          {following.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Not following anyone yet
            </Card>
          ) : (
            renderUserList(following)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}