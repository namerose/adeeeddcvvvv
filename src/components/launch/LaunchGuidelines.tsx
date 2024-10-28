import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Rocket,
  Target,
  Users,
  MessageSquare,
  Camera,
  FileText,
  Share2,
  Heart,
  Clock,
  Shield,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';

const guidelines = [
  {
    icon: Target,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    title: 'Tentukan Target Audiens',
    description: 'Kenali siapa pengguna potensial produk Anda. Ini akan membantu dalam pemasaran dan pengembangan fitur.'
  },
  {
    icon: Camera,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    title: 'Visual yang Menarik',
    description: 'Sertakan screenshot, video demo, dan visual yang menjelaskan produk Anda dengan jelas.'
  },
  {
    icon: FileText,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    title: 'Dokumentasi Lengkap',
    description: 'Siapkan dokumentasi yang jelas tentang cara penggunaan, instalasi, dan FAQ.'
  },
  {
    icon: Share2,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    title: 'Strategi Promosi',
    description: 'Manfaatkan media sosial dan komunitas untuk mempromosikan produk Anda.'
  }
];

const bestPractices = [
  {
    icon: Heart,
    title: 'Engagement dengan Komunitas',
    description: 'Aktif berinteraksi dengan pengguna dan tanggapi feedback dengan baik'
  },
  {
    icon: Clock,
    title: 'Waktu Peluncuran',
    description: 'Pilih waktu yang tepat dan persiapkan semua materi dengan matang'
  },
  {
    icon: Shield,
    title: 'Keamanan & Privasi',
    description: 'Pastikan produk Anda aman dan menghormati privasi pengguna'
  },
  {
    icon: Zap,
    title: 'Performa',
    description: 'Optimasi performa dan pastikan produk berjalan dengan baik'
  }
];

const successMetrics = [
  {
    icon: Award,
    title: 'Kualitas Produk',
    description: 'Pastikan produk memenuhi standar kualitas dan kebutuhan pengguna'
  },
  {
    icon: Users,
    title: 'Pertumbuhan Pengguna',
    description: 'Pantau dan tingkatkan jumlah pengguna aktif'
  },
  {
    icon: MessageSquare,
    title: 'Feedback Pengguna',
    description: 'Kumpulkan dan analisis feedback untuk perbaikan'
  },
  {
    icon: TrendingUp,
    title: 'Metrik Pertumbuhan',
    description: 'Ukur dan evaluasi metrik pertumbuhan produk'
  }
];

export function LaunchGuidelines() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Rocket className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Panduan Peluncuran Produk</h1>
        </div>
        <p className="text-muted-foreground">
          Panduan lengkap untuk membantu Anda meluncurkan produk dengan sukses
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

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Best Practices</h2>
        <div className="grid grid-cols-2 gap-6">
          {bestPractices.map((practice) => (
            <Card key={practice.title} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <practice.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{practice.title}</h3>
                  <p className="text-sm text-muted-foreground">{practice.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Metrik Kesuksesan</h2>
        <div className="grid grid-cols-2 gap-6">
          {successMetrics.map((metric) => (
            <Card key={metric.title} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{metric.title}</h3>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
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
              <li>• Lakukan testing menyeluruh sebelum peluncuran</li>
              <li>• Siapkan tim support untuk menangani pertanyaan dan masalah</li>
              <li>• Pantau feedback dan metrik secara aktif</li>
              <li>• Persiapkan rencana cadangan untuk masalah teknis</li>
              <li>• Komunikasikan jadwal pemeliharaan dengan jelas</li>
              <li>• Jaga transparansi dengan pengguna</li>
              <li>• Siapkan roadmap pengembangan ke depan</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}