export const PREMIUM_TIERS = {
  silver: {
    id: 'silver',
    name: 'Silver',
    price: 250,
    maxImages: 4,
    maxVideos: 0,
    features: [
      'Featured listings placement',
      'Social Media Promotion',
      '4 images per property',
      'No videos',
      '4 promotions per month'
    ]
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 350,
    maxImages: 7,
    maxVideos: 1,
    features: [
      'Featured listings placement',
      'Premium badge on listings',
      'Social Media Promotion',
      '7 images per property',
      '1 video per property',
      '8 promotions per month'
    ]
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    price: 450,
    maxImages: 10,
    maxVideos: 3,
    features: [
      'Featured listings placement',
      'Premium badge on listings',
      'Social Media Promotion',
      '10 images per property',
      '3 videos per property',
      '12 promotions per month',
      'Priority support'
    ]
  }
} as const;

export type PremiumTier = keyof typeof PREMIUM_TIERS;
