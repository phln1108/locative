import { getCategoryCodeLabelFromRegistry } from "@/lib/category-mapping";

export function getCategoryCodeLabel(categoryCode?: string | null): string {
  if (!categoryCode) return "Sem categoria";
  return getCategoryCodeLabelFromRegistry(categoryCode);
}
