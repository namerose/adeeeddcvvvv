import { Project } from './project';

export type ListingTier = 'free' | 'premium' | 'sponsored';
export type ListingDuration = '7days' | '30days' | '90days';

export interface ListingPrice {
  tier: ListingTier;
  duration: ListingDuration; 
  price: number;
  features: string[];
}

export interface ProjectListing extends Project {
  tier: ListingTier;
  expiresAt: string;
  featured?: boolean;
  promoted?: boolean;
  affiliateCode?: string;
  affiliateCommission?: number;
}

export interface JobListing {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'full-time' | 'part-time' | 'contract';
  location: string;
  remote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  experience: string;
  postedAt: string;
  expiresAt: string;
  featured?: boolean;
}

export interface AffiliatePartner {
  id: string;
  name: string;
  email: string;
  website?: string;
  affiliateCode: string;
  commission: number;
  totalReferrals: number;
  totalEarnings: number;
  paymentDetails?: {
    type: 'paypal' | 'stripe' | 'bank';
    email?: string;
    accountNumber?: string;
  };
}

export const LISTING_PRICES: ListingPrice[] = [
  {
    tier: 'free',
    duration: '7days',
    price: 0,
    features: [
      'Basic project listing',
      'Community engagement',
      'Basic analytics'
    ]
  },
  {
    tier: 'premium',
    duration: '30days',
    price: 49,
    features: [
      'Enhanced visibility',
      'Featured on homepage',
      'Priority support',
      'Advanced analytics',
      'Custom branding'
    ]
  },
  {
    tier: 'sponsored',
    duration: '90days',
    price: 199,
    features: [
      'Top placement in search',
      'Promoted across platform',
      'Dedicated support',
      'Full analytics suite',
      'Custom branding',
      'Social media promotion',
      'Newsletter feature'
    ]
  }
];