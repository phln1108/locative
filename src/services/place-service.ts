import { mockedPlaces } from "@/data/mocked-places";
import type { Place } from "@/models/models";

class PlaceService {
  async getAll(): Promise<Place[]> {
    return Promise.resolve(mockedPlaces);
  }

  async getById(id: number): Promise<Place | undefined> {
    return Promise.resolve(
      mockedPlaces.find((p) => p.id === id)
    );
  }

  async getByType(type: Place["type"]) {
    return Promise.resolve(
      mockedPlaces.filter((p) => p.type === type)
    );
  }

  async getFeatured(limit = 8) {
    return Promise.resolve(
      mockedPlaces
        .filter((p) => p.rating && p.rating >= 4.5)
        .slice(0, limit)
    );
  }

  async getByCategory(categoryKey: string) {
    return Promise.resolve(
      mockedPlaces.filter((p) => p.categoryKey === categoryKey)
    );
  }
}

export const placeService = new PlaceService();
