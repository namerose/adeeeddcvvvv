import { LucideIcon } from 'lucide-react';

export type BadgeCategory = 'special' | 'engagement' | 'achievement' | 'contribution';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: BadgeCategory;
  tier: BadgeTier;
  unlockedAt?: string;
}

export interface BadgeCriteria {
  projectsUpvoted?: number;
  projectsLaunched?: number;
  commentsPosted?: number;
  discussionsStarted?: number;
  commentUpvotes?: number;
}

export interface UserBadgeProgress {
  badges: Badge[];
  criteria: BadgeCriteria;
}