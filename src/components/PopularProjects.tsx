import { ProjectGrid } from './ProjectGrid';

export function PopularProjects() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Popular Projects</h1>
        <p className="text-muted-foreground mt-1">
          Most upvoted projects of all time
        </p>
      </div>

      <ProjectGrid filter="popular" />
    </div>
  );
}