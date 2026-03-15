export interface OpeningHours {
  openNow?: boolean;
  schedule: {
    day: string;
    open: string;
    close: string;
  }[];
}

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip?: string;
}

export interface ContactInfo {
  phone?: string;
  website?: string;
  email?: string;
}

export interface PlaceContact {
  id?: number;
  type: string;
  value: string;
  label?: string;
  isPrimary?: boolean;
}

export interface ReviewDetailed {
  id: number;
  user: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RatingBreakdown {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface Place {
  id: number;
  type: "place" | "service" | "tour";
  title: string;
  subtitle?: string;
  categoryKey: string;
  description?: string;

  images: string[];

  rating?: number;
  reviews?: number;
  ratingBreakdown?: RatingBreakdown;
  reviewsDetailed?: ReviewDetailed[];

  distance?: string;
  price?: number;
  priceLevel?: 0 | 1 | 2 | 3 | 4;
  duration?: string;

  address?: Address;
  coordinates?: {
    lat: number;
    lng: number;
  };

  contact?: ContactInfo;
  contacts?: PlaceContact[];

  openingHours?: OpeningHours;

  amenities?: string[];

  social?: {
    instagram?: string;
    facebook?: string;
  };

  badges?: {
    label: string;
    variant?: "default" | "secondary" | "destructive";
  }[];

  sections?: {
    title: string;
    content?: string;
    items?: string[];
  }[];

  quickActions?: {
    type: "call" | "website" | "map" | "share";
    label: string;
    value?: string;
  }[];
}
