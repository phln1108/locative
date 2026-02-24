import type { LocativeElement } from "./locative-element";

export type PublicSpaceKind =
  | "square"
  | "park"
  | "street"
  | "viewpoint"
  | "pedestrian_area"
  | "public_restroom"
  | "other";

export interface PublicPlace extends LocativeElement {
  element_type: "public_place";

  public_space_kind: PublicSpaceKind;

  managing_authority?: string;

  accessibility?: {
    wheelchair_accessible?: boolean;
    accessible_toilets?: boolean;
    paving?: boolean;
    lighting?: boolean;
  };

  opening_rules?: {
    always_open?: boolean;
    opening_hours?: any;
  };
}