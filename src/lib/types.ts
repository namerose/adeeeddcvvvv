export interface Project {
  id: string;
  title: string;
  description: string;
  demo: string;
  github: string;
  tags: string[];
  stars: number;
  comments: Comment[];
  voters: Set<string>;
  status: 'published' | 'upcoming';
  launchDate?: string;
  subscribers?: Set<string>;
}

export interface Comment {
  id: string;
  projectId: string;
  author: string;
  content: string;
  createdAt: Date;
}