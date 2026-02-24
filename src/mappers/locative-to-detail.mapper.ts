import type { LocativeUnion } from "@/domain/models/locative-union";
import type { PlaceDetailVM } from "@/view-models/place-detail.vm";

export function mapToDetailVM(
  element: LocativeUnion
): PlaceDetailVM {

  return {
    id: element.element_id,
    title: element.name,
    description: element.description,
    images:
      element.media?.filter(m => m.type === "image").map(m => m.url) ?? [],
    rating:
      "rating" in element ? element.rating?.value : undefined,
    meta: buildMeta(element),
  };
}

function buildMeta(element: LocativeUnion) {
  switch (element.element_type) {
    case "commercial_poi":
      return {
        macroType: element.poi_macro_type,
      };

    case "situated_event":
      return {
        start: element.start_datetime,
        end: element.end_datetime,
      };

    case "natural_element":
      return {
        kind: element.natural_kind,
      };

    default:
      return {};
  }
}