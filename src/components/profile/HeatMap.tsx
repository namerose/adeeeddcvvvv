import { Activity } from '@/types/activity';
import { Card } from '@/components/ui/card';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeatMapProps {
  activities: Activity[];
}

export function HeatMap({ activities }: HeatMapProps) {
  // Create array of last 365 days
  const today = new Date();
  const days = Array.from({ length: 365 }, (_, i) => subDays(today, 364 - i));

  // Count activities per day
  const activityCounts = days.reduce((acc, day) => {
    const count = activities.filter(activity => 
      isSameDay(new Date(activity.timestamp), day)
    ).length;
    acc[format(day, 'yyyy-MM-dd')] = count;
    return acc;
  }, {} as Record<string, number>);

  // Get intensity level (0-4) based on activity count
  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  // Group days by week
  const weeks = days.reduce((acc, day, i) => {
    const weekIndex = Math.floor(i / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = [];
    }
    acc[weekIndex].push(day);
    return acc;
  }, [] as Date[][]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => {
                const date = format(day, 'yyyy-MM-dd');
                const count = activityCounts[date] || 0;
                const intensity = getIntensity(count);

                return (
                  <TooltipProvider key={date}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div 
                          className={`w-3 h-3 rounded-sm ${
                            intensity === 0 
                              ? 'bg-muted' 
                              : `bg-primary hover:bg-primary/90 cursor-pointer`
                          }`}
                          style={{ 
                            opacity: intensity === 0 ? 0.2 : intensity * 0.25 
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {count} activities on {format(day, 'MMM d, yyyy')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div
              key={intensity}
              className="w-3 h-3 rounded-sm bg-primary"
              style={{ 
                opacity: intensity === 0 ? 0.2 : intensity * 0.25 
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}