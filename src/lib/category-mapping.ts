import { categoryRegistry } from "@/data/categories";

type FrontendCategoryMapping = {
  label: string;
  element_type: string;
  poi_macro_type?: string;
};

// Camada canonica de mapeamento frontend <-> classificacao do banco.
// Labels sempre em pt-BR para exibicao.
export const FRONTEND_CATEGORY_MAPPING_PTBR: Record<string, FrontendCategoryMapping> = {
  food: { label: "Alimentacao e bebidas", element_type: "poi", poi_macro_type: "food" },
  retail: { label: "Comercio e varejo", element_type: "poi", poi_macro_type: "retail" },
  shopping_center: { label: "Centro de compras", element_type: "poi", poi_macro_type: "shopping_center" },
  health: { label: "Saude", element_type: "poi", poi_macro_type: "health" },
  transport: { label: "Transporte", element_type: "poi", poi_macro_type: "transport" },
  public_service: { label: "Servico publico", element_type: "poi", poi_macro_type: "public_service" },
  public_place: { label: "Lugar publico", element_type: "poi", poi_macro_type: "public_place" },
  infrastructure: { label: "Infraestrutura urbana", element_type: "poi", poi_macro_type: "infrastructure" },
  automotive: { label: "Automotivo e mobilidade privada", element_type: "poi", poi_macro_type: "automotive" },
  services: { label: "Servicos", element_type: "poi", poi_macro_type: "services" },
  tourism: { label: "Turismo e hospitalidade", element_type: "poi", poi_macro_type: "tourism" },
  event: { label: "Eventos", element_type: "event" },
  education: { label: "Educacao", element_type: "poi", poi_macro_type: "education" },
  culture: { label: "Cultura e patrimonio", element_type: "poi", poi_macro_type: "culture" },
  entertainment: { label: "Entretenimento", element_type: "poi", poi_macro_type: "entertainment" },
  nature: { label: "Natureza", element_type: "poi", poi_macro_type: "nature" },
  finance: { label: "Financas", element_type: "poi", poi_macro_type: "finance" },
};

const CATEGORY_CODE_ALIASES: Record<string, string> = {
  food: "food",
  retail: "retail",
  shopping_center: "shopping_center",
  health: "health",
  transport: "transport",
  public_service: "public_service",
  public_place: "public_place",
  infrastructure: "infrastructure",
  automotive: "automotive",
  services: "services",
  tourism: "tourism",
  event: "event",
  education: "education",
  culture: "culture",
  entertainment: "entertainment",
  nature: "nature",
  finance: "finance",

  shopping: "retail",
  restaurant: "food",
  private_food_and_beverage: "food",
  food_beverage: "food",
  alimentacao_e_bebidas: "food",
  pois_privados_alimentacao_gastronomia_e_bebidas: "food",
  private_retail: "retail",
  comercio_e_varejo: "retail",
  pois_privados_compras_e_varejo: "retail",
  pois_privado_compras_e_varejo: "retail",
  healthcare: "health",
  private_health: "health",
  hospital: "health",
  pharmacy: "health",
  saude: "health",
  pois_privados_saude: "health",
  public_transport: "transport",
  transporte: "transport",
  servico_publico: "public_service",
  public_square: "public_place",
  park: "public_place",
  lugar_publico: "public_place",
  infraestrutura_urbana: "infrastructure",
  private_automotive_and_mobility: "automotive",
  automotivo_e_mobilidade_privada: "automotive",
  pois_privados_automotivo_e_mobilidade_privada: "automotive",
  personal_services: "services",
  professional_services: "services",
  tourism_hospitality: "tourism",
  situated_event: "event",
  situated_events: "event",
  events: "event",
  evento: "event",
  eventos: "event",
  school: "education",
  private_education: "education",
  patrimonio: "culture",
  patrimonio_cultural: "culture",
  heritage: "culture",
  museum: "culture",
  symbolic_heritage: "culture",
  religious_spiritual: "culture",
  nightlife: "entertainment",
  natural: "nature",
  natural_element: "nature",
};

const ELEMENT_TYPE_TO_KEY: Record<string, string> = {
  poi: "services",
  commercial_poi: "services",
  public_transport: "transport",
  transport: "transport",
  public_service: "public_service",
  public_place: "public_place",
  infrastructure: "infrastructure",
  heritage: "culture",
  natural_element: "nature",
  natural: "nature",
  situated_event: "event",
  event: "event",
};

const POI_MACRO_TYPE_TO_KEY: Record<string, string> = {
  food: "food",
  food_beverage: "food",
  retail: "retail",
  shopping_center: "shopping_center",
  health: "health",
  transport: "transport",
  public_service: "public_service",
  public_place: "public_place",
  infrastructure: "infrastructure",
  automotive: "automotive",
  services: "services",
  tourism: "tourism",
  education: "education",
  culture: "culture",
  entertainment: "entertainment",
  nature: "nature",
  finance: "finance",
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

export function mapDbClassificationToCategoryKey(params: {
  categoryCode?: string | null;
  elementType?: string | null;
  poiMacroType?: string | null;
}): string {
  const normalizedCategoryCode = normalizeCategoryCode(params.categoryCode);
  const normalizedElementType = normalizeCategoryCode(params.elementType);
  const normalizedPoiMacroType = normalizeCategoryCode(params.poiMacroType);

  if (normalizedCategoryCode) {
    const aliasMatch = CATEGORY_CODE_ALIASES[normalizedCategoryCode];
    if (aliasMatch) return aliasMatch;
  }

  if ((normalizedElementType === "poi" || normalizedElementType === "commercial_poi") && normalizedPoiMacroType) {
    const macroMatch = POI_MACRO_TYPE_TO_KEY[normalizedPoiMacroType];
    if (macroMatch) return macroMatch;
  }

  if (normalizedElementType) {
    const elementMatch = ELEMENT_TYPE_TO_KEY[normalizedElementType];
    if (elementMatch) return elementMatch;
  }

  return "services";
}

export function mapCategoryCodeToCategoryKey(code?: string | null): string {
  return mapDbClassificationToCategoryKey({ categoryCode: code });
}

export function getCategoryCodeLabelFromRegistry(categoryCode?: string | null): string {
  const categoryKey = mapCategoryCodeToCategoryKey(categoryCode);
  const category = categoryRegistry.find((item) => item.key === categoryKey);
  if (category) return category.label;

  const mapped = FRONTEND_CATEGORY_MAPPING_PTBR[categoryKey];
  if (mapped) return mapped.label;

  return "Sem categoria";
}
