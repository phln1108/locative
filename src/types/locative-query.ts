export interface LocativeQueryParamsDTO {
  lat?: number;
  lng?: number;
  radius?: number;
  element_type?: string;
  poi_macro_type?: string;
  open_now?: boolean;
  page?: number;
  per_page?: number;
}