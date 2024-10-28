import { Card } from '@/components/ui/card';
import { 
  Users,
  DollarSign,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';

interface AffiliateStatsProps {
  totalReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  affiliateCode: string;
}

export function AffiliateStats({ 
  totalReferrals,
  totalEarnings,
  conversionRate,
  affiliateCode
}: AffiliateStatsProps) {
  const stats = [
    {
      label: 'Total Referrals',
      value: totalReferrals,
      icon: Users,
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Total Earnings',
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      change: '+5%',
      trend: 'up'
    },
    {
      label: 'Affiliate Code',
      value: affiliateCode,
      icon: LinkIcon,
      copyable: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            {stat.trend && (
              <span className={cn(
                "text-xs font-medium",
                stat.trend === 'up' ? "text-green-500" : "text-red-500"
              )}>
                {stat.change}
              </span>
            )}
            {stat.copyable && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(stat.value);
                  toast({
                    title: "Copied!",
                    description: "Affiliate code copied to clipboard",
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}