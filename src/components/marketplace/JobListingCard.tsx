import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Globe, 
  Clock, 
  DollarSign,
  Briefcase,
  Star,
  Building2,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobListingCardProps {
  job: any;
  onApply: (jobId: string) => void;
}

export function JobListingCard({ job, onApply }: JobListingCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        {/* Company Logo */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={job.company.logo} />
          <AvatarFallback>{job.company.name[0]}</AvatarFallback>
        </Avatar>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                {job.featured && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {job.company.name}
                  {job.company.verified && (
                    <CheckCircle className="h-3 w-3 text-blue-500 fill-current" />
                  )}
                </span>
                <span className="flex items-center gap-1">
                  {job.remote ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                  {job.salary.rate && `/${job.salary.rate}`}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={() => onApply(job.id)}>
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}