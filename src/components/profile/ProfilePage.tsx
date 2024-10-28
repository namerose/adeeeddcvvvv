import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectListItem } from '@/components/ProjectListItem';
import { BadgeDisplay } from '../badges/BadgeDisplay';
import { BADGES } from '@/lib/badges';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProfileTheme } from '@/types/profile-theme';
import { EditProfileDialog } from './EditProfileDialog';
import { ProfileHeader } from './ProfileHeader';
import { ActivityTimeline } from './ActivityTimeline';
import { CustomizeProfileDialog } from './CustomizeProfileDialog';
import { cn } from '@/lib/utils';

const defaultTheme: ProfileTheme = {
  gradient: 'none',
  pattern: 'none',
  showStats: true,
  showBadges: true
};

export function ProfilePage() {
  const { user, isAuthenticated, updateProfile, updateTheme } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ProfileTheme>(user?.theme || defaultTheme);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  const handleAvatarChange = async (file: File) => {
    if (!user) return;

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        
        // Update user profile with new avatar
        const success = await updateProfile(user.id, {
          ...user,
          avatar: result
        });

        if (success) {
          toast({
            title: "Avatar updated",
            description: "Your profile photo has been updated successfully."
          });
        }
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Error",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAvatarRemove = async () => {
    if (!user) return;

    try {
      // Set default avatar using user's username
      const defaultAvatar = `https://avatar.vercel.sh/${user.username}`;
      const success = await updateProfile(user.id, {
        ...user,
        avatar: defaultAvatar
      });

      if (success) {
        setAvatarPreview(defaultAvatar);
        setAvatarFile(null);
        toast({
          title: "Avatar removed",
          description: "Your profile photo has been removed."
        });
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Error",
        description: "Failed to remove profile photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleThemeChange = async (newTheme: ProfileTheme) => {
    if (!user) return;

    try {
      const success = await updateTheme(user.id, newTheme);
      if (success) {
        setCurrentTheme(newTheme);
        toast({
          title: "Profile updated",
          description: "Your profile theme has been updated successfully."
        });
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <div className={cn(
      "min-h-screen transition-all duration-300",
      currentTheme.gradient && `bg-gradient-${currentTheme.gradient}`,
      currentTheme.pattern && `bg-${currentTheme.pattern}`
    )}>
      <div className="max-w-4xl mx-auto py-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          <ProfileHeader
            user={user}
            theme={currentTheme}
            isOwner={true}
            onAvatarChange={handleAvatarChange}
            onAvatarRemove={handleAvatarRemove}
            avatarPreview={avatarPreview}
            stats={{
              projects: 0,
              upvoted: 0,
              badges: 0,
              followers: 0
            }}
          />
          
          {isAuthenticated && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-background/95 backdrop-blur-sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-background/95 backdrop-blur-sm"
                onClick={() => setIsCustomizeDialogOpen(true)}
              >
                Customize Profile
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Card className="bg-background/80 backdrop-blur-sm">
          <Tabs defaultValue="projects" className="p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <div className="text-center text-muted-foreground">
                No projects yet
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTimeline activities={[]} />
            </TabsContent>

            <TabsContent value="badges">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {BADGES.map((badge) => (
                  <BadgeDisplay
                    key={badge.id}
                    badge={badge}
                    isUnlocked={false}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Dialogs */}
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />

        <CustomizeProfileDialog
          open={isCustomizeDialogOpen}
          onOpenChange={setIsCustomizeDialogOpen}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
      </div>
    </div>
  );
}