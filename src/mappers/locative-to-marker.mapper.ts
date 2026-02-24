import type { LocativeUnion } from "@/domain/models/locative-union";
import type { MapMarkerVM } from "@/view-models/map-marker.vm";

export function mapToMarkerVM(
  element: LocativeUnion
): MapMarkerVM {
  if (element.geometry.type !== "Point") return null as any;

  return {
    id: element.element_id,
    lat: element.geometry.coordinates[1],
    lng: element.geometry.coordinates[0],
    label: element.name,
    type: element.element_type,
  };
}