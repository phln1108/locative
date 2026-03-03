import type { UiCategory } from "@/models/ui/category-registry";

export const uiCategoryRegistry: UiCategory[] = [
  {
    code: "public_place",
    label: "Lugar Publico",
    emoji: "???",
    color: "rgba(2,132,199,0.15)",
  },
  {
    code: "infrastructure",
    label: "Infraestrutura Urbana",
    emoji: "???",
    color: "rgba(107,114,128,0.15)",
  },
  {
    code: "public_service",
    label: "Servico Publico Situado",
    emoji: "??",
    color: "rgba(239,68,68,0.15)",
  },
  {
    code: "situated_event",
    label: "Evento Situado",
    emoji: "??",
    color: "rgba(245,158,11,0.15)",
  },
  {
    code: "symbolic_heritage",
    label: "Patrimonio Simbolico",
    emoji: "??",
    color: "rgba(168,85,247,0.15)",
  },
  {
    code: "commercial_poi",
    label: "POI Comercial",
    emoji: "???",
    color: "rgba(236,72,153,0.15)",
  },
  {
    code: "public_transport",
    label: "Transporte Publico",
    emoji: "??",
    color: "rgba(59,130,246,0.15)",
  },
  {
    code: "natural_element",
    label: "Elemento Natural Urbano",
    emoji: "??",
    color: "rgba(16,185,129,0.15)",
  },
  {
    code: "mobile_element",
    label: "Elemento Movel Urbano",
    emoji: "??",
    color: "rgba(14,165,233,0.15)",
  },
  {
    code: "religious_spiritual",
    label: "Religioso e Espiritual",
    emoji: "?",
    color: "rgba(99,102,241,0.15)",
  },
  {
    code: "food_beverage",
    label: "Alimentacao e Bebidas",
    emoji: "???",
    color: "rgba(249,115,22,0.15)",
  },
  {
    code: "nightlife",
    label: "Vida Noturna",
    emoji: "??",
    color: "rgba(217,70,239,0.15)",
  },
  {
    code: "retail",
    label: "Compras e Varejo",
    emoji: "???",
    color: "rgba(236,72,153,0.15)",
  },
  {
    code: "entertainment",
    label: "Lazer e Entretenimento",
    emoji: "??",
    color: "rgba(251,146,60,0.15)",
  },
  {
    code: "tourism_hospitality",
    label: "Turismo e Hospitalidade",
    emoji: "??",
    color: "rgba(100,116,139,0.15)",
  },
  {
    code: "finance",
    label: "Financas e Cambio",
    emoji: "??",
    color: "rgba(234,179,8,0.15)",
  },
  {
    code: "personal_services",
    label: "Servicos Pessoais",
    emoji: "??",
    color: "rgba(34,197,94,0.15)",
  },
  {
    code: "professional_services",
    label: "Servicos Profissionais",
    emoji: "??",
    color: "rgba(120,113,108,0.15)",
  },
  {
    code: "private_education",
    label: "Educacao Privada",
    emoji: "??",
    color: "rgba(99,102,241,0.15)",
  },
  {
    code: "automotive",
    label: "Automotivo e Mobilidade Privada",
    emoji: "??",
    color: "rgba(113,113,122,0.15)",
  },
];

export function getUiCategoryByCode(code?: string) {
  if (!code) return undefined;
  return uiCategoryRegistry.find((category) => category.code === code);
}
