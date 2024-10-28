import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { ProjectFormData } from "@/types/project";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BasicProjectFormProps {
  formData: ProjectFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onThumbnailChange: (file: File) => void;
  onThumbnailRemove: () => void;
  thumbnailPreview: string | null;
}

export function BasicProjectForm({
  formData,
  handleChange,
  onThumbnailChange,
  onThumbnailRemove,
  thumbnailPreview,
}: BasicProjectFormProps) {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    onThumbnailChange(file);
  };

  return (
    <div className="space-y-8">
      
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Product Name</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="My Amazing Project"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectUrl">Product URL</Label>
          <Input
            id="projectUrl"
            name="projectUrl"
            type="url"
            value={formData.projectUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">
            Tagline
            <span className="text-sm text-muted-foreground ml-2">
              (min. 10 characters)
            </span>
          </Label>
          <Input
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="A catchy one-liner about your project"
            required
            minLength={10}
          />
        </div>

        <div className="space-y-2">
          <Label>Pricing</Label>
          <RadioGroup
            value={formData.pricing}
            onValueChange={(value) => 
              handleChange({ target: { name: 'pricing', value } } as React.ChangeEvent<HTMLInputElement>)
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="free" />
              <Label htmlFor="free">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid" />
              <Label htmlFor="paid">Paid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="freemium" id="freemium" />
              <Label htmlFor="freemium">Freemium</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category}
            onValueChange={(value) => 
              handleChange({ target: { name: 'category', value } } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description
            <span className="text-sm text-muted-foreground ml-2">
              (min. 100 characters)
            </span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project, its value proposition, and key features..."
            required
            minLength={100}
            className="min-h-[150px]"
          />
        </div>
      </div>
    </div>
  );
}