import { Badge } from '@/types/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lock, Check } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useBadges } from '@/context/BadgeContext';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badge: Badge;
  isUnlocked: boolean;
}

export function BadgeDisplay({ badge, isUnlocked }: BadgeDisplayProps) {
  const { getBadgeProgress } = useBadges();
  const progress = getBadgeProgress(badge.id);

  const tierColors = {
    bronze: 'bg-orange-500/10 text-orange-500',
    silver: 'bg-slate-500/10 text-slate-500',
    gold: 'bg-yellow-500/10 text-yellow-500',
    platinum: 'bg-violet-500/10 text-violet-500'
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className={cn(
          "p-4 cursor-pointer transition-all hover:shadow-md",
          !isUnlocked && "opacity-50"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-2 rounded-lg",
              tierColors[badge.tier]
            )}>
              <badge.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{badge.name}</h3>
                {isUnlocked ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {progress && !isUnlocked && (
                <div className="mt-2">
                  <Progress value={(progress.current / progress.required) * 100} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress.current}/{progress.required}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">{badge.name}</h4>
          <p className="text-sm text-muted-foreground">
            {badge.description}
          </p>
          {isUnlocked && (
            <p className="text-xs text-muted-foreground">
              Unlocked on {new Date(badge.unlockedAt!).toLocaleDateString()}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}