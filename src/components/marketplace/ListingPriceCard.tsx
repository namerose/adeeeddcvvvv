import { ListingPrice } from '@/types/marketplace';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingPriceCardProps {
  plan: ListingPrice;
  popular?: boolean;
  onSelect: (plan: ListingPrice) => void;
}

export function ListingPriceCard({ plan, popular, onSelect }: ListingPriceCardProps) {
  return (
    <Card className={cn(
      "relative p-6",
      popular && "border-primary shadow-lg"
    )}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold capitalize mb-2">{plan.tier}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">
            /{plan.duration.replace('days', ' days')}
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        className="w-full"
        variant={popular ? "default" : "outline"}
        onClick={() => onSelect(plan)}
      >
        Select {plan.tier} Plan
      </Button>
    </Card>
  );
}