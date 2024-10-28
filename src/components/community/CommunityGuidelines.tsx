import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Shield,
  Heart,
  MessageSquare,
  Users,
  AlertTriangle,
  ThumbsDown,
  Ban,
  Scale,
  UserX,
  HandMetal,
  Sparkles,
  HelpCircle,
  Flag,
  UserCheck,
  MessageCircle
} from 'lucide-react';

const coreValues = [
  {
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    title: 'Saling Menghargai',
    description: 'Hormati semua anggota komunitas tanpa memandang latar belakang atau tingkat pengalaman.'
  },
  {
    icon: MessageSquare,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    title: 'Komunikasi Positif',
    description: 'Gunakan bahasa yang sopan dan konstruktif dalam setiap interaksi.'
  },
  {
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    title: 'Inklusif',
    description: 'Buat semua orang merasa diterima dan dihargai dalam komunitas.'
  },
  {
    icon: HandMetal,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    title: 'Dukung Satu Sama Lain',
    description: 'Bantu dan support sesama anggota komunitas untuk berkembang bersama.'
  }
];

const prohibitedBehavior = [
  {
    icon: ThumbsDown,
    title: 'Pelecehan & Bullying',
    description: 'Segala bentuk pelecehan, intimidasi, atau bullying tidak ditoleransi.'
  },
  {
    icon: Ban,
    title: 'Konten Tidak Pantas',
    description: 'Dilarang membagikan konten NSFW, spam, atau konten ilegal.'
  },
  {
    icon: UserX,
    title: 'Diskriminasi',
    description: 'Dilarang melakukan diskriminasi berdasarkan ras, gender, orientasi, dll.'
  },
  {
    icon: Scale,
    title: 'Pelanggaran Hak',
    description: 'Hormati hak cipta dan kekayaan intelektual orang lain.'
  }
];

const discussionGuidelines = [
  {
    icon: Sparkles,
    title: 'Berkualitas',
    description: 'Pastikan diskusi memberikan nilai dan insight yang bermanfaat.'
  },
  {
    icon: HelpCircle,
    title: 'Membantu',
    description: 'Bantu anggota lain dengan jawaban yang jelas dan bermanfaat.'
  },
  {
    icon: Flag,
    title: 'Laporkan',
    description: 'Laporkan konten yang melanggar aturan ke moderator.'
  },
  {
    icon: MessageCircle,
    title: 'Tetap Relevan',
    description: 'Jaga diskusi tetap pada topik dan konteks yang relevan.'
  }
];

export function CommunityGuidelines() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Panduan Komunitas</h1>
        </div>
        <p className="text-muted-foreground">
          Aturan dan nilai-nilai yang menjaga komunitas kita tetap positif dan bermanfaat
        </p>
      </div>

      {/* Core Values */}
      <div className="grid gap-6 mb-12">
        {coreValues.map((value) => (
          <Card key={value.title} className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-lg", value.bgColor)}>
                <value.icon className={cn("h-6 w-6", value.color)} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Prohibited Behavior */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Perilaku yang Dilarang</h2>
        <Card className="p-6 border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <div className="grid grid-cols-2 gap-6">
            {prohibitedBehavior.map((behavior) => (
              <div key={behavior.title} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <behavior.icon className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">
                    {behavior.title}
                  </h4>
                  <p className="text-sm text-red-600/80 dark:text-red-300/80">
                    {behavior.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Discussion Guidelines */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Panduan Diskusi</h2>
        <div className="grid grid-cols-2 gap-6">
          {discussionGuidelines.map((guideline) => (
            <Card key={guideline.title} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <guideline.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{guideline.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {guideline.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Consequences */}
      <Card className="p-6 bg-yellow-500/10 border-yellow-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-yellow-500/20">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Konsekuensi Pelanggaran</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Peringatan pertama untuk pelanggaran ringan</li>
              <li>• Pembatasan akses untuk pelanggaran berulang</li>
              <li>• Pembekuan akun sementara untuk pelanggaran serius</li>
              <li>• Pemblokiran permanen untuk pelanggaran berat</li>
              <li>• Moderator berhak mengambil tindakan sesuai konteks</li>
              <li>• Keputusan moderator bersifat final</li>
              <li>• Tidak ada toleransi untuk pelanggaran yang disengaja</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}