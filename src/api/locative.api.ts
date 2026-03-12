import { http } from "./http-client";
import type {
  BackendPoiDTO,
  CoordinatesInputDTO,
  FavoriteInputDTO,
  LoginInputDTO,
  LoginOutputDTO,
  PoiDetailInputDTO,
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
