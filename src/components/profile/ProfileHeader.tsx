import { ProfileTheme } from '@/types/profile-theme';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Link2, Twitter, Github, Linkedin } from 'lucide-react';
import { ProfileBadges } from './ProfileBadges';
import { ProfileAvatar } from './ProfileAvatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

interface ProfileHeaderProps {
  user: User;
  theme: ProfileTheme;
  isOwner?: boolean;
  onAvatarChange?: (file: File) => Promise<void>;
  onAvatarRemove?: () => Promise<void>;
  avatarPreview?: string | null;
  stats: {
    projects: number;
    upvoted: number;
    badges: number;
    followers: number;
  };
}

export function ProfileHeader({
  user,
  theme,
  isOwner,
  onAvatarChange,
  onAvatarRemove,
  avatarPreview,
  stats
}: ProfileHeaderProps) {
  const { userBadges } = useBadges();

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Banner */}
      <div 
        className={cn(
          "h-48 relative",
          !theme.backgroundImage && theme.gradient && `bg-gradient-${theme.gradient}`,
          !theme.backgroundImage && theme.pattern && `bg-${theme.pattern}`
        )}
        style={theme.backgroundImage ? {
          backgroundImage: `url(${theme.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Profile Info */}
      <div className="bg-background border rounded-b-lg">
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 z-10">
            <ProfileAvatar
              src={avatarPreview || user.avatar}
              name={user.name}
              size="xl"
              editable={isOwner}
              onAvatarChange={onAvatarChange}
              onAvatarRemove={onAvatarRemove}
            />
          </div>

          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              
              {user.bio && (
                <p className="mt-2 text-sm max-w-2xl">{user.bio}</p>
              )}

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-4">
                {user.website && (
                  <a 
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Link2 className="h-5 w-5" />
                  </a>
                )}
                {user.twitter && (
                  <a 
                    href={`https://twitter.com/${user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {user.github && (
                  <a 
                    href={`https://github.com/${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {user.linkedin && (
                  <a 
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          {theme.showStats !== false && (
            <div className="grid grid-cols-4 gap-4 mt-6 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.projects}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.upvoted}</div>
                <div className="text-sm text-muted-foreground">Upvoted</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.badges}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </div>
          )}

          {/* Recent Badges */}
          {theme.showBadges !== false && userBadges && userBadges.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Badges</h3>
              <ProfileBadges badges={userBadges.slice(0, 5)} showProgress={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}