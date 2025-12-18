export const PREMIUM_TIERS = {
  silver: {
    id: 'silver',
    name: 'Silver',
    price: 250,
    durationDays: 30,
    maxImages: 4,
    maxVideos: 0,
    features: [
      'Listed for 30 days',
      'Featured listings placement',
      'Social Media Promotion',
      '4 images per property',
      'No videos'
    ]
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 350,
    durationDays: 30,
    maxImages: 7,
    maxVideos: 1,
    features: [
      'Listed for 30 days',
      'Featured listings placement',
      'Premium badge on listing',
      'Social Media Promotion',
      '7 images per property',
      '1 video per property'
    ]
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    price: 450,
    durationDays: 30,
    maxImages: 10,
    maxVideos: 3,
    features: [
      'Listed for 30 days',
      'Featured listings placement',
      'Premium badge on listing',
      'Social Media Promotion',
      '10 images per property',
      '3 videos per property',
      'Priority support'
    ]
  }
} as const;

export type ListingTier = keyof typeof PREMIUM_TIERS;
