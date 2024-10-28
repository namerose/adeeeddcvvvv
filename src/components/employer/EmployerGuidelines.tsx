import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Heart,
  GraduationCap,
  Handshake,
  Clock,
  DollarSign,
  BookOpen,
  Users,
  Target,
  Shield,
  Briefcase,
  Award,
  Code,
  UserCheck,
  Laptop,
  MessageSquare
} from 'lucide-react';

const guidelines = [
  {
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    title: 'Hargai Lulusan Baru',
    description: 'Ingat, semua orang juga pernah mulai dari awal. Tunjukin kesabaran dan pengertian ke lulusan baru yang lagi mulai karirnya.'
  },
  {
    icon: GraduationCap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    title: 'Kasih Kesempatan Belajar',
    description: 'Investasi buat pelatihan dan mentoring. Lulusan baru semangat buat belajar - bantu mereka kembangin skill-nya.'
  },
  {
    icon: Handshake,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    title: 'Kompensasi yang Layak',
    description: 'Kasih gaji dan benefit yang adil. Meskipun masih baru, waktu dan skill mereka tetep berharga.'
  },
  {
    icon: Clock,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    title: 'Jam Kerja yang Wajar',
    description: 'Jaga keseimbangan hidup dan kerja. Hindari lembur berlebihan dan hargai waktu pribadi mereka.'
  },
  {
    icon: Shield,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    title: 'Lingkungan Kerja Aman',
    description: 'Pastikan tempat kerja bebas dari pelecehan. Ciptakan lingkungan di mana mereka ngerasa aman buat bertanya dan belajar.'
  },
  {
    icon: Target,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    title: 'Ekspektasi yang Jelas',
    description: 'Buat tujuan yang realistis dan kasih feedback secara teratur. Bantu mereka ngerti cara sukses di peran ini.'
  }
];

const responsibilities = [
  {
    icon: BookOpen,
    title: 'Pelatihan yang Memadai',
    description: 'Sediakan program onboarding dan pelatihan berkelanjutan yang lengkap'
  },
  {
    icon: Users,
    title: 'Mentorship',
    description: 'Pasangkan dengan mentor yang berpengalaman buat bantu dan dukung mereka'
  },
  {
    icon: Award,
    title: 'Penghargaan',
    description: 'Hargai dan rayakan pencapaian serta perkembangan mereka'
  },
  {
    icon: Briefcase,
    title: 'Pengembangan Karir',
    description: 'Kasih jalur karir yang jelas dan peluang buat berkembang'
  }
];

const soloProjectGuidelines = [
  {
    icon: Code,
    title: 'Hargai Independensi',
    description: 'Meskipun bekerja secara independen, mereka tetap profesional yang perlu dihargai dan diperlakukan dengan hormat.'
  },
  {
    icon: UserCheck,
    title: 'Komunikasi Profesional',
    description: 'Jaga komunikasi tetap profesional dan hormati batasan waktu kerja mereka seperti pekerja penuh waktu.'
  },
  {
    icon: Laptop,
    title: 'Fleksibilitas Kerja',
    description: 'Hormati cara kerja dan jadwal mereka selama deliverables sesuai dengan yang disepakati.'
  },
  {
    icon: MessageSquare,
    title: 'Feedback Konstruktif',
    description: 'Berikan feedback dengan cara yang membangun dan hormati kreativitas serta pendekatan mereka dalam menyelesaikan proyek.'
  }
];

export function EmployerGuidelines() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h1 className="text-3xl font-bold">Panduan Buat Perekrut</h1>
        </div>
        <p className="text-muted-foreground">
          Panduan penting buat perusahaan yang mau rekrut lulusan baru atau profesional muda
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid gap-6 mb-12">
        {guidelines.map((guideline) => (
          <Card key={guideline.title} className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-lg", guideline.bgColor)}>
                <guideline.icon className={cn("h-6 w-6", guideline.color)} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{guideline.title}</h3>
                <p className="text-muted-foreground">{guideline.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Solo Project Guidelines */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Panduan untuk Solo Project & Publisher</h2>
        <Card className="p-6 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              <p className="font-medium text-blue-700 dark:text-blue-300">
                Status sebagai pekerja solo project atau publisher di platform ini tidak berarti mereka bisa diperlakukan semena-mena
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {soloProjectGuidelines.map((guide) => (
                <div key={guide.title} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <guide.icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">{guide.title}</h4>
                    <p className="text-sm text-blue-600/80 dark:text-blue-300/80">{guide.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Employer Responsibilities */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Tanggung Jawab Perekrut</h2>
        <div className="grid grid-cols-2 gap-6">
          {responsibilities.map((resp) => (
            <Card key={resp.title} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <resp.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{resp.title}</h3>
                  <p className="text-sm text-muted-foreground">{resp.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <Card className="p-6 bg-yellow-500/10 border-yellow-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-yellow-500/20">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Catatan Penting</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Diskriminasi berdasarkan usia atau pengalaman dilarang keras</li>
              <li>• Semua listing kerja harus jelas nyatain kalau posisi bisa buat lulusan baru</li>
              <li>• Gaji dan benefit harus transparan selama proses rekrutmen</li>
              <li>• Masa percobaan harus masuk akal dan syaratnya jelas</li>
              <li>• Review performa dan feedback rutin sangat dianjurkan</li>
              <li>• Perlakukan semua pekerja dengan hormat, termasuk solo project dan publisher</li>
              <li>• Hormati kesepakatan kerja yang sudah dibuat bersama</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}