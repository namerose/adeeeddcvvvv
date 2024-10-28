import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Code2,
  Package,
  FileCode,
  Server,
  Component,
  Tags,
} from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { ProductDetail } from './ProductDetail';

// Demo projects data
export const DEMO_PROJECTS = [
  {
    id: '1',
    title: 'E-commerce Starter Kit',
    description: 'Complete e-commerce solution with Next.js, Stripe, and Tailwind CSS. Includes authentication, shopping cart, payment processing, and admin dashboard.',
    longDescription: `
      A production-ready e-commerce starter kit built with Next.js 13, React Server Components, and TypeScript. This comprehensive solution includes everything you need to launch your online store.

      Key Features:
      - Next.js 13 App Router & React Server Components
      - Stripe Integration for payments
      - Authentication with NextAuth.js
      - Shopping cart functionality
      - Admin dashboard
      - Product management
      - Order processing
      - Real-time inventory tracking
      - SEO optimization
      - Performance optimized
      - Responsive design
      - Dark mode support
    `,
    price: 149,
    category: 'full-app',
    techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    preview: 'https://demo.example.com/ecommerce',
    sales: 234,
    rating: 4.8,
    author: {
      name: 'Sarah Chen',
      avatar: 'https://avatar.vercel.sh/sarah',
      bio: 'Full Stack Developer specializing in React and Node.js',
      projects: 12,
      sales: 1200
    },
    featured: true,
    lastUpdate: '2024-03-15',
    version: '2.1.0',
    fileSize: '24MB',
    browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    documentation: 'Comprehensive documentation included',
    support: {
      includes: ['6 months support', 'Bug fixes', 'New features'],
      email: 'support@example.com'
    }
  },
  {
    id: '2',
    title: 'React Component Library',
    description: 'Collection of 50+ production-ready React components with TypeScript support. Includes data tables, charts, forms, and more.',
    longDescription: `
      A comprehensive collection of React components built with TypeScript and styled-components. Perfect for quickly bootstrapping new projects or enhancing existing ones.

      Features:
      - 50+ customizable components
      - TypeScript support
      - Responsive design
      - Accessibility compliant
      - Theme customization
      - Comprehensive documentation
      - Regular updates
    `,
    price: 79,
    category: 'components',
    techStack: ['React', 'TypeScript', 'Styled Components', 'Storybook'],
    preview: 'https://demo.example.com/components',
    sales: 567,
    rating: 4.9,
    author: {
      name: 'Mike Wilson',
      avatar: 'https://avatar.vercel.sh/mike',
      bio: 'UI/UX Developer with 8 years of experience',
      projects: 8,
      sales: 2300
    },
    featured: false,
    lastUpdate: '2024-03-10',
    version: '1.5.0',
    fileSize: '12MB',
    browsers: ['All modern browsers'],
    documentation: 'Storybook documentation included',
    support: {
      includes: ['Lifetime access', 'Regular updates'],
      email: 'support@example.com'
    }
  }
];

export const CATEGORIES = [
  { value: 'full-app', label: 'Full Applications', icon: Package },
  { value: 'components', label: 'Components & Libraries', icon: Component },
  { value: 'templates', label: 'Templates & Boilerplates', icon: FileCode },
  { value: 'scripts', label: 'Scripts & Tools', icon: Code2 },
  { value: 'apis', label: 'APIs & Backend Services', icon: Server }
];

export const TECH_STACKS = [
  'React',
  'Vue',
  'Angular',
  'Next.js',
  'Node.js',
  'Python',
  'Laravel',
  'WordPress'
];

export function CodeMarketplace() {
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [techStack, setTechStack] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = DEMO_PROJECTS.find(p => p.id === selectedProjectId);

  const handleViewProduct = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleBackToGrid = () => {
    setSelectedProjectId(null);
  };

  return (
    <div>
      {selectedProject ? (
        <ProductDetail 
          project={selectedProject} 
          onBack={handleBackToGrid}
        />
      ) : (
        <>
          {/* Categories */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {CATEGORIES.map(({ value, label, icon: Icon }) => (
              <Card 
                key={value}
                className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                  category === value ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setCategory(value)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200+">$200+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={techStack} onValueChange={setTechStack}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tech Stack" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {TECH_STACKS.map(tech => (
                  <SelectItem key={tech} value={tech.toLowerCase()}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Project Grid */}
          <ProductGrid 
            projects={DEMO_PROJECTS} 
            onViewProduct={handleViewProduct}
          />

          {/* Sell Your Project CTA */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sell Your Project</h2>
                <p className="text-muted-foreground max-w-xl">
                  Turn your code into profit. List your projects, components, or templates and reach thousands of developers.
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <Tags className="h-4 w-4" />
                List Your Project
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}