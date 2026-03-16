import { http } from "./http-client";
import type {
  AdminEventCreateInputDTO,
  AdminEventCreateOutputDTO,
  AdminEventListItemDTO,
  AdminEventUpdateOutputDTO,
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

export const locativeApi = {
  async login(payload: LoginInputDTO) {
    const { data } = await http.post<LoginOutputDTO>(
      "/login",
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return data;
  },

  async register(payload: RegisterInputDTO) {
    const { data } = await http.post<RegisterOutputDTO>("/register", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  },

  async listAdminPois() {
    const { data } = await http.get<AdminPoiListItemDTO[]>("/internal/pois");
    return data;
  },

  async createAdminPoi(payload: AdminPoiCreateInputDTO) {
    const { data } = await http.post<AdminPoiCreateOutputDTO>("/internal/pois", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  },

  async getAdminPoi(poiId: number) {
    const { data } = await http.get<AdminPoiListItemDTO>(`/internal/pois/${poiId}`);
    return data;
  },

  async updateAdminPoi(poiId: number, payload: AdminPoiCreateInputDTO) {
    const { data } = await http.put<AdminPoiUpdateOutputDTO>(`/internal/pois/${poiId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  },

  async listAdminEvents() {
    const { data } = await http.get<AdminEventListItemDTO[]>("/internal/events");
    return data;
  },

  async createAdminEvent(payload: AdminEventCreateInputDTO) {
    const { data } = await http.post<AdminEventCreateOutputDTO>("/internal/events", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  },

  async getAdminEvent(eventId: number) {
    const { data } = await http.get<AdminEventListItemDTO>(`/internal/events/${eventId}`);
    return data;
  },

  async updateAdminEvent(eventId: number, payload: AdminEventCreateInputDTO) {
    const { data } = await http.put<AdminEventUpdateOutputDTO>(`/internal/events/${eventId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  },

  async listKeywords(query?: string) {
    const { data } = await http.get<string[]>("/internal/keywords", {
      params: query ? { q: query } : undefined,
    });
    return data;
  },

  async pontosProximos(payload: CoordinatesInputDTO) {
    const { data } = await http.post<BackendPoiDTO[] | Record<string, unknown>>(
      "/pontos_proximos",
      payload
    );
    return data;
  },

  async detalharPoi(params: PoiDetailInputDTO) {
    const { data } = await http.get<BackendPoiDTO>("/detalhar_poi", {
      params,
    });
    return data;
  },

  async busca(payload: SearchInputDTO) {
    const { data } = await http.post<BackendPoiDTO[] | Record<string, unknown>>(
      "/busca",
      payload
    );
    return data;
  },

  async listarCategorias(payload: CoordinatesInputDTO) {
    const { data } = await http.post<Record<string, unknown>>(
      "/listar_categorias",
      payload
    );
    return data;
  },

  async favoritarPoi(payload: FavoriteInputDTO) {
    const { data } = await http.post<Record<string, unknown>>(
      "/favoritar_poi",
      payload
    );
    return data;
  },

  async listarFavoritos() {
    const { data } = await http.get<BackendPoiDTO[] | Record<string, unknown>>(
      "/listar_favoritos"
    );
    return data;
  },
};
