import { locativeService } from "@/services/locative.service";
import type { Place, PlaceContact } from "@/models/models";
import type { BackendPoiDTO, SearchInputDTO } from "@/types/locative-query";
import { mapCategoryCodeToCategoryKey } from "@/lib/category-mapping";
import { getCategoryCodeLabel } from "@/lib/category-code-labels";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function toNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formatDistanceFromMeters(value: unknown): string | undefined {
  const distanceMeters = toNumber(value);
  if (distanceMeters === undefined) return undefined;
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m`;
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function parseContacts(value: unknown): PlaceContact[] {
  if (!Array.isArray(value)) return [];

  const contacts: PlaceContact[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;
    const type = toNonEmptyString(record.contact_type);
    const contactValue = toNonEmptyString(record.contact_value);

    if (!type || !contactValue) continue;

    contacts.push({
      id: toNumber(record.contact_id),
      type,
      value: contactValue,
      label: toNonEmptyString(record.label),
      isPrimary: Boolean(record.is_primary),
    });
  }

  return contacts;
}

function parseKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const keywords: string[] = [];
  for (const item of value) {
    const keyword = toNonEmptyString(item);
    if (keyword) {
      keywords.push(keyword);
    }
  }

  return Array.from(new Set(keywords));
}

function parseOpeningHours(value: unknown): Place["openingHours"] | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;

  if (record.always_open === true) {
    return {
      alwaysOpen: true,
      timezone: toNonEmptyString(record.timezone),
      schedule: [],
    };
  }

  const scheduleRecord = record.schedule as Record<string, unknown> | undefined;
  if (!scheduleRecord || typeof scheduleRecord !== "object") return undefined;

  const dayLabels: Record<string, string> = {
    monday: "Segunda",
    tuesday: "Terca",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sabado",
    sunday: "Domingo",
  };

  const schedule = Object.entries(scheduleRecord)
    .flatMap(([day, intervals]) => {
      if (!Array.isArray(intervals) || intervals.length === 0) return [];
      return intervals
        .map((interval) => {
          if (typeof interval !== "string" || interval.length < 11 || !interval.includes("-")) {
            return null;
          }
          const [open, close] = interval.split("-");
          if (!open || !close) return null;
          return {
            day: dayLabels[day] ?? day,
            open,
            close,
          };
        })
        .filter((item): item is { day: string; open: string; close: string } => Boolean(item));
    });

  return {
    timezone: toNonEmptyString(record.timezone),
    schedule,
  };
}

function mapBackendPoiToPlace(
  item: BackendPoiDTO,
  index: number,
  fallbackId?: number
): Place | null {
  const record = item as Record<string, unknown>;

  const idRaw = record.poi_id ?? record.id ?? record.element_id ?? fallbackId ?? index + 1;
  const id = toNumber(idRaw);
  if (!id) return null;

  const title =
    toNonEmptyString(record.nome_local) ??
    (record.nome as string | undefined) ??
    (record.name as string | undefined) ??
    (record.title as string | undefined) ??
    `POI ${id}`;

  const ratingObj = record.rating as Record<string, unknown> | undefined;
  const rating =
    toNumber(ratingObj?.value) ??
    toNumber(record.rating) ??
    toNumber(record.nota) ??
    toNumber(record.avaliacao);
  const reviews =
    toNumber(ratingObj?.count) ?? toNumber(record.reviews) ?? toNumber(record.avaliacoes);

  const coords = record.coordinates as Record<string, unknown> | undefined;
  const geoCoordinate = record.coordenada_geografica as Record<string, unknown> | undefined;
  const geometry = record.geometry as Record<string, unknown> | undefined;
  const geometryCoordinates = geometry?.coordinates as unknown[] | undefined;

  const lat =
    toNumber(record.latitude) ??
    toNumber(record.lat) ??
    toNumber(geoCoordinate?.latitude) ??
    toNumber(coords?.lat) ??
    toNumber(coords?.latitude) ??
    toNumber(geometryCoordinates?.[1]);

  const lng =
    toNumber(record.longitude) ??
    toNumber(record.lng) ??
    toNumber(record.lon) ??
    toNumber(geoCoordinate?.longitude) ??
    toNumber(coords?.lng) ??
    toNumber(coords?.longitude) ??
    toNumber(geometryCoordinates?.[0]);

  const categoryCode =
    (record.poi_macro_type as string | undefined) ??
    (record.public_service_domain as string | undefined) ??
    (record.category_code as string | undefined) ??
    (record.category as string | undefined) ??
    (record.categoria as string | undefined) ??
    (record.element_type as string | undefined);

  const image =
    toNonEmptyString(record.image_url) ??
    toNonEmptyString(record.imagem) ??
    toNonEmptyString(record.photo) ??
    toNonEmptyString((record.images as string[] | undefined)?.[0]) ??
    toNonEmptyString((record.fotos as string[] | undefined)?.[0]);

  const elementType = (record.element_type as string | undefined) ?? "";
  const placeType: Place["type"] =
    elementType === "situated_event"
      ? "tour"
      : elementType === "public_service" || categoryCode === "public_service"
        ? "service"
        : "place";

  const addressText =
    (record.endereco as string | undefined) ??
    (record.address as string | undefined);
  const contacts = parseContacts(record.contacts);
  const keywords = parseKeywords(record.keywords);
  const openingHours = parseOpeningHours(record.opening_hours_json);
  const primaryPhone = contacts.find((contact) => contact.type === "phone" || contact.type === "whatsapp");
  const primaryWebsite = contacts.find((contact) => contact.type === "website");
  const primaryEmail = contacts.find((contact) => contact.type === "email");

  return {
    id,
    type: placeType,
    title,
    subtitle:
      (record.subtitle as string | undefined) ??
      getCategoryCodeLabel(categoryCode) ??
      (record.categoria as string | undefined) ??
      (record.category as string | undefined),
    categoryKey: mapCategoryCodeToCategoryKey(categoryCode),
    description:
      (record.description as string | undefined) ??
      (record.descricao as string | undefined),
    images: [image ?? ""],
    rating,
    reviews,
    distance:
      (record.distance as string | undefined) ??
      (record.distancia as string | undefined) ??
      formatDistanceFromMeters(record.distancia_metros),
    price: toNumber(record.price),
    priceLevel: toNumber(record.price_level) as 0 | 1 | 2 | 3 | 4 | undefined,
    duration:
      (record.duration as string | undefined) ??
      (record.duracao as string | undefined),
    coordinates:
      lat !== undefined && lng !== undefined
        ? {
            lat,
            lng,
          }
        : undefined,
    address: addressText
      ? {
          street: addressText,
          number: "",
          neighborhood: "",
          city: "",
          state: "",
        }
      : undefined,
    contact: {
      phone:
        primaryPhone?.value ??
        (record.phone as string | undefined) ??
        (record.telefone as string | undefined),
      website:
        primaryWebsite?.value ??
        (record.website as string | undefined) ??
        (record.url as string | undefined),
      email: primaryEmail?.value ?? ((record.email as string | undefined) ?? undefined),
    },
    contacts,
    keywords,
    openingHours,
  };
}

async function fetchFromApi(lat: number, lng: number): Promise<Place[]> {
  const items = await locativeService.getNearElements(lat, lng, {
    raio_metros: 3000,
    limite: 100,
  });

  return items
    .map((item, index) => mapBackendPoiToPlace(item, index))
    .filter((place): place is Place => Boolean(place));
}

class PlaceService {
  async getAll(lat: number, lng: number): Promise<Place[]> {
    return fetchFromApi(lat, lng);
  }

  async getById(id: number, lat: number, lng: number): Promise<Place | undefined> {
    const detail = await locativeService.getPoiDetail(id, {
      latitude: lat,
      longitude: lng,
    });
    const fromDetail = mapBackendPoiToPlace(detail, 0, id);

    const list = await fetchFromApi(lat, lng);
    const fromList = list.find((p) => p.id === id);

    if (fromDetail && fromList) {
      return {
        ...fromList,
        ...fromDetail,
        coordinates: fromDetail.coordinates ?? fromList.coordinates,
        images:
          fromDetail.images?.some((image) => Boolean(image?.trim()))
            ? fromDetail.images
            : fromList.images,
      };
    }

    return fromDetail ?? fromList;
  }

  async getByType(type: Place["type"], lat: number, lng: number) {
    const list = await fetchFromApi(lat, lng);
    return list.filter((p) => p.type === type);
  }

  async getFeatured(lat: number, lng: number, limit = 8) {
    const list = await fetchFromApi(lat, lng);
    return list.filter((p) => p.rating && p.rating >= 4.5).slice(0, limit);
  }

  async getByCategory(categoryKey: string, lat: number, lng: number) {
    const list = await fetchFromApi(lat, lng);
    return list.filter((p) => p.categoryKey === categoryKey);
  }

  async listFavorites() {
    const items = await locativeService.listFavorites();
    return items
      .map((item, index) => mapBackendPoiToPlace(item, index))
      .filter((place): place is Place => Boolean(place));
  }

  async search(filters: {
    query?: string;
    categoryCode?: string;
    keywords?: string[];
    limit?: number;
  }) {
    const payload: SearchInputDTO = {};
    const query = filters.query?.trim();
    const categoryCode = filters.categoryCode?.trim();
    const keywords =
      filters.keywords?.map((keyword) => keyword.trim()).filter(Boolean) ?? [];

    if (query) {
      payload.busca = query;
    }
    if (categoryCode) {
      payload.category_code = categoryCode;
    }
    if (keywords.length > 0) {
      payload.keywords = keywords;
    }
    if (typeof filters.limit === "number") {
      payload.limite = filters.limit;
    }

    const items = await locativeService.search(payload);
    return items
      .map((item, index) => mapBackendPoiToPlace(item, index))
      .filter((place): place is Place => Boolean(place));
  }

  async listFavoriteIds(): Promise<number[]> {
    const items = await locativeService.listFavorites();
    const ids = items
      .map((item, index) => {
        const record = item as Record<string, unknown>;
        const idRaw = record.poi_id ?? record.id ?? record.element_id ?? index + 1;
        return toNumber(idRaw);
      })
      .filter((id): id is number => Boolean(id));

    return Array.from(new Set(ids));
  }

  async toggleFavorite(poiId: number): Promise<number[]> {
    await locativeService.favoritePoi({ poi_id: poiId });
    return this.listFavoriteIds();
  }
}

export const placeService = new PlaceService();
