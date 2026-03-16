import { locativeService } from "@/services/locative.service";
import type { Place, PlaceContact } from "@/models/models";
import type { AdminEventListItemDTO, BackendPoiDTO, SearchInputDTO } from "@/types/locative-query";
import { mapDbClassificationToCategoryKey } from "@/lib/category-mapping";
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

function computeDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusMeters = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMeters * c;
}

function formatDateTimePtBr(value?: string | null): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatRecurrenceRulePtBr(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized) return undefined;

  return normalized
    .replaceAll("FREQ=WEEKLY", "Frequência: semanal")
    .replaceAll("FREQ=DAILY", "Frequência: diária")
    .replaceAll("FREQ=MONTHLY", "Frequência: mensal")
    .replaceAll("FREQ=YEARLY", "Frequência: anual")
    .replaceAll("INTERVAL=", "Intervalo: ")
    .replaceAll("UNTIL=", "Até: ");
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

function parseEventContactsFromOrganizer(organizer: Record<string, unknown> | null | undefined): PlaceContact[] {
  if (!organizer) return [];

  const contacts: PlaceContact[] = [];
  const email = toNonEmptyString(organizer.email ?? organizer.mail);
  const website = toNonEmptyString(organizer.website ?? organizer.site ?? organizer.url);
  const phone = toNonEmptyString(organizer.phone ?? organizer.telefone ?? organizer.whatsapp);

  if (email) contacts.push({ type: "email", value: email, label: "E-mail do organizador", isPrimary: false });
  if (website) contacts.push({ type: "website", value: website, label: "Site do evento", isPrimary: contacts.length === 0 });
  if (phone) contacts.push({ type: "phone", value: phone, label: "Telefone do organizador", isPrimary: contacts.length === 0 });

  return contacts;
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
    elementType === "public_service" || categoryCode === "public_service"
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
    categoryKey: mapDbClassificationToCategoryKey({
      categoryCode,
      elementType: elementType || undefined,
      poiMacroType:
        (record.poi_macro_type as string | undefined) ??
        (record.poiMacroType as string | undefined),
    }),
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

function mapAdminEventToPlace(item: AdminEventListItemDTO, index: number, lat: number, lng: number): Place {
  const eventLat = typeof item.latitude === "number" ? item.latitude : 0;
  const eventLng = typeof item.longitude === "number" ? item.longitude : 0;
  const eventDistanceMeters = computeDistanceMeters(lat, lng, eventLat, eventLng);

  const startsAt = formatDateTimePtBr(item.start_datetime);
  const endsAt = formatDateTimePtBr(item.end_datetime);
  const recurrenceText = formatRecurrenceRulePtBr(item.recurrence_rule);
  const organizer = item.organizer_json ?? null;
  const ticketing = item.ticketing_json ?? null;
  const contacts = parseEventContactsFromOrganizer(organizer);
  const ticketUrl = toNonEmptyString(
    (ticketing as Record<string, unknown> | null | undefined)?.url
  );

  const organizerItems =
    organizer && typeof organizer === "object"
      ? Object.entries(organizer)
          .map(([key, value]) => {
            const textValue =
              typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                ? String(value)
                : null;
            if (!textValue) return null;
            return `${key}: ${textValue}`;
          })
          .filter((entry): entry is string => Boolean(entry))
      : [];

  const ticketItems =
    ticketing && typeof ticketing === "object"
      ? Object.entries(ticketing)
          .map(([key, value]) => {
            const textValue =
              typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                ? String(value)
                : null;
            if (!textValue) return null;
            return `${key}: ${textValue}`;
          })
          .filter((entry): entry is string => Boolean(entry))
      : [];

  return {
    id: item.id ?? index + 1,
    type: "place",
    title: item.name ?? `Evento ${item.id ?? index + 1}`,
    subtitle: item.kind ?? "Eventos",
    categoryKey: "event",
    description: item.description ?? undefined,
    images: [item.image_url?.trim() ?? ""],
    distance: formatDistanceFromMeters(eventDistanceMeters),
    coordinates: {
      lat: eventLat,
      lng: eventLng,
    },
    address: item.address_street
      ? {
          street: item.address_street,
          number: item.address_number ?? "",
          neighborhood: item.address_neighborhood ?? "",
          city: item.address_city ?? "",
          state: item.address_state ?? "",
          zip: item.address_postal_code ?? undefined,
        }
      : undefined,
    contact: {
      website: ticketUrl,
      email: toNonEmptyString((organizer as Record<string, unknown> | null | undefined)?.email),
    },
    contacts,
    keywords: item.keywords ?? [],
    badges: [{ label: "Evento", variant: "secondary" }],
    quickActions: ticketUrl ? [{ type: "website", label: "Ingressos", value: ticketUrl }] : undefined,
    eventInfo: {
      startsAt,
      endsAt,
      recurrence: recurrenceText,
      capacity: typeof item.capacity === "number" ? item.capacity : undefined,
      organizerItems,
      ticketItems,
    },
  };
}

async function fetchFromApi(lat: number, lng: number): Promise<Place[]> {
  const [nearbyResponse, eventsResponse] = await Promise.all([
    locativeService.getNearElements(lat, lng, {
      raio_metros: 3000,
      limite: 100,
    }),
    locativeService.listAdminEvents().catch(() => [] as AdminEventListItemDTO[]),
  ]);

  const nearbyPlaces = nearbyResponse
    .map((item, index) => mapBackendPoiToPlace(item, index))
    .filter((place): place is Place => Boolean(place));

  const eventPlaces = eventsResponse.map((item, index) => mapAdminEventToPlace(item, index, lat, lng));
  const merged = [...nearbyPlaces, ...eventPlaces];
  const deduped = new Map<number, Place>();
  for (const place of merged) {
    deduped.set(place.id, place);
  }

  return Array.from(deduped.values());
}

class PlaceService {
  async getAll(lat: number, lng: number): Promise<Place[]> {
    return fetchFromApi(lat, lng);
  }

  async getById(id: number, lat: number, lng: number): Promise<Place | undefined> {
    let fromDetail: Place | null = null;
    try {
      const detail = await locativeService.getPoiDetail(id, {
        latitude: lat,
        longitude: lng,
      });
      fromDetail = mapBackendPoiToPlace(detail, 0, id);
    } catch {
      fromDetail = null;
    }

    if (!fromDetail) {
      try {
        const eventDetail = await locativeService.getAdminEvent(id);
        fromDetail = mapAdminEventToPlace(eventDetail, 0, lat, lng);
      } catch {
        fromDetail = null;
      }
    }

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
