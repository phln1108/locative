import { locativeService } from "@/services/locative.service";
import type { Place } from "@/models/models";
import type { BackendPoiDTO } from "@/types/locative-query";

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

function normalizeCategoryCode(code?: string): string {
  if (!code) return "";

  return code
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function mapCategoryCodeToCategoryKey(code?: string): string {
  const normalizedCode = normalizeCategoryCode(code);

  const map: Record<string, string> = {
    food_beverage: "food",
    nightlife: "entertainment",
    retail: "shopping",
    entertainment: "culture",
    tourism_hospitality: "tourism",
    finance: "finance",
    personal_services: "services",
    professional_services: "services",
    private_education: "education",
    automotive: "automotive",
    health: "health",
    education: "education",
    public_place: "public_place",
    infrastructure: "infrastructure",
    public_service: "public_service",
    situated_event: "tourism",
    symbolic_heritage: "culture",
    commercial_poi: "services",
    public_transport: "transport",
    natural_element: "nature",
    mobile_element: "services",
    religious_spiritual: "culture",
    pois_privados_alimentacao_gastronomia_e_bebidas: "food",
    pois_privados_compras_e_varejo: "shopping",
    pois_privado_compras_e_varejo: "shopping",
    pois_privado_shopping_center: "shopping",
    pois_privados_saude: "health",
    pois_privados_automotivo_e_mobilidade_privada: "automotive",
    transport: "transport",
    servico_publico: "public_service",
    lugar_publico: "public_place",
    infraestrutura_urbana: "infrastructure",
    alimentacao_e_bebidas: "food",
    comercio_e_varejo: "shopping",
    shopping_center: "shopping",
    saude: "health",
    transporte: "transport",
    automotivo_e_mobilidade_privada: "automotive",
  };

  if (!normalizedCode) return "services";
  if (map[normalizedCode]) return map[normalizedCode];

  if (normalizedCode.startsWith("pois_privados_alimentacao")) return "food";
  if (normalizedCode.includes("compras") || normalizedCode.includes("varejo")) return "shopping";
  if (normalizedCode.includes("saude")) return "health";
  if (normalizedCode.includes("automotivo") || normalizedCode.includes("mobilidade")) return "automotive";
  if (normalizedCode.includes("transport")) return "transport";
  if (normalizedCode.includes("servico_publico")) return "public_service";
  if (normalizedCode.includes("lugar_publico")) return "public_place";
  if (normalizedCode.includes("infraestrutura")) return "infrastructure";
  if (normalizedCode.includes("turismo")) return "tourism";
  if (normalizedCode.includes("educacao")) return "education";
  if (normalizedCode.includes("finance")) return "finance";

  return "services";
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

  return {
    id,
    type: placeType,
    title,
    subtitle:
      (record.subtitle as string | undefined) ??
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
        (record.phone as string | undefined) ??
        (record.telefone as string | undefined),
      website:
        (record.website as string | undefined) ??
        (record.url as string | undefined),
      email: (record.email as string | undefined) ?? undefined,
    },
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
