import type { LocativeElement } from "./locative-element";

export type ReligionKind =
  | "church"
  | "chapel"
  | "temple"
  | "mosque"
  | "synagogue"
  | "spiritist_center"
  | "terreiro"
  | "shrine"
  | "pilgrimage_site"
  | "other";

export interface ReligiousSpiritual extends LocativeElement {
  element_type: "religious_spiritual";

  religion_kind: ReligionKind;

  denomination_or_tradition?: string;

  public_access?: {
    open_to_public?: boolean;
    visiting_rules?: string;
  };

  service_times?: string[];

  heritage_overlap_element_id?: string;
}