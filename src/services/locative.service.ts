import { locativeApi } from "@/api/locative.api";

export const locativeService = {
  async getNearElements(lat: number, lng: number) {
    return locativeApi.list({ lat, lng });
  },

  async getByType(type: string) {
    return locativeApi.list({ element_type: type });
  },
};