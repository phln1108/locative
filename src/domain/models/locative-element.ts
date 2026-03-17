import type { MediaAsset } from "./media";

export type ElementType =
  | "public_place"
  | "infrastructure"
  | "public_service"
  | "situated_event"
  | "symbolic_historic"
  | "commercial_poi"
  | "public_transport"
  | "nature"
  | "dynamic_mobile"
  // legados mantidos para compatibilidade de leitura
  | "symbolic_heritage"
  | "natural_element"
  | "mobile_element"
  | "religious_spiritual";

export interface Address {
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface TemporalValidity {
  start_datetime?: string;
  end_datetime?: string;
  timezone?: string;
}

export interface Provenance {
  source_system?: string;
  dataset_id?: string;
  license?: string;
  retrieved_at?: string;
  confidence?: number;
}

export interface LocativeCategory {
  code: string;
  is_primary: boolean;
}

export interface LocativeElement {
  element_id: string;
  element_type: ElementType;

  name: string;
  description?: string;

  geometry: GeoJSON.Geometry;
  centroid?: { lat: number; lng: number };

  media?: MediaAsset[];

  address?: Address;
  temporal_validity?: TemporalValidity;

  status?: "active" | "inactive" | "planned" | "unknown";

  interaction_potential?: ("qr" | "nfc" | "ar" | "kiosk" | "sensor")[];

  categories?: LocativeCategory[];
  tags?: string[];

  provenance?: Provenance;

  created_at?: string;
  updated_at?: string;
}
