import { categoryRegistry } from "@/data/categories";

type FrontendCategoryMapping = {
  label: string;
  element_type: string;
  poi_macro_type?: string;
};

// Camada canônica de mapeamento frontend <-> classificação do banco.
// Labels sempre em pt-BR para exibição.
export const FRONTEND_CATEGORY_MAPPING_PTBR: Record<string, FrontendCategoryMapping> = {
  uncategorized: { label: "Categoria pendente", element_type: "poi", poi_macro_type: "uncategorized" },
  public_place: { label: "Lugares físicos públicos", element_type: "poi", poi_macro_type: "public_place" },
  infrastructure: { label: "Infraestruturas urbanas", element_type: "poi", poi_macro_type: "infrastructure" },
  public_service: { label: "Serviços públicos situados", element_type: "poi", poi_macro_type: "public_service" },
  event: { label: "Eventos situados", element_type: "event" },
  symbolic_historic: { label: "Elementos históricos e simbólicos", element_type: "poi", poi_macro_type: "symbolic_historic" },
  public_transport: { label: "Rotas e infraestruturas de transporte público", element_type: "poi", poi_macro_type: "public_transport" },
  nature: { label: "Elementos naturais urbanos", element_type: "poi", poi_macro_type: "nature" },
  dynamic_mobile: { label: "Elementos urbanos dinâmicos ou móveis", element_type: "poi", poi_macro_type: "dynamic_mobile" },
  private_food_beverage: { label: "Alimentação, gastronomia e bebidas", element_type: "poi", poi_macro_type: "private_food_beverage" },
  private_nightlife: { label: "Vida noturna", element_type: "poi", poi_macro_type: "private_nightlife" },
  private_retail: { label: "Compras e varejo", element_type: "poi", poi_macro_type: "private_retail" },
  private_entertainment_leisure: { label: "Lazer e entretenimento privados", element_type: "poi", poi_macro_type: "private_entertainment_leisure" },
  private_tourism_hospitality: { label: "Turismo e hospitalidade", element_type: "poi", poi_macro_type: "private_tourism_hospitality" },
  private_finance_exchange: { label: "Finanças e câmbio", element_type: "poi", poi_macro_type: "private_finance_exchange" },
  private_personal_services: { label: "Serviços pessoais", element_type: "poi", poi_macro_type: "private_personal_services" },
  private_professional_services: { label: "Serviços profissionais", element_type: "poi", poi_macro_type: "private_professional_services" },
  private_education: { label: "Educação privada", element_type: "poi", poi_macro_type: "private_education" },
  private_automotive_mobility: { label: "Automotivo e mobilidade privada", element_type: "poi", poi_macro_type: "private_automotive_mobility" },
  private_health: { label: "Saúde privada", element_type: "poi", poi_macro_type: "private_health" },
};

// Estratégias explícitas de ambiguidades:
// - services -> private_personal_services (fallback padrão sem contexto)
// - health -> private_health (fallback padrão para POI privado)
// - education -> private_education (fallback padrão para POI privado)
// - transport -> public_transport (fallback padrão sem contexto)
// - shopping_center -> private_retail (mantido como alias/subtipo)
const CATEGORY_CODE_ALIASES: Record<string, string> = {
  uncategorized: "uncategorized",
  sem_categoria: "uncategorized",
  public_place: "public_place",
  infrastructure: "infrastructure",
  public_service: "public_service",
  event: "event",
  symbolic_historic: "symbolic_historic",
  public_transport: "public_transport",
  nature: "nature",
  dynamic_mobile: "dynamic_mobile",
  private_food_beverage: "private_food_beverage",
  private_nightlife: "private_nightlife",
  private_retail: "private_retail",
  private_entertainment_leisure: "private_entertainment_leisure",
  private_tourism_hospitality: "private_tourism_hospitality",
  private_finance_exchange: "private_finance_exchange",
  private_personal_services: "private_personal_services",
  private_professional_services: "private_professional_services",
  private_education: "private_education",
  private_automotive_mobility: "private_automotive_mobility",
  private_health: "private_health",

  food: "private_food_beverage",
  food_beverage: "private_food_beverage",
  retail: "private_retail",
  shopping_center: "private_retail",
  health: "private_health",
  transport: "public_transport",
  automotive: "private_automotive_mobility",
  services: "private_personal_services",
  tourism: "private_tourism_hospitality",
  education: "private_education",
  culture: "symbolic_historic",
  entertainment: "private_entertainment_leisure",
  finance: "private_finance_exchange",

  shopping: "private_retail",
  restaurant: "private_food_beverage",
  private_food_and_beverage: "private_food_beverage",
  alimentacao_e_bebidas: "private_food_beverage",
  pois_privados_alimentacao_gastronomia_e_bebidas: "private_food_beverage",
  comercio_e_varejo: "private_retail",
  pois_privados_compras_e_varejo: "private_retail",
  pois_privado_compras_e_varejo: "private_retail",
  healthcare: "private_health",
  hospital: "private_health",
  pharmacy: "private_health",
  saude: "private_health",
  pois_privados_saude: "private_health",
  servico_publico: "public_service",
  public_square: "public_place",
  park: "public_place",
  lugar_publico: "public_place",
  infraestrutura_urbana: "infrastructure",
  private_automotive_and_mobility: "private_automotive_mobility",
  automotivo_e_mobilidade_privada: "private_automotive_mobility",
  pois_privados_automotivo_e_mobilidade_privada: "private_automotive_mobility",
  personal_services: "private_personal_services",
  professional_services: "private_professional_services",
  tourism_hospitality: "private_tourism_hospitality",
  situated_event: "event",
  situated_events: "event",
  events: "event",
  evento: "event",
  eventos: "event",
  school: "private_education",
  patrimonio: "symbolic_historic",
  patrimonio_cultural: "symbolic_historic",
  heritage: "symbolic_historic",
  museum: "symbolic_historic",
  symbolic_heritage: "symbolic_historic",
  religious_spiritual: "symbolic_historic",
  nightlife: "private_nightlife",
  natural: "nature",
  natural_element: "nature",
  mobile_element: "dynamic_mobile",
  commercial_poi: "private_personal_services",
  poi: "private_personal_services",
  transporte: "public_transport",
};

const ELEMENT_TYPE_TO_KEY: Record<string, string> = {
  poi: "private_personal_services",
  commercial_poi: "private_personal_services",
  public_place: "public_place",
  infrastructure: "infrastructure",
  public_service: "public_service",
  public_transport: "public_transport",
  transport: "public_transport",
  symbolic_historic: "symbolic_historic",
  heritage: "symbolic_historic",
  religious_spiritual: "symbolic_historic",
  nature: "nature",
  natural_element: "nature",
  dynamic_mobile: "dynamic_mobile",
  mobile_element: "dynamic_mobile",
  situated_event: "event",
  event: "event",
};

const POI_MACRO_TYPE_TO_KEY: Record<string, string> = {
  uncategorized: "uncategorized",
  public_place: "public_place",
  infrastructure: "infrastructure",
  public_service: "public_service",
  symbolic_historic: "symbolic_historic",
  public_transport: "public_transport",
  nature: "nature",
  dynamic_mobile: "dynamic_mobile",
  private_food_beverage: "private_food_beverage",
  private_nightlife: "private_nightlife",
  private_retail: "private_retail",
  private_entertainment_leisure: "private_entertainment_leisure",
  private_tourism_hospitality: "private_tourism_hospitality",
  private_finance_exchange: "private_finance_exchange",
  private_personal_services: "private_personal_services",
  private_professional_services: "private_professional_services",
  private_education: "private_education",
  private_automotive_mobility: "private_automotive_mobility",
  private_health: "private_health",

  food: "private_food_beverage",
  food_beverage: "private_food_beverage",
  retail: "private_retail",
  shopping_center: "private_retail",
  health: "private_health",
  transport: "public_transport",
  automotive: "private_automotive_mobility",
  services: "private_personal_services",
  tourism: "private_tourism_hospitality",
  education: "private_education",
  culture: "symbolic_historic",
  entertainment: "private_entertainment_leisure",
  finance: "private_finance_exchange",
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

  return "uncategorized";
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
