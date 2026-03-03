import type { LocativeUnion } from "@/domain/models/locative-union";
import { http } from "./http-client";

export const locativeApi = {
  async list(params?: Record<string, any>) {
    const { data } = await http.get<LocativeUnion[]>("/locative", { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await http.get<LocativeUnion>(`/locative/${id}`);
    return data;
  },
};