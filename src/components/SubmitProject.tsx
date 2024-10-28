import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, AlertCircle, ImagePlus, Calendar, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { BasicProjectForm } from './forms/BasicProjectForm';
import { TECH_STACKS } from '@/lib/constants';

const initialFormData = {
  title: '',
  projectUrl: '',
  tagline: '',
  pricing: 'free',
  category: '',
  description: '',
  videoUrl: '',
  images: [],
  techStack: [],
  twitter: '',
  linkedin: '',
  github: '',
  hiring: {
    status: false,
    type: 'full-time',
    rate: '',
    skills: [],
    availability: '',
  },
};

interface SubmitProjectProps {
  projectId?: string;
  onClose?: () => void;
}

export function SubmitProject({ projectId, onClose }: SubmitProjectProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [newSkill, setNewSkill] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { addProject, projects } = useProjects();
  const { toast } = useToast();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load project data if editing
  useEffect(() => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setFormData({
          title: project.title,
          projectUrl: project.projectUrl,
          tagline: project.tagline,
          pricing: project.pricing,
          category: project.category,
          description: project.description,
          videoUrl: project.videoUrl || '',
          images: project.images || [],
          techStack: project.techStack || [],
          twitter: project.social?.twitter || '',
          linkedin: project.social?.linkedin || '',
          github: project.social?.github || '',
          hiring: project.hiring || {
            status: false,
            type: 'full-time',
            rate: '',
            skills: [],
            availability: '',
          },
        });
      }
    }
  }, [projectId, projects]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleTechStackChange = (category: string, tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack?.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...(prev.techStack || []), tech]
    }));
  };

  const handleThumbnailChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setThumbnailPreview(result);
      setFormData(prev => ({ ...prev, thumbnail: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailRemove = () => {
    setThumbnailPreview(null);
    setFormData(prev => ({ ...prev, thumbnail: null }));
  };
  
  const handleHiringChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      hiring: {
        ...prev.hiring,
        [field]: value
      }
    }));
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!formData.hiring.skills.includes(newSkill.trim())) {
        handleHiringChange('skills', [...formData.hiring.skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleHiringChange(
      'skills',
      formData.hiring.skills.filter(skill => skill !== skillToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a project",
        variant: "destructive",
      });
      return;
    }

// Validate required screenshots on step 2
if (step === 2 && images.length < 2) {
  toast({
    title: "Screenshots required",
    description: "Please upload at least 2 screenshots of your project",
    variant: "destructive",
  });
  return;
}

    if (step < 6) {
      setStep(prev => prev + 1);
      return;
    }

    // Create new project with author info
    const newProject = {
      id: projectId || crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      tagline: formData.tagline,
      projectUrl: formData.projectUrl,
      category: formData.category,
      pricing: formData.pricing,
      videoUrl: formData.videoUrl,
      images: formData.images,
      techStack: formData.techStack,
      social: {
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        github: formData.github,
      },
      hiring: formData.hiring.status ? {
        status: true,
        type: formData.hiring.type,
        rate: formData.hiring.rate,
        skills: formData.hiring.skills,
        availability: formData.hiring.availability,
      } : undefined,
      upvotes: 0,
      voters: new Set(),
      comments: [],
      status: 'published',
      tags: [formData.category],
      launchDate: new Date().toISOString(),
      subscribers: new Set(),
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar
      }
    };

    await addProject(newProject);
    toast({
      title: projectId ? "Project updated!" : "Project submitted!",
      description: projectId 
        ? "Your project has been updated successfully."
        : "Your project has been submitted successfully.",
    });

    setFormData(initialFormData);
    setStep(1);
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open || !!projectId} onOpenChange={(o) => {
      setOpen(o);
      if (!o && onClose) onClose();
    }}>
      <DialogTrigger asChild>
        <Button disabled={!isAuthenticated}>
          <Plus className="mr-2 h-4 w-4" />
          Submit Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{projectId ? "Edit Project" : "Submit a new project"}</DialogTitle>
          <DialogDescription>
            {step === 1 && "Tell us about your project"}
            {step === 2 && "Add media to showcase your project"}
            {step === 3 && "Add your social media links"}
            {step === 4 && "Select your tech stack"}
            {step === 5 && "Choose your database"}
            {step === 6 && "Set your launch date"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <BasicProjectForm
              formData={formData}
              handleChange={handleChange}
              handleTechStackChange={handleTechStackChange}
              handleHiringChange={handleHiringChange}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              addSkill={addSkill}
              removeSkill={removeSkill}
              onThumbnailChange={handleThumbnailChange}
              onThumbnailRemove={handleThumbnailRemove}
              thumbnailPreview={thumbnailPreview}
            />
          )}

          {/* Step 2: Media */}
{step === 2 && (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="videoUrl">Video URL (optional)</Label>
      <Input
        id="videoUrl"
        name="videoUrl"
        type="url"
        value={formData.videoUrl}
        onChange={handleChange}
        placeholder="YouTube, Vimeo, or other video URL"
      />
      {formData.videoUrl && (
        <div className="mt-2">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Video URL detected. Make sure it's publicly accessible.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>

    <div className="space-y-2">
      <Label>
        Screenshots
        <span className="text-sm text-muted-foreground ml-2">
          (min. 2 images, recommended size: 1280x720px)
        </span>
      </Label>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => {
          const hasImage = i < images.length;
          
          return (
            <div
              key={i}
              className={cn(
                "aspect-video border-2 border-dashed rounded-lg overflow-hidden relative",
                "hover:border-primary/50 transition-colors",
                hasImage ? "border-0" : "border-muted-foreground/25"
              )}
            >
              {hasImage ? (
                <div className="relative group">
                  <img 
                    src={images[i]}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        const newImages = [...images];
                        const newFiles = [...imageFiles];
                        newImages.splice(i, 1);
                        newFiles.splice(i, 1);
                        setImages(newImages);
                        setImageFiles(newFiles);
                        setFormData(prev => ({
                          ...prev,
                          images: newImages
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
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

                      try {
                        setIsUploading(true);
                        
                        // Create preview
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const newImages = [...images, reader.result as string];
                          const newFiles = [...imageFiles, file];
                          setImages(newImages);
                          setImageFiles(newFiles);
                          setFormData(prev => ({
                            ...prev,
                            images: newImages
                          }));
                        };
                        reader.readAsDataURL(file);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to upload image. Please try again.",
                          variant: "destructive"
                        });
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                  <div className="text-center p-4">
                    <ImagePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {i < 2 ? (
                        <span className="text-destructive">Required*</span>
                      ) : (
                        "Optional"
                      )}
                    </span>
                  </div>
                </label>
              )}
            </div>
          );
        })}
      </div>
      {images.length < 2 && (
        <p className="text-sm text-destructive mt-2">
          Please upload at least 2 screenshots of your project
        </p>
      )}
    </div>
  </div>
)}

          {/* Step 3: Social Links */}
          {step === 3 && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please include at least one social media link
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="twitter">X/Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          )}

          {/* Step 4: Tech Stack */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Frontend Technologies</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TECH_STACKS.frontend.map(tech => (
                    <Button
                      key={tech.name}
                      type="button"
                      variant={formData.techStack?.includes(tech.name) ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => handleTechStackChange('frontend', tech.name)}
                    >
                      <span>{tech.icon}</span>
                      {tech.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Backend Technologies</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TECH_STACKS.backend.map(tech => (
                    <Button
                      key={tech.name}
                      type="button"
                      variant={formData.techStack?.includes(tech.name) ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => handleTechStackChange('backend', tech.name)}
                    >
                      <span>{tech.icon}</span>
                      {tech.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Cloud & Infrastructure</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TECH_STACKS.cloud.map(tech => (
                    <Button
                      key={tech.name}
                      type="button"
                      variant={formData.techStack?.includes(tech.name) ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => handleTechStackChange('cloud', tech.name)}
                    >
                      <span>{tech.icon}</span>
                      {tech.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Database */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Database Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'PostgreSQL', icon: '🐘' },
                    { name: 'MySQL', icon: '🐬' },
                    { name: 'MongoDB', icon: '🍃' },
                    { name: 'Redis', icon: '🔴' },
                    { name: 'SQLite', icon: '📁' },
                    { name: 'Supabase', icon: '⚡' },
                    { name: 'Firebase', icon: '🔥' },
                    { name: 'Other', icon: '💾' }
                  ].map(db => (
                    <Button
                      key={db.name}
                      type="button"
                      variant={formData.techStack?.includes(db.name) ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => handleTechStackChange('database', db.name)}
                    >
                      <span>{db.icon}</span>
                      {db.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Launch Date */}
          {step === 6 && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Choose when your project will be published. Projects can be launched immediately or scheduled for a future date.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Launch Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.launchDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.launchDate ? format(formData.launchDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.launchDate}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, launchDate: date }))}
                        disabled={(date) => isBefore(date, startOfToday())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Launch Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      name="launchTime"
                      value={formData.launchTime}
                      onChange={handleChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Launch Status</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date().toDateString() === formData.launchDate?.toDateString()
                    ? "Your project will be published immediately"
                    : `Your project will be published on ${format(formData.launchDate || new Date(), 'PPP')} at ${formData.launchTime}`
                  }
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(prev => prev - 1)}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className={step === 1 ? "w-full" : "ml-auto"}
            >
              {step < 6 ? "Continue" : (projectId ? "Update Project" : "Submit Project")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}