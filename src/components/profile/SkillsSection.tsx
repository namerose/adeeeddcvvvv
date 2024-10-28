import { useState } from 'react';
import { Skill } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EditSkillsDialog } from './EditSkillsDialog';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface SkillsSectionProps {
  skills: Skill[];
  isOwner?: boolean;
  onUpdate?: (skills: Skill[]) => void;
  onEndorse?: (skillId: string) => void;
}

export function SkillsSection({ 
  skills, 
  isOwner,
  onUpdate,
  onEndorse 
}: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryLabels: Record<string, string> = {
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    mobile: 'Mobile Development',
    devops: 'DevOps & Infrastructure',
    design: 'Design',
    other: 'Other Skills'
  };

  const levelProgress = {
    beginner: 33,
    intermediate: 66,
    expert: 100
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills & Expertise</h3>
        {isOwner && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Skills
          </Button>
        )}
      </div>

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            {categoryLabels[category]}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorySkills.map((skill) => (
              <Card key={skill.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{skill.name}</h5>
                      <Badge variant="secondary">
                        {skill.level}
                      </Badge>
                    </div>
                    <Progress 
                      value={levelProgress[skill.level]} 
                      className="mt-2"
                    />
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-sm text-muted-foreground">
                        {skill.endorsements.length} endorsements
                      </span>
                      {isAuthenticated && !isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEndorse?.(skill.id)}
                          disabled={skill.endorsements.includes(user?.id || '')}
                        >
                          {skill.endorsements.includes(user?.id || '') 
                            ? 'Endorsed' 
                            : 'Endorse'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <EditSkillsDialog
        skills={skills}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={(updatedSkills) => {
          onUpdate?.(updatedSkills);
          setIsEditing(false);
        }}
      />
    </div>
  );
}