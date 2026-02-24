import type { LocativeElement } from "./locative-element";

export type MobileKind =
  | "mobile_health_unit"
  | "mobile_culture_unit"
  | "food_truck"
  | "micromobility_vehicle"
  | "tracked_public_fleet"
  | "other";

export interface MobileElement extends LocativeElement {
  element_type: "mobile_element";

  mobile_kind: MobileKind;

  current_location?: { lat: number; lng: number };
  last_position_at?: string;

  tracking?: {
    provider?: string;
    update_interval_sec?: number;
  };

  service_area?: GeoJSON.Geometry;

  operating_hours?: any;
}