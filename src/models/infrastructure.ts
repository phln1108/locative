import type { LocativeElement } from "./locative-element";

export type InfrastructureKind =
  | "traffic_light"
  | "wifi_hotspot"
  | "waste_collection_point"
  | "digital_totem"
  | "bridge"
  | "drainage"
  | "reservoir"
  | "other";

export interface Infrastructure extends LocativeElement {
  element_type: "infrastructure";

  infrastructure_kind: InfrastructureKind;

  operator?: string;
  asset_code?: string;

  operational_status?:
    | "operating"
    | "degraded"
    | "down"
    | "under_maintenance";

  maintenance?: {
    last_maintenance_at?: string;
    next_maintenance_at?: string;
    responsible_team?: string;
  };

  telemetry_endpoints?: string[];
}