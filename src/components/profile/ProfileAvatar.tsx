import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/upload';

interface ProfileAvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  editable?: boolean;
  onAvatarChange?: (file: File) => Promise<void>;
  onAvatarRemove?: () => Promise<void>;
}

const sizes = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-32 w-32'
};

const overlayStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10'
};

export function ProfileAvatar({ 
  src, 
  name, 
  size = 'md', 
  className,
  editable = false,
  onAvatarChange,
  onAvatarRemove
}: ProfileAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

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

      // Validate image dimensions
      const img = new Image();
      const imgPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      await imgPromise;

      if (img.width < 400 || img.height < 400) {
        toast({
          title: "Image too small",
          description: "Please upload an image at least 400x400 pixels",
          variant: "destructive"
        });
        return;
      }

      await onAvatarChange?.(file);
      
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated successfully"
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast({
        title: "Error",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsLoading(true);
      await onAvatarRemove?.();
      toast({
        title: "Avatar removed",
        description: "Your profile photo has been removed"
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (editable) {
    return (
      <div 
        className={cn("relative group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className={cn(sizes[size], "border-4 border-background")}>
          <AvatarImage src={src} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "absolute bottom-0 right-0 rounded-full shadow-lg",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                overlayStyles[size],
                isLoading && "cursor-not-allowed opacity-50"
              )}
              disabled={isLoading}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-4 w-4 shrink-0 text-blue-500" />
                <p>Recommended: Square image, at least 400x400px (max 5MB)</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleUploadClick}
              disabled={isLoading}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Change Photo
            </DropdownMenuItem>
            {src && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleRemoveAvatar}
                  disabled={isLoading}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Photo
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Click to change photo
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Square image, at least 400x400px</p>
            <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(sizes[size], "border-4 border-background")}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
}