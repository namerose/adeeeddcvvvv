import { useState } from 'react';
import { PortfolioItem } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Link2, Star } from 'lucide-react';
import { EditPortfolioDialog } from './EditPortfolioDialog';
import { useAuth } from '@/context/AuthContext';

interface PortfolioSectionProps {
  items: PortfolioItem[];
  isOwner?: boolean;
  onUpdate?: (items: PortfolioItem[]) => void;
}

export function PortfolioSection({ items, isOwner, onUpdate }: PortfolioSectionProps) {
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const { isAuthenticated } = useAuth();

  const featuredItems = items.filter(item => item.featured);
  const otherItems = items.filter(item => !item.featured);

  return (
    <div className="space-y-6">
      {/* Featured Projects */}
      {featuredItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Featured Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    {isOwner && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    {item.projectUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Link2 className="h-4 w-4" />
                          Visit Project
                        </a>
                      </Button>
                    )}
                    {item.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          View Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {otherItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Other Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  {isOwner && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {item.projectUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Link2 className="h-4 w-4" />
                        Visit
                      </a>
                    </Button>
                  )}
                  {item.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isOwner && (
        <Button 
          onClick={() => setEditingItem({
            id: crypto.randomUUID(),
            title: '',
            description: '',
            featured: false,
            tags: []
          })}
        >
          Add Project
        </Button>
      )}

      {editingItem && (
        <EditPortfolioDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSave={(updatedItem) => {
            const isNew = !items.find(i => i.id === updatedItem.id);
            const updatedItems = isNew 
              ? [...items, updatedItem]
              : items.map(i => i.id === updatedItem.id ? updatedItem : i);
            
            onUpdate?.(updatedItems);
            setEditingItem(null);
          }}
          onDelete={(id) => {
            onUpdate?.(items.filter(i => i.id !== id));
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}