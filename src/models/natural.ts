import type { LocativeElement } from "./locative-element";

export type NaturalKind =
  | "river"
  | "lake"
  | "beach"
  | "green_area"
  | "reserve"
  | "botanical_garden"
  | "zoo"
  | "monumental_tree"
  | "other";

export interface NaturalElement extends LocativeElement {
  element_type: "natural_element";

  natural_kind: NaturalKind;

  environmental_attributes?: {
    water_quality?: string;
    vegetation_type?: string;
    protected_level?: string;
  };

  restrictions?: {
    protected_area_rules?: string;
  };
}