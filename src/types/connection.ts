export interface Connection {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface NetworkStats {
  followers: number;
  following: number;
  mutualConnections: number;
}

export interface NetworkUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  isFollowing?: boolean;
  isFollower?: boolean;
  mutualCount?: number;
}