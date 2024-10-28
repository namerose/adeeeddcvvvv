import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Badge, BadgeCriteria, UserBadgeProgress } from '@/types/badge';
import { BADGES } from '@/lib/badges';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BadgeContextType {
  userBadges: Badge[];
  checkAndAwardBadges: () => void;
  getBadgeProgress: (badgeId: string) => { current: number; required: number } | null;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

// Keep track of total users for Early Supporter badge
const EARLY_SUPPORTER_LIMIT = 250;
const TOTAL_USERS_KEY = 'total_users_count';

export function BadgeProvider({ children }: { children: ReactNode }) {
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [progress, setProgress] = useState<BadgeCriteria>({});
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user's badges from storage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`badges_${user.id}`);
      if (stored) {
        const { badges, criteria } = JSON.parse(stored) as UserBadgeProgress;
        setUserBadges(badges);
        setProgress(criteria);
      }

      // Check for Early Supporter badge
      checkEarlySupporter();
    }
  }, [user]);

  const loadUserBadges = useCallback(() => {
    if (!user) return;
    
    const stored = localStorage.getItem(`badges_${user.id}`);
    if (stored) {
      const { badges, criteria } = JSON.parse(stored) as UserBadgeProgress;
      setUserBadges(badges);
      setProgress(criteria);
    }
  }, [user]);

  // Check if user qualifies for Early Supporter badge
  const checkEarlySupporter = useCallback(() => {
    if (!user) return;

    const totalUsers = parseInt(localStorage.getItem(TOTAL_USERS_KEY) || '0');
    
    if (!localStorage.getItem(`user_number_${user.id}`)) {
      const userNumber = totalUsers + 1;
      localStorage.setItem(TOTAL_USERS_KEY, userNumber.toString());
      localStorage.setItem(`user_number_${user.id}`, userNumber.toString());

      if (userNumber <= EARLY_SUPPORTER_LIMIT) {
        const earlySupporterBadge = BADGES.find(b => b.id === 'early-supporter');
        if (earlySupporterBadge && !userBadges.some(b => b.id === 'early-supporter')) {
          awardBadge(earlySupporterBadge);
        }
      }
    }
  }, [user, userBadges]);

  // Save badges to storage
  const saveBadges = (badges: Badge[], criteria: BadgeCriteria) => {
    if (user) {
      localStorage.setItem(
        `badges_${user.id}`,
        JSON.stringify({ badges, criteria })
      );
    }
  };

  const awardBadge = (badge: Badge) => {
    const updatedBadges = [...userBadges, { ...badge, unlockedAt: new Date().toISOString() }];
    setUserBadges(updatedBadges);
    saveBadges(updatedBadges, progress);

    toast({
      title: "🎉 New Badge Unlocked!",
      description: `You've earned the ${badge.name} badge: ${badge.description}`,
    });
  };

  const checkAndAwardBadges = () => {
    if (!user) return;

    BADGES.forEach(badge => {
      // Skip if user already has this badge
      if (userBadges.some(b => b.id === badge.id)) return;

      // Check criteria and award badge if met
      let shouldAward = false;

      switch (badge.id) {
        case 'first-upvote':
          shouldAward = (progress.projectsUpvoted || 0) >= 1;
          break;
        case 'super-supporter':
          shouldAward = (progress.projectsUpvoted || 0) >= 50;
          break;
        case 'community-pillar':
          shouldAward = (progress.projectsUpvoted || 0) >= 200;
          break;
        case 'first-launch':
          shouldAward = (progress.projectsLaunched || 0) >= 1;
          break;
        case 'serial-launcher':
          shouldAward = (progress.projectsLaunched || 0) >= 5;
          break;
        case 'launch-master':
          shouldAward = (progress.projectsLaunched || 0) >= 20;
          break;
        case 'helpful-commenter':
          shouldAward = (progress.commentsPosted || 0) >= 10;
          break;
        case 'discussion-starter':
          shouldAward = (progress.discussionsStarted || 0) >= 5;
          break;
        // Add more badge criteria checks here
      }

      if (shouldAward) {
        awardBadge(badge);
      }
    });
  };

  const getBadgeProgress = (badgeId: string) => {
    if (!user) return null;

    switch (badgeId) {
      case 'super-supporter':
        return {
          current: progress.projectsUpvoted || 0,
          required: 50
        };
      case 'community-pillar':
        return {
          current: progress.projectsUpvoted || 0,
          required: 200
        };
      case 'serial-launcher':
        return {
          current: progress.projectsLaunched || 0,
          required: 5
        };
      case 'launch-master':
        return {
          current: progress.projectsLaunched || 0,
          required: 20
        };
      case 'early-supporter': {
        const userNumber = parseInt(localStorage.getItem(`user_number_${user.id}`) || '0');
        return userNumber > 0 ? {
          current: Math.min(userNumber, EARLY_SUPPORTER_LIMIT),
          required: EARLY_SUPPORTER_LIMIT
        } : null;
      }
      // Add more progress calculations here
      default:
        return null;
    }
  };

  return (
    <BadgeContext.Provider value={{
      userBadges,
      checkAndAwardBadges,
      getBadgeProgress,
    }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
}