import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChevronLeft,
  Code2,
  FileText,
  Play,
  Download,
  Star,
  MessageSquare,
  Share2,
  ShoppingCart,
  ExternalLink,
  FileCode,
  CheckCircle
} from 'lucide-react';

interface ProductDetailProps {
  project: any;
  onBack: () => void;
}

export function ProductDetail({ project, onBack }: ProductDetailProps) {
  // Demo screenshots
  const screenshots = [
    `https://picsum.photos/seed/${project.id}/1200/800`,
    `https://picsum.photos/seed/${project.id}1/1200/800`,
    `https://picsum.photos/seed/${project.id}2/1200/800`,
    `https://picsum.photos/seed/${project.id}3/1200/800`,
  ];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          className="gap-2"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Buy Now - ${project.price}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Project Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              {project.featured && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {project.sales} sales
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {project.rating} rating
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                24 reviews
              </span>
            </div>
          </div>

          {/* Screenshot Gallery */}
          <Card className="p-4">
            <Carousel>
              <CarouselContent>
                {screenshots.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={src} 
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="p-6 prose prose-sm dark:prose-invert">
                <h2>Project Overview</h2>
                <p>{project.description}</p>

                <h3>What's Included</h3>
                <ul>
                  <li>Full source code</li>
                  <li>Documentation</li>
                  <li>6 months support</li>
                  <li>Free updates</li>
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Responsive Design</div>
                      <div className="text-sm text-muted-foreground">
                        Fully responsive and mobile-friendly interface
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Complete authentication system with social login
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Admin Dashboard</div>
                      <div className="text-sm text-muted-foreground">
                        Powerful admin interface with analytics
                      </div>
                    </div>
                  </li>
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Code Preview</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`// Example code snippet
import { useState } from 'react';

export function ExampleComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}</code>
                  </pre>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <p className="text-muted-foreground">No reviews yet.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2">${project.price}</div>
              <p className="text-sm text-muted-foreground">One-time payment</p>
            </div>

            <Button className="w-full gap-2 mb-4">
              <ShoppingCart className="h-4 w-4" />
              Buy Now
            </Button>

            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Download Demo
            </Button>

            <div className="border-t mt-6 pt-6">
              <h4 className="font-medium mb-4">What's included:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Full source code
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  6 months support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Documentation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Future updates
                </li>
              </ul>
            </div>
          </Card>

          {/* Author Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={project.author.avatar} />
                <AvatarFallback>{project.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{project.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  Elite Author
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Card>

          {/* Support Card */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <div className="font-medium">6 months support</div>
                <div className="text-muted-foreground">
                  Get help with bugs and issues
                </div>
              </li>
              <li>
                <div className="font-medium">Documentation</div>
                <div className="text-muted-foreground">
                  Detailed documentation included
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}