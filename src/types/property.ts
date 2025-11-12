export type PropertyStatus = "for_sale" | "for_rent";
export type PropertyType = "land" | "furnished_apartment" | "apartment" | "house";

export interface Property {
  id: string;
  name: string;
  price: number;
  images: string[];
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
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPremium: boolean;
  premiumExpiryDate?: Date;
  createdAt: Date;
}
