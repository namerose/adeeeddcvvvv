import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES } from "@/lib/constants";

interface ProjectFiltersProps {
  onCategoryChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const TECH_STACKS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Node.js',
  'Python', 'TypeScript', 'Laravel', 'Django'
];

export function ProjectFilters({
  onCategoryChange,
  onPriceChange,
  onSortChange,
}: ProjectFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [minUpvotes, setMinUpvotes] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [productionReady, setProductionReady] = useState(false);

  const handleTechStackToggle = (tech: string) => {
    setSelectedTechStacks(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const handleApplyFilters = () => {
    setShowAdvanced(false);
  };

  const handleResetFilters = () => {
    setSelectedTechStacks([]);
    setMinUpvotes("");
    setVerifiedOnly(false);
    setProductionReady(false);
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
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

        <Select onValueChange={onPriceChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="freemium">Freemium</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="upvoted">Most Upvoted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Tech Stack Selection */}
            <div className="space-y-4">
              <Label>Tech Stack</Label>
              <div className="flex flex-wrap gap-2">
                {TECH_STACKS.map((tech) => (
                  <Badge
                    key={tech}
                    variant={selectedTechStacks.includes(tech) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTechStackToggle(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Project Status */}
            <div className="space-y-4">
              <Label>Project Status</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Production Ready</Label>
                    <div className="text-sm text-muted-foreground">
                      Show only projects that are ready for production use
                    </div>
                  </div>
                  <Switch
                    checked={productionReady}
                    onCheckedChange={setProductionReady}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Filters */}
            <div className="space-y-4">
              <Label>Additional Filters</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verified Creators Only</Label>
                    <div className="text-sm text-muted-foreground">
                      Show projects only from verified creators
                    </div>
                  </div>
                  <Switch
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Upvotes</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    value={minUpvotes}
                    onChange={(e) => setMinUpvotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}