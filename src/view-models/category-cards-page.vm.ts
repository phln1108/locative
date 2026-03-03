import type { PlaceCardVM } from "./place-card.vm";

export interface CategoryCardsHeaderVM {
  title: string;
  description: string;
  actionLabel: string;
}

export interface NearbyHeaderVM {
  title: string;
  subtitle: string;
  total: number;
}

export interface CategoryCardsPageVM {
  categoryKey: string;
  header: CategoryCardsHeaderVM;
  nearby: NearbyHeaderVM;
  places: PlaceCardVM[];
}
