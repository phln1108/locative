import type { LocativeUnion } from "@/domain/models/locative-union";
import type { PlaceCardVM } from "@/view-models/place-card.vm";
import { getPrimaryImage } from "./media.utils";

export function mapToPlaceCardVM(
  element: LocativeUnion
): PlaceCardVM {
  return {
    id: element.element_id,
    title: element.name,
    image: getPrimaryImage(element),
    rating:
      "rating" in element ? element.rating?.value : undefined,
    type: element.element_type,
  };
}