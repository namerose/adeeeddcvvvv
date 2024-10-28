import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, NetworkStats, NetworkUser } from '@/types/connection';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ConnectionContextType {
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  getNetworkStats: (userId: string) => NetworkStats;
  getMutualConnections: (userId: string) => NetworkUser[];
  getFollowers: (userId: string) => NetworkUser[];
  getFollowing: (userId: string) => NetworkUser[];
  isFollowing: (userId: string) => boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

const STORAGE_KEY = 'network_connections';

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load connections from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setConnections(JSON.parse(stored));
    }
  }, []);

  // Save connections to storage
  const saveConnections = (newConnections: Connection[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConnections));
    setConnections(newConnections);
  };

  const followUser = async (userId: string) => {
    if (!user) return;

    // Check if already following
    if (isFollowing(userId)) {
      toast({
        title: "Already following",
        description: "You are already following this user.",
        variant: "destructive",
      });
      return;
    }

    const newConnection: Connection = {
      id: crypto.randomUUID(),
      followerId: user.id,
      followingId: userId,
      createdAt: new Date().toISOString(),
    };

    saveConnections([...connections, newConnection]);

    toast({
      title: "Success",
      description: "You are now following this user.",
    });
  };

  const unfollowUser = async (userId: string) => {
    if (!user) return;

    const updatedConnections = connections.filter(
      conn => !(conn.followerId === user.id && conn.followingId === userId)
    );

    saveConnections(updatedConnections);

    toast({
      title: "Success",
      description: "You have unfollowed this user.",
    });
  };

  const isFollowing = (userId: string) => {
    if (!user) return false;
    return connections.some(
      conn => conn.followerId === user.id && conn.followingId === userId
    );
  };

  const getNetworkStats = (userId: string): NetworkStats => {
    const followers = connections.filter(conn => conn.followingId === userId);
    const following = connections.filter(conn => conn.followerId === userId);

    // Calculate mutual connections
    const followerIds = new Set(followers.map(f => f.followerId));
    const followingIds = new Set(following.map(f => f.followingId));
    const mutualCount = [...followerIds].filter(id => followingIds.has(id)).length;

    return {
      followers: followers.length,
      following: following.length,
      mutualConnections: mutualCount,
    };
  };

  const getMutualConnections = (userId: string): NetworkUser[] => {
    if (!user) return [];

    // Get user's followers and following
    const userFollowers = new Set(
      connections
        .filter(conn => conn.followingId === userId)
        .map(conn => conn.followerId)
    );

    const userFollowing = new Set(
      connections
        .filter(conn => conn.followerId === userId)
        .map(conn => conn.followingId)
    );

    // Find mutual connections
    const mutualIds = [...userFollowers].filter(id => userFollowing.has(id));

    // Get user details for mutual connections
    const users = JSON.parse(localStorage.getItem('project_launch_users') || '[]');
    return users
      .filter((u: NetworkUser) => mutualIds.includes(u.id))
      .map((u: NetworkUser) => ({
        ...u,
        isFollowing: isFollowing(u.id),
        isFollower: connections.some(
          conn => conn.followerId === u.id && conn.followingId === user.id
        ),
      }));
  };

  const getFollowers = (userId: string): NetworkUser[] => {
    const followerConnections = connections.filter(
      conn => conn.followingId === userId
    );
    const users = JSON.parse(localStorage.getItem('project_launch_users') || '[]');

    return users
      .filter((u: NetworkUser) => 
        followerConnections.some(conn => conn.followerId === u.id)
      )
      .map((u: NetworkUser) => ({
        ...u,
        isFollowing: isFollowing(u.id),
        isFollower: true,
      }));
  };

  const getFollowing = (userId: string): NetworkUser[] => {
    const followingConnections = connections.filter(
      conn => conn.followerId === userId
    );
    const users = JSON.parse(localStorage.getItem('project_launch_users') || '[]');

    return users
      .filter((u: NetworkUser) => 
        followingConnections.some(conn => conn.followingId === u.id)
      )
      .map((u: NetworkUser) => ({
        ...u,
        isFollowing: true,
        isFollower: connections.some(
          conn => conn.followerId === u.id && conn.followingId === user?.id
        ),
      }));
  };

  return (
    <ConnectionContext.Provider value={{
      followUser,
      unfollowUser,
      getNetworkStats,
      getMutualConnections,
      getFollowers,
      getFollowing,
      isFollowing,
    }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
}