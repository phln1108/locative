import { locativeApi } from "@/api/locative.api";
import { setHttpAuthToken } from "@/api/http-client";
import type {
  AdminPoiCreateInputDTO,
  AdminPoiCreateOutputDTO,
  AdminPoiListItemDTO,
  AdminPoiUpdateOutputDTO,
  BackendPoiDTO,
  CoordinatesInputDTO,
  FavoriteInputDTO,
  LoginInputDTO,
  LoginOutputDTO,
  PoiDetailInputDTO,
  RegisterInputDTO,
  RegisterOutputDTO,
  SearchInputDTO,
} from "@/types/locative-query";

const nearElementsInFlight = new Map<string, Promise<BackendPoiDTO[]>>();

function buildNearElementsKey(
  lat: number,
  lng: number,
  options?: Omit<CoordinatesInputDTO, "latitude" | "longitude">
) {
  const normalizedOptions = {
    limite: options?.limite ?? null,
    raio_metros: options?.raio_metros ?? null,
  };

  return JSON.stringify({
    latitude: lat,
    longitude: lng,
    ...normalizedOptions,
  });
}

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

  async register(payload: RegisterInputDTO): Promise<RegisterOutputDTO> {
    return locativeApi.register(payload);
  },

  async listAdminPois(): Promise<AdminPoiListItemDTO[]> {
    return locativeApi.listAdminPois();
  },

  async createAdminPoi(payload: AdminPoiCreateInputDTO): Promise<AdminPoiCreateOutputDTO> {
    return locativeApi.createAdminPoi(payload);
  },

  async getAdminPoi(poiId: number): Promise<AdminPoiListItemDTO> {
    return locativeApi.getAdminPoi(poiId);
  },

  async updateAdminPoi(
    poiId: number,
    payload: AdminPoiCreateInputDTO
  ): Promise<AdminPoiUpdateOutputDTO> {
    return locativeApi.updateAdminPoi(poiId, payload);
  },

  async listKeywords(query?: string): Promise<string[]> {
    return locativeApi.listKeywords(query);
  },

  logout() {
    setHttpAuthToken(null);
  },

  async getNearElements(lat: number, lng: number, options?: Omit<CoordinatesInputDTO, "latitude" | "longitude">) {
    const key = buildNearElementsKey(lat, lng, options);
    const existingRequest = nearElementsInFlight.get(key);
    if (existingRequest) {
      return existingRequest;
    }

    const request = locativeApi
      .pontosProximos({
        latitude: lat,
        longitude: lng,
        ...options,
      })
      .then((response) => normalizePoiListResponse(response))
      .finally(() => {
        nearElementsInFlight.delete(key);
      });

    nearElementsInFlight.set(key, request);
    return request;
  },

  async getPoiDetail(poiId: number, position?: { latitude?: number; longitude?: number }) {
    const payload: PoiDetailInputDTO = {
      poi_id: poiId,
      latitude: position?.latitude,
      longitude: position?.longitude,
    };

    return locativeApi.detalharPoi(payload);
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
