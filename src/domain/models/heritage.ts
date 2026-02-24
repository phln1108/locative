import type { LocativeElement } from "./locative-element";

export type HeritageKind =
  | "monument"
  | "statue"
  | "public_art"
  | "listed_building"
  | "memorial_site"
  | "symbolic_square"
  | "other";

export interface SymbolicHeritage extends LocativeElement {
  element_type: "symbolic_heritage";

  heritage_kind: HeritageKind;

  heritage_protection?: {
    is_listed?: boolean;
    listing_authority?: string;
    listing_id?: string;
  };

  narrative?: string;
  interpretive_links?: string[];
}