import { CategoryId } from '@/lib/constants';

export interface ProjectFormData {
  title: string;
  projectUrl: string;
  tagline: string;
  pricing: 'free' | 'paid' | 'freemium';
  category: string;
  description: string;
  videoUrl?: string;
  images: string[];
  thumbnail: string | null;
  techStack?: string[];
  twitter: string;
  linkedin: string;
  github: string;
  hiring: {
    status: boolean;
    type: 'full-time' | 'part-time' | 'contract';
    rate: string;
    skills: string[];
    availability: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tagline: string;
  projectUrl: string;
  category: CategoryId;
  pricing: 'free' | 'paid' | 'freemium';
  videoUrl?: string;
  images: string[];
  techStack?: string[];
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  hiring?: {
    status: boolean;
    type: 'full-time' | 'part-time' | 'contract';
    rate: string;
    skills: string[];
    availability: string;
  };
  upvotes: number;
  voters: string[]; // Array of user IDs who have voted
  comments: Comment[];
  status: 'published' | 'upcoming';
  tags: string[];
  launchDate?: string;
  subscribers?: string[]; // Array of user IDs who are subscribed
  thumbnail?: string;
  metrics?: {
    views: number;
    conversion: number;
    engagement: number;
    growth: number;
  };
  rank?: number;
  author?: {
    id: string;
    name: string;
    username?: string;
    avatar: string;
  };
}

export interface Project extends ProjectFormData {
  id: string;
  upvotes: number;
  voters: string[];
  comments: Comment[];
  status: 'published' | 'upcoming';
  launchDate?: string;
  subscribers?: string[];
  author?: {
    id: string;
    name: string;
    username?: string;
    avatar: string;
  };
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}