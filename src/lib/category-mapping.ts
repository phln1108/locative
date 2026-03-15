import { categoryRegistry } from "@/data/categories";

export const CATEGORY_CODE_ALIASES: Record<string, string> = {
  restaurant: "food",
  private_food_and_beverage: "food",
  food_beverage: "food",
  pois_privados_alimentacao_gastronomia_e_bebidas: "food",
  shopping: "shopping",
  private_retail: "retail",
  pois_privados_compras_e_varejo: "retail",
  pois_privado_compras_e_varejo: "retail",
  shopping_center: "shopping_center",
  pois_privado_shopping_center: "shopping_center",
  health: "health",
  healthcare: "health",
  private_health: "health",
  hospital: "health",
  pharmacy: "health",
  pois_privados_saude: "health",
  transport: "transport",
  public_transport: "transport",
  public_service: "public_service",
  servico_publico: "public_service",
  public_place: "public_place",
  public_square: "public_place",
  park: "public_place",
  lugar_publico: "public_place",
  infrastructure: "infrastructure",
  infraestrutura_urbana: "infrastructure",
  automotive: "automotive",
  private_automotive_and_mobility: "automotive",
  pois_privados_automotivo_e_mobilidade_privada: "automotive",
  services: "services",
  personal_services: "services",
  professional_services: "services",
  commercial_poi: "services",
  mobile_element: "services",
  tourism: "tourism",
  tourism_hospitality: "tourism",
  situated_event: "tourism",
  education: "education",
  school: "education",
  private_education: "education",
  culture: "culture",
  museum: "culture",
  symbolic_heritage: "culture",
  religious_spiritual: "culture",
  entertainment: "entertainment",
  nightlife: "entertainment",
  nature: "nature",
  natural: "nature",
  natural_element: "nature",
  finance: "finance",
  alimentacao_e_bebidas: "food",
  comercio_e_varejo: "retail",
  saude: "health",
  transporte: "transport",
  automotivo_e_mobilidade_privada: "automotive",
};

export function normalizeCategoryCode(code?: string | null): string {
  if (!code) return "";

  return code
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function mapCategoryCodeToCategoryKey(code?: string | null): string {
  const normalizedCode = normalizeCategoryCode(code);
  if (!normalizedCode) return "services";

  const directMatch = categoryRegistry.find((category) => category.key === normalizedCode);
  if (directMatch) return directMatch.key;

  return CATEGORY_CODE_ALIASES[normalizedCode] ?? "services";
}

export function getCategoryCodeLabelFromRegistry(categoryCode?: string | null): string {
  const categoryKey = mapCategoryCodeToCategoryKey(categoryCode);
  const category = categoryRegistry.find((item) => item.key === categoryKey);

  if (category) return category.label;

  return categoryKey
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
