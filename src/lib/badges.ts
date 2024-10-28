import { Badge } from '@/types/badge';
import {
  Award,
  Star,
  MessageSquare,
  Rocket,
  Heart,
  Users,
  Zap,
  Trophy,
  Target,
  Crown,
  Shield
} from 'lucide-react';

export const BADGES: Badge[] = [
  // Special Badges
  {
    id: 'early-supporter',
    name: 'Early Supporter',
    description: 'One of the first 250 members to join our community',
    icon: Shield,
    category: 'special',
    tier: 'platinum'
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Joined during the platform launch',
    icon: Award,
    category: 'special',
    tier: 'platinum'
  },

  // Engagement Badges
  {
    id: 'first-upvote',
    name: 'First Supporter',
    description: 'Upvoted your first project',
    icon: Heart,
    category: 'engagement',
    tier: 'bronze'
  },
  {
    id: 'super-supporter',
    name: 'Super Supporter',
    description: 'Upvoted 50 projects',
    icon: Star,
    category: 'engagement',
    tier: 'silver'
  },
  {
    id: 'community-pillar',
    name: 'Community Pillar',
    description: 'Upvoted 200 projects',
    icon: Users,
    category: 'engagement',
    tier: 'gold'
  },

  // Achievement Badges
  {
    id: 'first-launch',
    name: 'First Launch',
    description: 'Launched your first project',
    icon: Rocket,
    category: 'achievement',
    tier: 'bronze'
  },
  {
    id: 'serial-launcher',
    name: 'Serial Launcher',
    description: 'Launched 5 projects',
    icon: Zap,
    category: 'achievement',
    tier: 'silver'
  },
  {
    id: 'launch-master',
    name: 'Launch Master',
    description: 'Launched 20 projects',
    icon: Crown,
    category: 'achievement',
    tier: 'gold'
  },

  // Contribution Badges
  {
    id: 'helpful-commenter',
    name: 'Helpful Commenter',
    description: 'Posted 10 meaningful comments',
    icon: MessageSquare,
    category: 'contribution',
    tier: 'bronze'
  },
  {
    id: 'discussion-starter',
    name: 'Discussion Starter',
    description: 'Started 5 engaging discussions',
    icon: Target,
    category: 'contribution',
    tier: 'silver'
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Received 100 upvotes on comments',
    icon: Trophy,
    category: 'contribution',
    tier: 'gold'
  }
];