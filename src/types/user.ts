export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  createdAt: string;
  portfolio?: PortfolioItem[];
  skills?: Skill[];
  theme?: ProfileTheme;
  isVerified?: boolean;
  isOnline?: boolean;
  isAdmin?: boolean; // Add admin flag
}

export interface ProfileUpdateData {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  portfolio?: PortfolioItem[];
  skills?: Skill[];
  theme?: ProfileTheme;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  tags: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'design' | 'other';
  endorsements: string[]; // Array of user IDs who endorsed this skill
}