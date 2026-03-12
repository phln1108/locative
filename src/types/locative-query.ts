export interface LoginInputDTO {
  email: string;
  senha: string;
}

export interface LoginOutputDTO {
  access_token: string;
  token_type?: string;
  expires_in_seconds: number;
}

export interface CoordinatesInputDTO {
  latitude: number;
  longitude: number;
  raio_metros?: number;
  limite?: number;
}

export interface SearchInputDTO {
  busca: string;
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
