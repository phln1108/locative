export interface LoginInputDTO {
  email: string;
  senha: string;
}

export interface LoginOutputDTO {
  access_token: string;
  token_type?: string;
  expires_in_seconds: number;
}

export interface RegisterInputDTO {
  email: string;
  senha: string;
  full_name?: string;
}

export interface RegisterOutputDTO {
  user_id: number;
  email: string;
  full_name?: string | null;
}

export interface AdminPoiListItemDTO {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  category_code: string;
  latitude: number;
  longitude: number;
  address_street?: string | null;
  address_number?: string | null;
  address_neighborhood?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_postal_code?: string | null;
  address_country?: string | null;
  brand?: string | null;
  price_level?: number | null;
  image_url?: string | null;
  opening_hours_json?: AdminOpeningHoursDTO | null;
  contacts: AdminPoiContactDTO[];
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface AdminPoiContactDTO {
  contact_id?: number;
  contact_type: string;
  contact_value: string;
  label?: string | null;
  is_primary: boolean;
  created_at?: string;
}

export interface AdminPoiCreateInputDTO {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category_code: string;
  address_street?: string;
  address_number?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
  address_country?: string;
  status?: string;
  brand?: string;
  price_level?: number;
  image_url?: string;
  opening_hours_json?: AdminOpeningHoursDTO;
  contacts: AdminPoiContactInputDTO[];
  keywords: string[];
}

export interface AdminOpeningHoursDTO {
  timezone?: string;
  always_open?: boolean;
  schedule?: Record<string, string[]>;
}

export interface AdminPoiContactInputDTO {
  contact_type: string;
  contact_value: string;
  label?: string;
  is_primary: boolean;
}

export interface AdminPoiCreateOutputDTO {
  id: number;
  name: string;
  category_code: string;
  status: string;
}

export interface AdminPoiUpdateOutputDTO {
  id: number;
  name: string;
  category_code: string;
  status: string;
}

export interface CoordinatesInputDTO {
  latitude: number;
  longitude: number;
  raio_metros?: number;
  limite?: number;
}

export interface SearchInputDTO {
  busca?: string;
  category_code?: string;
  keywords?: string[];
  limite?: number;
}

export interface FavoriteInputDTO {
  poi_id: number;
}

export interface PoiDetailInputDTO {
  poi_id: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ValidationErrorDTO {
  loc: Array<string | number>;
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HttpValidationErrorDTO {
  detail?: ValidationErrorDTO[];
}

export type BackendPoiDTO = Record<string, unknown>;
