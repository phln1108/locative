import type { LocativeElement } from "./locative-element";

export type PoiMacroType =
  | "uncategorized"
  | "public_place"
  | "infrastructure"
  | "public_service"
  | "symbolic_historic"
  | "public_transport"
  | "nature"
  | "dynamic_mobile"
  | "private_food_beverage"
  | "private_nightlife"
  | "private_retail"
  | "private_entertainment_leisure"
  | "private_tourism_hospitality"
  | "private_finance_exchange"
  | "private_personal_services"
  | "private_professional_services"
  | "private_education"
  | "private_automotive_mobility"
  | "private_health";

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
