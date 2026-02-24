import type { LocativeElement } from "./locative-element";

export type TransportAssetKind =
  | "route"
  | "stop"
  | "station"
  | "terminal"
  | "corridor"
  | "timetable"
  | "routing_node";

export type TransportMode = "bus" | "metro" | "tram" | "ferry" | "other";

export interface PublicTransport extends LocativeElement {
  element_type: "public_transport";

  transport_asset_kind: TransportAssetKind;

  mode?: TransportMode;

  gtfs?: {
    route_id?: string;
    stop_id?: string;
    agency_id?: string;
    trip_id?: string;
  };

  schedule?: {
    static_timetable_url?: string;
    realtime_feed_url?: string;
  };

  directionality?: "bidirectional" | "one_way";
}