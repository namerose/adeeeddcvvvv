import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileBadgesProps {
  isVerified?: boolean;
  isOnline?: boolean;
  className?: string;
}

export function ProfileBadges({ isVerified, isOnline, className }: ProfileBadgesProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isVerified && (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              Verified
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verified Account</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1",
              isOnline ? "border-green-500 text-green-500" : "border-muted-foreground"
            )}
          >
            <div className={cn(
              "h-2 w-2 rounded-full",
              isOnline ? "bg-green-500" : "bg-muted-foreground"
            )} />
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last active {isOnline ? "now" : "2 hours ago"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}