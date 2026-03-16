import { categoryRegistry } from "@/data/categories";

type FrontendCategoryMapping = {
  label: string;
  element_type: string;
  poi_macro_type?: string;
};

// Camada canônica de mapeamento frontend <-> classificação do banco.
// Labels sempre em pt-BR para exibição.
export const FRONTEND_CATEGORY_MAPPING_PTBR: Record<string, FrontendCategoryMapping> = {
  food: {
    label: "Alimentação e bebidas",
    element_type: "commercial_poi",
    poi_macro_type: "food_beverage",
  },
  retail: {
    label: "Comércio e varejo",
    element_type: "commercial_poi",
    poi_macro_type: "retail",
  },
  health: {
    label: "Saúde",
    element_type: "commercial_poi",
    poi_macro_type: "health",
  },
  transport: {
    label: "Transporte",
    element_type: "public_transport",
  },
  public_service: {
    label: "Serviço público",
    element_type: "public_service",
  },
  public_place: {
    label: "Lugar público",
    element_type: "public_place",
  },
  infrastructure: {
    label: "Infraestrutura urbana",
    element_type: "infrastructure",
  },
  automotive: {
    label: "Automotivo e mobilidade privada",
    element_type: "commercial_poi",
    poi_macro_type: "automotive",
  },
  culture: {
    label: "Cultura e patrimônio",
    element_type: "heritage",
  },
  event: {
    label: "Eventos",
    element_type: "situated_event",
  },
};

const CATEGORY_CODE_ALIASES: Record<string, string> = {
  food: "food",
  restaurant: "food",
  private_food_and_beverage: "food",
  food_beverage: "food",
  alimentacao_e_bebidas: "food",
  pois_privados_alimentacao_gastronomia_e_bebidas: "food",

  retail: "retail",
  shopping: "retail",
  private_retail: "retail",
  comercio_e_varejo: "retail",
  pois_privados_compras_e_varejo: "retail",
  pois_privado_compras_e_varejo: "retail",

  health: "health",
  healthcare: "health",
  private_health: "health",
  hospital: "health",
  pharmacy: "health",
  saude: "health",
  pois_privados_saude: "health",

  transport: "transport",
  public_transport: "transport",
  transporte: "transport",

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
  automotivo_e_mobilidade_privada: "automotive",
  pois_privados_automotivo_e_mobilidade_privada: "automotive",

  culture: "culture",
  patrimonio: "culture",
  patrimonio_cultural: "culture",
  heritage: "culture",
  museum: "culture",
  symbolic_heritage: "culture",
  religious_spiritual: "culture",

  event: "event",
  events: "event",
  evento: "event",
  eventos: "event",
  situated_event: "event",
  situated_events: "event",
};

const ELEMENT_TYPE_TO_KEY: Record<string, string> = {
  commercial_poi: "food",
  public_transport: "transport",
  transport: "transport",
  public_service: "public_service",
  public_place: "public_place",
  infrastructure: "infrastructure",
  heritage: "culture",
  situated_event: "event",
  event: "event",
};

const POI_MACRO_TYPE_TO_KEY: Record<string, string> = {
  food_beverage: "food",
  retail: "retail",
  health: "health",
  automotive: "automotive",
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

  if (normalizedElementType === "commercial_poi" && normalizedPoiMacroType) {
    const macroMatch = POI_MACRO_TYPE_TO_KEY[normalizedPoiMacroType];
    if (macroMatch) return macroMatch;
  }

  if (normalizedElementType) {
    const elementMatch = ELEMENT_TYPE_TO_KEY[normalizedElementType];
    if (elementMatch) return elementMatch;
  }

  return "public_service";
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

