import type { Category } from "../models/category";

export const categoryRegistry: Category[] = [
  {
    key: "food",
    label: "Alimentacao",
    emoji: "🍽️",
    color: "rgba(249,115,22,0.15)",
  },
  {
    key: "coffee",
    label: "Cafes e Bebidas",
    emoji: "☕",
    color: "rgba(245,158,11,0.15)",
  },
  {
    key: "shopping",
    label: "Compras",
    emoji: "🛍️",
    color: "rgba(236,72,153,0.15)",
  },
  {
    key: "fitness",
    label: "Fitness e Bem-Estar",
    emoji: "💪",
    color: "rgba(34,197,94,0.15)",
  },
  {
    key: "health",
    label: "Saude",
    emoji: "🏥",
    color: "rgba(239,68,68,0.15)",
  },
  {
    key: "transport",
    label: "Transporte",
    emoji: "🚌",
    color: "rgba(59,130,246,0.15)",
  },
  {
    key: "education",
    label: "Educacao",
    emoji: "📚",
    color: "rgba(99,102,241,0.15)",
  },
  {
    key: "entertainment",
    label: "Entretenimento",
    emoji: "🎭",
    color: "rgba(251,146,60,0.15)",
  },
  {
    key: "culture",
    label: "Arte e Cultura",
    emoji: "🎨",
    color: "rgba(168,85,247,0.15)",
  },
  {
    key: "tourism",
    label: "Pontos Turisticos",
    emoji: "🏛️",
    color: "rgba(100,116,139,0.15)",
  },
  {
    key: "nature",
    label: "Natureza e Parques",
    emoji: "🌳",
    color: "rgba(16,185,129,0.15)",
  },
  {
    key: "hotel",
    label: "Hospedagem",
    emoji: "🏨",
    color: "rgba(6,182,212,0.15)",
  },
  {
    key: "services",
    label: "Servicos",
    emoji: "🔧",
    color: "rgba(107,114,128,0.15)",
  },
  {
    key: "pets",
    label: "Pets",
    emoji: "🐾",
    color: "rgba(244,63,94,0.15)",
  },
  {
    key: "beauty",
    label: "Beleza e Estetica",
    emoji: "💅",
    color: "rgba(217,70,239,0.15)",
  },
  {
    key: "automotive",
    label: "Automotivo",
    emoji: "🚗",
    color: "rgba(113,113,122,0.15)",
  },
  {
    key: "finance",
    label: "Servicos Financeiros",
    emoji: "💰",
    color: "rgba(234,179,8,0.15)",
  },
  {
    key: "sports",
    label: "Esportes e Lazer",
    emoji: "⚽",
    color: "rgba(132,204,22,0.15)",
  },
];

export function getCategoryByKey(key: string) {
  return categoryRegistry.find((category) => category.key === key);
}
