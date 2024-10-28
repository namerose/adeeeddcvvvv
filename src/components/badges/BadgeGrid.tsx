import { Badge } from '@/types/badge';
import { BadgeDisplay } from './BadgeDisplay';
import { BADGES } from '@/lib/badges';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BadgeGridProps {
  userBadges: Badge[];
  showAll?: boolean;
}

export function BadgeGrid({ userBadges, showAll = false }: BadgeGridProps) {
  const categories = ['All', 'Engagement', 'Achievement', 'Contribution', 'Special'];

  return (
    <Tabs defaultValue="All">
      <TabsList className="mb-4">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {BADGES
              .filter(badge => 
                category === 'All' || 
                badge.category === category.toLowerCase()
              )
              .map((badge) => {
                const userHasBadge = userBadges.find(b => b.id === badge.id);
                
                // If showAll is false, only show earned badges
                if (!showAll && !userHasBadge) return null;

                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card hover:bg-accent transition-colors"
                  >
                    <BadgeDisplay
                      badge={userHasBadge || badge}
                      showProgress={!userHasBadge}
                    />
                    <div className="text-center">
                      <h4 className="font-medium text-sm">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {userHasBadge ? 'Unlocked' : 'Locked'}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}