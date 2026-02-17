import type { Place } from "@/models/models";

type BadgeVariant = "default" | "secondary" | "destructive";

interface DerivedBadge {
  label: string;
  variant?: BadgeVariant;
  priority?: number;
}

export function deriveBadges(place: Place): DerivedBadge[] {
  const badges: DerivedBadge[] = [];

  // Tipo
  if (place.type === "tour") {
    badges.push({
      label: "Experiência",
      priority: 1,
    });
  }

  // Aberto agora
  if (place.openingHours?.openNow) {
    badges.push({
      label: "Aberto agora",
      variant: "secondary",
      priority: 2,
    });
  }

  // Alta avaliação
  if ((place.rating ?? 0) >= 4.8 && (place.reviews ?? 0) > 100) {
    badges.push({
      label: "Muito bem avaliado",
      priority: 3,
    });
  }

  // Popularidade
  if ((place.reviews ?? 0) > 300) {
    badges.push({
      label: "Popular",
      priority: 4,
    });
  }

  // Destaque manual
  if (place.badges?.some(b => b.label === "Mais vendido")) {
    badges.push({
      label: "Mais vendido",
      priority: 0,
    });
  }

  // Ordenação por prioridade
  return badges
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .map(({ priority, ...badge }) => badge);
}

import { getCategoryByKey } from "@/data/categories";

export interface DerivedCategory {
  key: string;
  label: string;
  emoji: string;
  color: string;
  nearBy: number;
}

export function deriveCategories(places: Place[]): DerivedCategory[] {
  const map = new Map<string, DerivedCategory>();

  places.forEach((place) => {
    const category = getCategoryByKey(place.categoryKey);
    if (!category) return;

    if (!map.has(category.key)) {
      map.set(category.key, {
        key: category.key,
        label: category.label,
        emoji: category.emoji,
        color: category.color,
        nearBy: 0,
      });
    }

    if (place.type !== "tour") {
      map.get(category.key)!.nearBy += 1;
    }
  });

  return Array.from(map.values()).sort((a, b) => b.nearBy - a.nearBy);
}
