import type { LocativeElement } from "./locative-element";

export type PoiMacroType =
  | "food_beverage"
  | "nightlife"
  | "retail"
  | "entertainment"
  | "tourism_hospitality"
  | "finance"
  | "personal_services"
  | "professional_services"
  | "private_education"
  | "automotive";

export interface CommercialPOI extends LocativeElement {
  element_type: "commercial_poi";

  poi_macro_type: PoiMacroType;

  brand?: string;

  business_status?: "open" | "closed" | "temporarily_closed" | "unknown";

  opening_hours?: any;

  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };

  price_level?: 0 | 1 | 2 | 3 | 4;

  rating?: {
    value?: number;
    count?: number;
    source?: string;
  };

  amenities?: string[];
  payments?: string[];

  external_taxonomy?: {
    provider: "google" | "osm" | "foursquare" | "yelp" | "overture";
    external_type_code: string;
    confidence?: number;
  }[];

  specific?: Record<string, any>;
}