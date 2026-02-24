import type { LocativeUnion } from "@/domain/models/locative-union";
import type { CategorySectionVM } from "@/view-models/category-section.vm";
import { mapToPlaceCardVM } from "./locative-to-card.mapper";

export function groupByPrimaryCategory(
  elements: LocativeUnion[]
): CategorySectionVM[] {

  const grouped: Record<string, LocativeUnion[]> = {};

  elements.forEach(el => {
    const primary = el.categories?.find(c => c.is_primary)?.code ?? "other";
    if (!grouped[primary]) grouped[primary] = [];
    grouped[primary].push(el);
  });

  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items: items.map(mapToPlaceCardVM),
  }));
}