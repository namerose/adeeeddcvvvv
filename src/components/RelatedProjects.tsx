import { useProjects } from '@/context/ProjectContext';
import { ProjectListItem } from './ProjectListItem';

interface RelatedProjectsProps {
  currentProjectId: string;
  tags: string[];
}

export function RelatedProjects({ currentProjectId, tags }: RelatedProjectsProps) {
  const { projects } = useProjects();

  // Find projects with matching tags, excluding current project
  const relatedProjects = projects
    .filter(p => 
      p.id !== currentProjectId && 
      p.tags.some(tag => tags.includes(tag))
    )
    .slice(0, 3); // Show max 3 related projects

  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Related Projects</h2>
      <div className="space-y-4">
        {relatedProjects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}