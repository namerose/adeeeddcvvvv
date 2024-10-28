import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Video, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useEvents } from '@/context/EventContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { LoginDialog } from '../auth/LoginDialog';

interface RegisterEventDialogProps {
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
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterEventDialog({ event, open, onOpenChange }: RegisterEventDialogProps) {
  const [showLogin, setShowLogin] = useState(false);
  const { registerForEvent, isRegistered } = useEvents();
  const { isAuthenticated } = useAuth();

  const handleRegister = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    registerForEvent(event.id);
    onOpenChange(false);
  };

  if (showLogin) {
    return <LoginDialog />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>
            Review the event details and confirm your registration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={event.organizer.avatar} />
              <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                Organized by {event.organizer.name}
              </p>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(event.date), 'MMM d, yyyy • h:mm a')} -{' '}
                {format(new Date(event.endDate), 'h:mm a')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              {event.location === 'Virtual' ? (
                <Video className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.attendees} attending</span>
            </div>

            {event.price !== 'Free' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Price: {event.price}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge>{event.type}</Badge>
            <Badge variant="outline">{event.price}</Badge>
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegister}>
              {isRegistered(event.id) ? 'Already Registered' : 'Confirm Registration'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}