import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar as CalendarIcon, MapPin, Users, Video, Clock, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { CreateEventDialog } from './events/CreateEventDialog';
import { EventCard } from './events/EventCard';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Demo events data
const EVENTS = [
  {
    id: '1',
    title: 'Building AI-Powered Applications Workshop',
    description: 'Learn how to integrate AI capabilities into your applications using modern tools and frameworks.',
    type: 'Workshop',
    date: '2024-04-15T10:00:00Z',
    endDate: '2024-04-15T16:00:00Z',
    location: 'Virtual',
    organizer: {
      name: 'TechLearn Academy',
      avatar: 'https://avatar.vercel.sh/techlearn'
    },
    attendees: 156,
    category: 'AI & Machine Learning',
    price: 'Free',
    tags: ['AI', 'Development', 'Workshop'],
    featured: true,
    gradient: 'bg-gradient-ocean'
  },
  {
    id: '2',
    title: 'Product Launch Mastery: From Idea to Market',
    description: 'Join successful founders and learn the strategies for a successful product launch.',
    type: 'Conference',
    date: '2024-04-20T09:00:00Z',
    endDate: '2024-04-20T17:00:00Z',
    location: 'Hybrid - New York & Virtual',
    organizer: {
      name: 'Launch Academy',
      avatar: 'https://avatar.vercel.sh/launch'
    },
    attendees: 342,
    category: 'Product Launch',
    price: '$99',
    tags: ['Product', 'Marketing', 'Strategy'],
    featured: true,
    gradient: 'bg-gradient-sunset'
  },
  {
    id: '3',
    title: 'Open Source Contributors Meetup',
    description: 'Monthly meetup for open source contributors to network and share experiences.',
    type: 'Meetup',
    date: '2024-04-25T18:00:00Z',
    endDate: '2024-04-25T20:00:00Z',
    location: 'Virtual',
    organizer: {
      name: 'OSS Community',
      avatar: 'https://avatar.vercel.sh/oss'
    },
    attendees: 89,
    category: 'Community',
    price: 'Free',
    tags: ['OpenSource', 'Community', 'Networking'],
    gradient: 'bg-gradient-forest'
  }
];

const CATEGORIES = [
  { name: 'All Events', value: 'all', gradient: 'from-violet-500 to-purple-500' },
  { name: 'Workshops', value: 'workshop', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Conferences', value: 'conference', gradient: 'from-orange-500 to-red-500' },
  { name: 'Meetups', value: 'meetup', gradient: 'from-green-500 to-emerald-500' },
  { name: 'Hackathons', value: 'hackathon', gradient: 'from-pink-500 to-rose-500' },
  { name: 'Product Demos', value: 'demo', gradient: 'from-yellow-500 to-amber-500' }
];

export function Events() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState('all');
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 mb-8 bg-gradient-to-r from-violet-500 to-purple-500">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2">Tech Events</h1>
          <p className="text-white/80">
            Discover and join amazing tech events, workshops, and meetups
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-9"
            />
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={category === cat.value ? "default" : "outline"}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "whitespace-nowrap transition-all",
              category === cat.value && `bg-gradient-to-r ${cat.gradient} hover:opacity-90`
            )}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Featured Events */}
      {view === 'list' && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EVENTS.filter(event => event.featured).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
        {/* Events List/Calendar */}
        <div>
          <Tabs value={view}>
            <TabsContent value="list" className="space-y-6 mt-0">
              {/* List view remains the same */}
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <Card className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                />
                
                {/* Events for selected date */}
                <div className="mt-6">
                  <h3 className="font-medium mb-4">
                    Events on {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <div className="space-y-4">
                    {EVENTS.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg transition-colors",
                          event.gradient || "bg-card hover:bg-accent"
                        )}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(new Date(event.date), 'h:mm a')}
                            </span>
                            <span className="flex items-center gap-1">
                              {event.location === 'Virtual' ? (
                                <Video className="h-4 w-4" />
                              ) : (
                                <MapPin className="h-4 w-4" />
                              )}
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.attendees} attending
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="secondary"
                          className="bg-background hover:bg-background/90 text-foreground"
                        >
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Events */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <h3 className="font-semibold mb-4">Your Events</h3>
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-sm text-white/80">
                  You haven't registered for any events yet.
                </p>
                <Button className="w-full bg-white/20 hover:bg-white/30">
                  Browse Events
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-white/80 mb-4">
                  Sign in to track your events
                </p>
                <Button className="bg-white text-primary hover:bg-white/90">
                  Sign In
                </Button>
              </div>
            )}
          </Card>

          {/* Popular Categories */}
          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <div className="space-y-2">
              {[
                { name: 'AI & Machine Learning', count: 24 },
                { name: 'Web Development', count: 18 },
                { name: 'Product Management', count: 15 },
                { name: 'UX Design', count: 12 },
                { name: 'Blockchain', count: 9 },
              ].map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="bg-white/20">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Featured Speakers */}
          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <h3 className="font-semibold mb-4">Featured Speakers</h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'AI Research Lead',
                  avatar: 'https://avatar.vercel.sh/sarah'
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'Senior Product Manager',
                  avatar: 'https://avatar.vercel.sh/michael'
                },
                {
                  name: 'Emily Watson',
                  role: 'UX Design Director',
                  avatar: 'https://avatar.vercel.sh/emily'
                }
              ].map((speaker) => (
                <div key={speaker.name} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={speaker.avatar} />
                    <AvatarFallback>{speaker.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{speaker.name}</p>
                    <p className="text-sm text-white/80">{speaker.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
