import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { BadgeDisplay } from './BadgeDisplay';
import { BADGES } from '@/lib/badges';
import { useBadges } from '@/context/BadgeContext';

export function BadgesPage() {
  const { userBadges } = useBadges();
  
  const categories = [
    { value: 'all', label: 'All Badges' },
    { value: 'special', label: 'Special' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'contribution', label: 'Contribution' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Badges</h1>
        <p className="text-muted-foreground mt-1">
          Earn badges by participating in the community
        </p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {BADGES
                  .filter(badge => 
                    category.value === 'all' || badge.category === category.value
                  )
                  .map((badge) => (
                    <BadgeDisplay
                      key={badge.id}
                      badge={badge}
                      isUnlocked={userBadges.some(b => b.id === badge.id)}
                    />
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}