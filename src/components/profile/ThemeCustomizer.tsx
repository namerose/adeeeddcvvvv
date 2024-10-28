import { useState } from 'react';
import { Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ProfileTheme, 
  ThemeColor, 
  ThemeFont,
  ThemePattern,
  ThemeGradient,
  THEME_COLORS, 
  THEME_FONTS,
  THEME_PATTERNS,
  THEME_GRADIENTS
} from '@/types/profile-theme';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: ProfileTheme;
  onThemeChange: (theme: ProfileTheme) => void;
}

export function ThemeCustomizer({
  open,
  onOpenChange,
  currentTheme,
  onThemeChange,
}: ThemeCustomizerProps) {
  const [theme, setTheme] = useState<ProfileTheme>(currentTheme);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(currentTheme.bannerImage || null);
  const { user, updateTheme } = useAuth();
  const { toast } = useToast();

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
        setTheme(prev => ({ ...prev, bannerImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

const handleSave = async () => {
  try {
    onThemeChange(theme);
    onOpenChange(false);
    toast({
      title: "Theme updated",
      description: "Your profile theme has been updated successfully."
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update theme. Please try again.",
      variant: "destructive"
    });
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customize Profile Theme</DialogTitle>
          <DialogDescription>
            Personalize your profile appearance with custom colors, fonts, and patterns
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="gradients">Gradients</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <Label>Color Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                <button
                  key={color}
                  className={cn(
                    "h-20 rounded-lg relative overflow-hidden cursor-pointer ring-offset-background transition-all hover:scale-105",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    theme.color === color && "ring-2 ring-primary"
                  )}
                  onClick={() => setTheme(prev => ({ ...prev, color }))}
                >
                  <div className={cn("h-1/2", THEME_COLORS[color].primary)} />
                  <div className={cn("h-1/2", THEME_COLORS[color].secondary)} />
                  {theme.color === color && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <Label>Font Style</Label>
            <RadioGroup
              value={theme.font}
              onValueChange={(font: ThemeFont) => 
                setTheme(prev => ({ ...prev, font }))
              }
              className="grid grid-cols-2 gap-4"
            >
              {(Object.entries(THEME_FONTS)).map(([key, { name, className, description }]) => (
                <label
                  key={key}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent",
                    theme.font === key && "border-primary bg-accent",
                    className
                  )}
                >
                  <RadioGroupItem value={key} className="sr-only" />
                  <div className="font-semibold text-lg">
                    {name}
                  </div>
                  <div className="text-sm">
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {description}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Label>Background Pattern</Label>
            <RadioGroup
              value={theme.pattern}
              onValueChange={(pattern: ThemePattern) => 
                setTheme(prev => ({ ...prev, pattern }))
              }
              className="grid grid-cols-3 gap-4"
            >
              {(Object.entries(THEME_PATTERNS)).map(([key, { name, className, description }]) => (
                <label
                  key={key}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent overflow-hidden",
                    theme.pattern === key && "border-primary bg-accent"
                  )}
                >
                  <RadioGroupItem value={key} className="sr-only" />
                  <div className={cn(
                    "absolute inset-0 opacity-10",
                    className
                  )} />
                  <div className="font-semibold relative">{name}</div>
                  <div className="text-xs text-center text-muted-foreground relative">
                    {description}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="gradients" className="space-y-4">
            <Label>Background Gradient</Label>
            <RadioGroup
              value={theme.gradient}
              onValueChange={(gradient: ThemeGradient) => 
                setTheme(prev => ({ ...prev, gradient }))
              }
              className="grid grid-cols-3 gap-4"
            >
              {(Object.entries(THEME_GRADIENTS)).map(([key, { name, className, description }]) => (
                <label
                  key={key}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent overflow-hidden",
                    theme.gradient === key && "border-primary bg-accent"
                  )}
                >
                  <RadioGroupItem value={key} className="sr-only" />
                  <div className={cn(
                    "absolute inset-0",
                    className
                  )} />
                  <div className="font-semibold relative text-white mix-blend-difference">
                    {name}
                  </div>
                  <div className="text-xs text-center text-white mix-blend-difference relative">
                    {description}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </TabsContent>
        </Tabs>

        {/* Banner Image */}
        <div className="space-y-4">
          <Label>Profile Banner</Label>
          <div className="relative">
            <div 
              className={cn(
                "h-32 rounded-lg border-2 border-dashed flex items-center justify-center",
                bannerPreview ? "border-0" : "border-muted-foreground/25"
              )}
            >
              {bannerPreview ? (
                <img 
                  src={bannerPreview} 
                  alt="Banner preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mt-2 block">
                    Upload banner image
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {bannerPreview && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setBannerPreview(null);
                  setBannerFile(null);
                  setTheme(prev => ({ ...prev, bannerImage: undefined }));
                }}
              >
                Remove banner
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}