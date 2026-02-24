import type { UiCategory } from "@/models/ui/category-registry";

export const uiCategoryRegistry: UiCategory[] = [
  {
    code: "food_beverage",
    label: "Alimentação",
    emoji: "🍽️",
    color: "rgba(249,115,22,0.15)",
  },
  {
    code: "retail",
    label: "Compras",
    emoji: "🛍️",
    color: "rgba(236,72,153,0.15)",
  },
  {
    code: "entertainment",
    label: "Entretenimento",
    emoji: "🎭",
    color: "rgba(251,146,60,0.15)",
  },
  {
    code: "tourism_hospitality",
    label: "Turismo",
    emoji: "🏛️",
    color: "rgba(100,116,139,0.15)",
  },
  {
    code: "natural_element",
    label: "Natureza",
    emoji: "🌳",
    color: "rgba(16,185,129,0.15)",
  },
  {
    code: "public_service",
    label: "Serviço Público",
    emoji: "🏥",
    color: "rgba(239,68,68,0.15)",
  },
  {
    code: "public_transport",
    label: "Transporte",
    emoji: "🚌",
    color: "rgba(59,130,246,0.15)",
  },
];