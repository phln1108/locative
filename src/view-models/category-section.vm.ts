import type { PlaceCardVM } from "./place-card.vm";

export interface CategorySectionVM {
  category: string;
  items: PlaceCardVM[];
}