export type PropertyStatus = "for_sale" | "for_rent";
export type PropertyType = "land" | "furnished_apartment" | "apartment" | "house" | "boarding_house";
export type Currency = "ZMW" | "USD" | "GBP";
export type PricePeriod = "per_month" | "per_week" | "per_day";
export type PremiumTier = "silver" | "gold" | "platinum";

export interface Property {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  pricePeriod: PricePeriod;
  images: string[];
  videos?: string[];
  status: PropertyStatus;
  type: PropertyType;
  location: string;
  size: number;
  sizeUnit: "ha" | "m2" | "sqf";
  description: string;
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  ownerIsPremium?: boolean;
  ownerPremiumExpiry?: Date;
  ownerPremiumTier?: PremiumTier;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPremium: boolean;
  premiumTier?: PremiumTier;
  premiumExpiryDate?: Date;
  createdAt: Date;
}
