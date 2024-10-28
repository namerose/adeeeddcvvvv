export const CATEGORIES = [
  {
    id: 'ai',
    name: 'AI & ML',
    description: 'Artificial Intelligence and Machine Learning projects',
    icon: '🤖'
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    description: 'Tools and utilities for developers',
    icon: '🛠️'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Apps and tools to boost productivity',
    icon: '⚡'
  },
  {
    id: 'design',
    name: 'Design Tools',
    description: 'Tools for designers and creatives',
    icon: '🎨'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing and growth tools',
    icon: '📈'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data analytics and insights tools',
    icon: '📊'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online shopping and e-commerce solutions',
    icon: '🛍️'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learning and educational tools',
    icon: '📚'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial tools and services',
    icon: '💰'
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    description: 'Health and wellness applications',
    icon: '💪'
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Social networking tools',
    icon: '🤝'
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Other innovative projects',
    icon: '✨'
  }
] as const;

// Add tech stack constants
export const TECH_STACKS = {
  frontend: [
    { name: 'React', icon: '⚛️' },
    { name: 'Vue', icon: '🟢' },
    { name: 'Angular', icon: '🔴' },
    { name: 'Next.js', icon: '▲' },
    { name: 'Svelte', icon: '🟠' },
    { name: 'Nuxt', icon: '💚' }
  ],
  backend: [
    { name: 'Node.js', icon: '💚' },
    { name: 'Python', icon: '🐍' },
    { name: 'Java', icon: '☕' },
    { name: 'Go', icon: '🔵' },
    { name: 'Ruby', icon: '💎' },
    { name: 'PHP', icon: '🐘' }
  ],
  cloud: [
    { name: 'AWS', icon: '☁️' },
    { name: 'GCP', icon: '🌩️' },
    { name: 'Azure', icon: '⚡' },
    { name: 'Vercel', icon: '▲' },
    { name: 'Netlify', icon: '🌐' },
    { name: 'Docker', icon: '🐳' }
  ]
} as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export const isCategoryId = (value: string): value is CategoryId => {
  return CATEGORIES.some(category => category.id === value);
};

export const getCategoryById = (id: CategoryId) => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryName = (id: CategoryId) => {
  return getCategoryById(id)?.name || 'Unknown Category';
};