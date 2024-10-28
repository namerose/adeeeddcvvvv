import { useState } from 'react';
import { ProjectGrid } from './ProjectGrid';
import { ProjectFilters } from './ProjectFilters';
import { useProjects } from '@/context/ProjectContext';

export function TodayProjects() {
  const { projects } = useProjects();
  const [category, setCategory] = useState('all');
  const [price, setPrice] = useState('all');
  const [sortBy, setSortBy] = useState('upvoted');

  // Get published projects and sort by rank
  const todayProjects = projects?.filter(
    (project) => project.status === 'published'
  ).sort((a, b) => a.rank - b.rank);

  // Filter projects based on filters
  const filteredProjects = todayProjects?.filter((project) => {
    const matchesCategory = category === 'all' || project.category === category;
    const matchesPrice = price === 'all' || project.pricing === price;
    return matchesCategory && matchesPrice;
  });

  // Sort projects based on selected sort option
  const sortedProjects = [...(filteredProjects || [])].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.metrics?.views || 0) - (a.metrics?.views || 0);
      case 'upvoted':
        return b.upvotes - a.upvotes;
      case 'newest':
      default:
        return new Date(b.launchDate || '').getTime() - new Date(a.launchDate || '').getTime();
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Top Products Launching Today</h1>
        <p className="text-muted-foreground mt-1">
          The place to launch and discover new tech products
        </p>
      </div>

      <ProjectFilters
        onCategoryChange={setCategory}
        onPriceChange={setPrice}
        onSortChange={setSortBy}
      />

      <ProjectGrid projects={sortedProjects || []} />
    </div>
  );
}