import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export interface Event {
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
  featured?: boolean;
}

interface EventContextType {
  registeredEvents: Set<string>;
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  isRegistered: (eventId: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const registerForEvent = (eventId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events",
        variant: "destructive",
      });
      return;
    }

    setRegisteredEvents(prev => {
      const updated = new Set(prev);
      updated.add(eventId);
      return updated;
    });

    toast({
      title: "Successfully registered!",
      description: "You have been registered for the event.",
    });
  };

  const unregisterFromEvent = (eventId: string) => {
    setRegisteredEvents(prev => {
      const updated = new Set(prev);
      updated.delete(eventId);
      return updated;
    });

    toast({
      title: "Registration cancelled",
      description: "You have been unregistered from the event.",
    });
  };

  const isRegistered = (eventId: string) => {
    return registeredEvents.has(eventId);
  };

  return (
    <EventContext.Provider value={{
      registeredEvents,
      registerForEvent,
      unregisterFromEvent,
      isRegistered,
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}