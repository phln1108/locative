import { locativeApi } from "@/api/locative.api";
import { setHttpAuthToken } from "@/api/http-client";
import type {
  BackendPoiDTO,
  CoordinatesInputDTO,
  FavoriteInputDTO,
  LoginInputDTO,
  LoginOutputDTO,
  SearchInputDTO,
} from "@/types/locative-query";

function normalizePoiListResponse(
  payload: BackendPoiDTO[] | Record<string, unknown>
): BackendPoiDTO[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const keys = ["items", "results", "data", "pontos", "pois"];
  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value as BackendPoiDTO[];
    }
  }

  return [];
}

export const locativeService = {
  async login(payload: LoginInputDTO): Promise<LoginOutputDTO> {
    const output = await locativeApi.login(payload);
    setHttpAuthToken(output.access_token);
    return output;
  },

  logout() {
    setHttpAuthToken(null);
  },

  async getNearElements(lat: number, lng: number, options?: Omit<CoordinatesInputDTO, "latitude" | "longitude">) {
    const response = await locativeApi.pontosProximos({
      latitude: lat,
      longitude: lng,
      ...options,
    });

    return normalizePoiListResponse(response);
  },

  async getPoiDetail(poiId: number) {
    return locativeApi.detalharPoi(poiId);
  },

  async search(payload: SearchInputDTO) {
    const response = await locativeApi.busca(payload);
    return normalizePoiListResponse(response);
  },

  async listCategories(payload: CoordinatesInputDTO) {
    return locativeApi.listarCategorias(payload);
  },

  async favoritePoi(payload: FavoriteInputDTO) {
    return locativeApi.favoritarPoi(payload);
  },

  async listFavorites() {
    const response = await locativeApi.listarFavoritos();
    return normalizePoiListResponse(response);
  },

  // Compatibilidade temporaria com chamadas antigas.
  async getByType(type: string) {
    return this.search({ busca: type });
  },
};
