import { getCategoryCodeLabelFromRegistry } from "@/lib/category-mapping";

export function getCategoryCodeLabel(categoryCode?: string | null): string {
  if (!categoryCode) return "Categoria pendente";
  return getCategoryCodeLabelFromRegistry(categoryCode);
}
