import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  Eye,
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

interface ProjectDetailProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetail({ project, open, onOpenChange }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('preview');

  // Demo screenshots
  const screenshots = [
    `https://picsum.photos/seed/${project.id}/1200/800`,
    `https://picsum.photos/seed/${project.id}1/1200/800`,
    `https://picsum.photos/seed/${project.id}2/1200/800`,
    `https://picsum.photos/seed/${project.id}3/1200/800`,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{project.title}</h2>
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

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Buy Now - ${project.price}
                </Button>
              </div>
            </div>

            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              <TabsTrigger 
                value="preview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="code"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Code
              </TabsTrigger>
              <TabsTrigger 
                value="docs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Documentation
              </TabsTrigger>
              <TabsTrigger 
                value="demo"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Live Demo
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="preview" className="p-6 m-0">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
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

                  {/* Video Demo */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Video Walkthrough</h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Button variant="outline" size="lg" className="gap-2">
                        <Play className="h-4 w-4" />
                        Watch Demo
                      </Button>
                    </div>
                  </Card>

                  {/* Features */}
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
                </div>

                <div className="space-y-6">
                  {/* Author Info */}
                  <Card className="p-4">
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

                  {/* Project Info */}
                  <Card className="p-4">
                    <h3 className="font-medium mb-4">Project Information</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">First Release</dt>
                        <dd>March 15, 2024</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Last Update</dt>
                        <dd>2 days ago</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Documentation</dt>
                        <dd>Well Documented</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Files Included</dt>
                        <dd>JavaScript, HTML, CSS</dd>
                      </div>
                    </dl>
                  </Card>

                  {/* Tech Stack */}
                  <Card className="p-4">
                    <h3 className="font-medium mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech: string) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="p-6 m-0">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Code Preview</h3>
                  <Button variant="outline" className="gap-2">
                    <FileCode className="h-4 w-4" />
                    View Full Source
                  </Button>
                </div>
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
            </TabsContent>

            <TabsContent value="docs" className="p-6 m-0">
              <Card className="p-6 prose prose-sm max-w-none dark:prose-invert">
                <h1>Documentation</h1>
                <h2>Getting Started</h2>
                <p>Follow these steps to get the project up and running:</p>
                <pre><code>npm install
npm run dev</code></pre>
                
                <h2>Project Structure</h2>
                <ul>
                  <li><code>/src</code> - Source files</li>
                  <li><code>/public</code> - Static assets</li>
                  <li><code>/components</code> - React components</li>
                </ul>

                <h2>Configuration</h2>
                <p>The project can be configured through environment variables:</p>
                <pre><code>NEXT_PUBLIC_API_URL=
DATABASE_URL=</code></pre>
              </Card>
            </TabsContent>

            <TabsContent value="demo" className="h-full m-0">
              <div className="h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <Button variant="outline" size="lg" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open Live Demo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Opens in a new window
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}