import type { ElementType } from "@/domain/models/locative-element";
import type { PoiMacroType } from "@/domain/models/poi";

export interface UiCategory {
  code: ElementType | PoiMacroType; // deve bater com element_type OU poi_macro_type
  label: string;
  emoji: string;
  color: string;
}
