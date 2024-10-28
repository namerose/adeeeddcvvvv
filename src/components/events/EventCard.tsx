import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Video, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useEvents } from '@/context/EventContext';
import { RegisterEventDialog } from './RegisterEventDialog';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    type: string;
    date: string;
    endDate: string;
    location: string;
    organizer: {
      name: string;
      avatar: string;
    };
    attendees: number;
    category: string;
    price: string;
    tags: string[];
    gradient?: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const { isRegistered, unregisterFromEvent } = useEvents();
  const hasRegistered = isRegistered(event.id);

  return (
    <>
      <div className={cn(
        "border rounded-lg overflow-hidden hover:shadow-lg transition-all",
        event.gradient,
        "bg-white dark:bg-transparent" // Add white background for light mode
      )}>
        {/* Event Header */}
        <div className="p-6 space-y-4 relative"> {/* Add relative positioning */}
          {/* Add gradient overlay for better contrast in light mode */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent dark:from-transparent dark:to-transparent" />
          
          <div className="relative"> {/* Make content relative to appear above overlay */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/90 text-black hover:bg-white/75 dark:bg-white/20 dark:text-white dark:hover:bg-white/30">
                    {event.type}
                  </Badge>
                  <Badge variant="outline" className="border-white/90 text-black bg-white/50 dark:border-white/20 dark:text-white dark:bg-transparent">
                    {event.price}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white hover:opacity-90 cursor-pointer">
                  {event.title}
                </h3>
              </div>
              <Avatar className="h-12 w-12 ring-2 ring-white/90 dark:ring-white/20">
                <AvatarImage src={event.organizer.avatar} />
                <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            <p className="text-black/90 dark:text-white/80 line-clamp-2 mt-2">
              {event.description}
            </p>

            {/* Event Details */}
            <div className="flex flex-col gap-2 text-sm text-black/80 dark:text-white/80 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(event.date), 'MMM d, yyyy • h:mm a')} -{' '}
                  {format(new Date(event.endDate), 'h:mm a')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {event.location === 'Virtual' ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{event.attendees} attending</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {event.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-white/90 text-black hover:bg-white/75 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Event Footer */}
        <div className="border-t border-white/90 dark:border-white/10 p-4 bg-white/90 dark:bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-black/80 dark:text-white/80">
              By {event.organizer.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasRegistered ? (
              <>
                <Badge variant="secondary" className="gap-2 bg-white/90 text-black dark:bg-white/20 dark:text-white">
                  <Check className="h-4 w-4" />
                  Registered
                </Badge>
                <Button 
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 text-black hover:bg-white/75 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
                  onClick={() => unregisterFromEvent(event.id)}
                >
                  Cancel Registration
                </Button>
              </>
            ) : (
              <Button 
                size="sm"
                className="bg-white text-primary hover:bg-white/90 dark:bg-white dark:text-primary dark:hover:bg-white/90"
                onClick={() => setShowRegisterDialog(true)}
              >
                Register Now
              </Button>
            )}
          </div>
        </div>
      </div>

      <RegisterEventDialog 
        event={event}
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
      />
    </>
  );
}