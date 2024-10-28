import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { JobListingCard } from './JobListingCard';
import { PostJobDialog } from './PostJobDialog';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  GraduationCap,
  AlertTriangle,
  Heart,
  ShieldCheck,
  HandshakeIcon,
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Demo job listings untuk market Indonesia
const DEMO_JOBS = [
  {
    id: '1',
    title: 'Junior Frontend Developer',
    company: {
      name: 'Tokopedia',
      logo: 'https://avatar.vercel.sh/tokopedia',
      location: 'Jakarta, Indonesia',
      verified: true
    },
    description: 'Kami mencari Fresh Graduate/Junior Developer yang berpassion di frontend development untuk bergabung dengan tim kami.',
    type: 'full-time',
    location: 'Jakarta, Indonesia',
    remote: true,
    salary: {
      min: 5000000,
      max: 8000000,
      currency: 'IDR'
    },
    skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    experience: '0-2 years',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    freshGrad: true
  },
  {
    id: '2',
    title: 'Software Engineer Intern',
    company: {
      name: 'Gojek',
      logo: 'https://avatar.vercel.sh/gojek',
      location: 'Jakarta, Indonesia',
      verified: true
    },
    description: 'Program magang 6 bulan untuk mahasiswa tingkat akhir atau fresh graduate di bidang software engineering.',
    type: 'internship',
    location: 'Jakarta, Indonesia',
    remote: false,
    salary: {
      min: 4000000,
      max: 6000000,
      currency: 'IDR'
    },
    skills: ['Java', 'Kotlin', 'Git'],
    experience: 'Internship',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    freshGrad: true
  },
  {
    id: '3',
    title: 'Junior Backend Developer',
    company: {
      name: 'Traveloka',
      logo: 'https://avatar.vercel.sh/traveloka',
      location: 'Jakarta, Indonesia',
      verified: true
    },
    description: 'Bergabunglah dengan tim engineering kami untuk membangun sistem backend yang scalable.',
    type: 'full-time',
    location: 'Jakarta, Indonesia',
    remote: true,
    salary: {
      min: 6000000,
      max: 10000000,
      currency: 'IDR'
    },
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    experience: '1-2 years',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    freshGrad: true
  }
];

const JOB_TYPES = [
  { value: 'all', label: 'Semua Tipe' },
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Magang' }
];

const EXPERIENCE_LEVELS = [
  { value: 'all', label: 'Semua Level' },
  { value: 'internship', label: 'Magang' },
  { value: 'fresh-graduate', label: 'Fresh Graduate' },
  { value: 'junior', label: 'Junior (1-2 tahun)' },
  { value: 'mid', label: 'Mid Level (3-5 tahun)' }
];

const LOCATIONS = [
  { value: 'all', label: 'Semua Lokasi' },
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'yogyakarta', label: 'Yogyakarta' },
  { value: 'remote', label: 'Remote' }
];

export function JobBoard() {
  const [jobType, setJobType] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [location, setLocation] = useState('all');
  const [showPostJob, setShowPostJob] = useState(false);
  const [showFreshGradOnly, setShowFreshGradOnly] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lowongan Kerja IT</h1>
          <p className="text-muted-foreground">
            Temukan peluang karir terbaik di industri teknologi Indonesia
          </p>
        </div>

        <Button onClick={() => setShowPostJob(true)} className="gap-2">
          <Briefcase className="h-4 w-4" />
          Pasang Lowongan
        </Button>
      </div>

      {/* Employer Warning */}
      {showWarning && (
        <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="font-semibold text-lg text-orange-700 dark:text-orange-400">
                    Pesan Penting untuk Perusahaan
                  </h3>
                  <div className="space-y-2 text-orange-700 dark:text-orange-300 mt-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p>Mohon perhatikan dan hargai setiap kandidat yang melamar dengan memberikan respon yang tepat waktu.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <p>Pastikan lingkungan kerja yang aman, nyaman, dan mendukung pengembangan karir.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <HandshakeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <p>Berikan mentoring dan bimbingan yang baik, terutama untuk fresh graduate dan junior developer.</p>
                    </div>
                  </div>
                </div>
                <Alert className="bg-orange-100 dark:bg-orange-950/40 border-orange-200">
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    Mari bersama menciptakan ekosistem teknologi Indonesia yang sehat dan mendukung pertumbuhan talenta lokal.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-between items-center pt-2">
                  <Button 
                    variant="outline" 
                    className="border-orange-200 hover:bg-orange-100 text-orange-700"
                    onClick={() => setShowWarning(false)}
                  >
                    OK, Saya Mengerti
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">850+</div>
              <div className="text-sm text-muted-foreground">Lowongan Entry Level</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Perusahaan</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">20+</div>
              <div className="text-sm text-muted-foreground">Kota</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">6.5jt</div>
              <div className="text-sm text-muted-foreground">Rata-rata Gaji</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan posisi, perusahaan, atau kata kunci..."
              className="pl-9"
            />
          </div>
        </div>

        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipe Pekerjaan" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={experienceLevel} onValueChange={setExperienceLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level Pengalaman" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map(level => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lokasi" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map(loc => (
              <SelectItem key={loc.value} value={loc.value}>
                {loc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter Lainnya
        </Button>
      </div>

      {/* Fresh Graduate Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant={showFreshGradOnly ? "default" : "outline"}
          onClick={() => setShowFreshGradOnly(!showFreshGradOnly)}
          className="gap-2"
        >
          <GraduationCap className="h-4 w-4" />
          Khusus Fresh Graduate
        </Button>
        <Badge variant="secondary" className="gap-1">
          <GraduationCap className="h-3 w-3" />
          850+ lowongan
        </Badge>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {DEMO_JOBS.filter(job => !showFreshGradOnly || job.freshGrad).map((job) => (
          <JobListingCard
            key={job.id}
            job={job}
            onApply={(jobId) => {
              // Handle job application
              console.log('Applying for job:', jobId);
            }}
          />
        ))}
      </div>

      {/* Post Job Dialog */}
      <PostJobDialog 
        open={showPostJob} 
        onOpenChange={setShowPostJob}
      />
    </div>
  );
}