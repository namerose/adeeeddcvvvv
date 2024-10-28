import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProfileTheme } from '@/types/profile-theme';
import { cn } from '@/lib/utils';
import { Check, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomizeProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: ProfileTheme;
  onThemeChange: (theme: ProfileTheme) => void;
}

const GRADIENTS = [
  {
    name: 'Default',
    value: 'none',
    className: 'bg-background'
  },
  {
    name: 'Sunset',
    value: 'sunset',
    className: 'bg-gradient-sunset'
  },
  {
    name: 'Ocean',
    value: 'ocean',
    className: 'bg-gradient-ocean'
  },
  {
    name: 'Forest',
    value: 'forest',
    className: 'bg-gradient-forest'
  },
  {
    name: 'Candy',
    value: 'candy',
    className: 'bg-gradient-candy'
  }
];

const PATTERNS = [
  {
    name: 'None',
    value: 'none',
    className: ''
  },
  {
    name: 'Dots',
    value: 'dots',
    className: 'bg-dots'
  },
  {
    name: 'Lines',
    value: 'lines',
    className: 'bg-lines'
  },
  {
    name: 'Grid',
    value: 'grid',
    className: 'bg-grid'
  },
  {
    name: 'Waves',
    value: 'waves',
    className: 'bg-waves'
  }
];

export function CustomizeProfileDialog({
  open,
  onOpenChange,
  currentTheme,
  onThemeChange,
}: CustomizeProfileDialogProps) {
  const [theme, setTheme] = useState<ProfileTheme>(currentTheme);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(currentTheme.backgroundImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, or GIF)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBackgroundPreview(result);
      setTheme(prev => ({ ...prev, backgroundImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = () => {
    setBackgroundPreview(null);
    setTheme(prev => ({ ...prev, backgroundImage: undefined }));
  };

  const handleSave = async () => {
    onThemeChange(theme);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customize Profile</DialogTitle>
          <DialogDescription>
            Customize your profile background and theme
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Background Image Upload */}
          <div className="space-y-4">
            <Label>Profile Background</Label>
            <div className="relative">
              <div 
                className={cn(
                  "h-40 rounded-lg relative overflow-hidden cursor-pointer",
                  "border-2 border-dashed",
                  backgroundPreview ? "border-0" : "border-muted-foreground/25"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {backgroundPreview ? (
                  <img 
                    src={backgroundPreview} 
                    alt="Background preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload background image
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Recommended: 1920x480px (max 5MB)
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="hidden"
              />
              {backgroundPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBackground();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Gradients */}
          <div className="space-y-4">
            <Label>Background Theme</Label>
            <div className="grid grid-cols-2 gap-4">
              {GRADIENTS.map((gradient) => (
                <button
                  key={gradient.value}
                  className={cn(
                    "h-24 rounded-lg relative overflow-hidden cursor-pointer transition-all hover:scale-105",
                    "border-2",
                    theme.gradient === gradient.value ? "border-primary" : "border-muted",
                    gradient.className
                  )}
                  onClick={() => setTheme(prev => ({ ...prev, gradient: gradient.value }))}
                >
                  <span className="absolute inset-0 flex items-center justify-center font-medium text-white mix-blend-difference">
                    {gradient.name}
                  </span>
                  {theme.gradient === gradient.value && (
                    <div className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Patterns */}
          <div className="space-y-4">
            <Label>Background Pattern</Label>
            <div className="grid grid-cols-3 gap-4">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.value}
                  className={cn(
                    "h-24 rounded-lg relative overflow-hidden cursor-pointer transition-all hover:scale-105",
                    "border-2",
                    theme.pattern === pattern.value ? "border-primary" : "border-muted",
                    pattern.className,
                    "bg-muted"
                  )}
                  onClick={() => setTheme(prev => ({ ...prev, pattern: pattern.value }))}
                >
                  <span className="absolute inset-0 flex items-center justify-center font-medium">
                    {pattern.name}
                  </span>
                  {theme.pattern === pattern.value && (
                    <div className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}