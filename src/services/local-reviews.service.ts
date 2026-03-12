import type { ReviewDetailed } from "@/models/models";
import { http } from "@/api/http-client";
import { AxiosError } from "axios";

const STORAGE_KEY = "locative:user-reviews:v1";
const CURRENT_USER = "você";
const REVIEWS_LIST_MINE_PATHS = (
  import.meta.env.VITE_REVIEWS_LIST_MINE_PATHS as string | undefined
)
  ?.split(",")
  .map((item) => item.trim())
  .filter(Boolean) ?? [];
const REVIEWS_LIST_BY_POI_PATHS = (
  import.meta.env.VITE_REVIEWS_LIST_BY_POI_PATHS as string | undefined
)
  ?.split(",")
  .map((item) => item.trim())
  .filter(Boolean) ?? [];
const REVIEWS_UPSERT_PATH = (import.meta.env.VITE_REVIEWS_UPSERT_PATH as string | undefined)?.trim();
const REVIEWS_UPSERT_METHOD = (
  import.meta.env.VITE_REVIEWS_UPSERT_METHOD as string | undefined
)?.toUpperCase() as "POST" | "PUT" | undefined;

export interface UserReview extends ReviewDetailed {
  placeId: number;
  updatedAt: string;
}

type ReviewUpsertPayload = {
  rating: number;
  comment: string;
};

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function toText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readStorage(): UserReview[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as UserReview[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeStorage(reviews: UserReview[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function normalizeList(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const keys = ["items", "results", "data", "avaliacoes", "reviews"];
    for (const key of keys) {
      const value = record[key];
      if (Array.isArray(value)) {
        return value.filter(
          (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object"
        );
      }
    }
  }

  return [];
}

function mapReviewRecord(
  record: Record<string, unknown>,
  fallbackPlaceId?: number,
  forceCurrentUser = false
): UserReview | null {
  const id =
    toNumber(record.id) ??
    toNumber(record.review_id) ??
    toNumber(record.avaliacao_id) ??
    Date.now();

  const placeId =
    toNumber(record.poi_id) ??
    toNumber(record.id_poi) ??
    toNumber(record.place_id) ??
    fallbackPlaceId;

  if (!placeId) return null;

  const rating =
    toNumber(record.rating) ??
    toNumber(record.nota) ??
    toNumber(record.avaliacao) ??
    0;

  const comment =
    toText(record.comment) ??
    toText(record.comentario) ??
    toText(record.comentario_texto) ??
    toText(record.texto) ??
    "";

  const date =
    toText(record.date) ??
    toText(record.data) ??
    toText(record.created_at) ??
    toText(record.updated_at) ??
    new Date().toISOString().slice(0, 10);

  const user =
    forceCurrentUser
      ? CURRENT_USER
      : toText(record.user) ??
        toText(record.usuario) ??
        toText(record.usuario_nome) ??
        toText(record.autor) ??
        "Usuario";

  const updatedAt =
    toText(record.updated_at) ??
    toText(record.created_at) ??
    `${date}T00:00:00.000Z`;

  return {
    id,
    placeId,
    user,
    rating,
    comment,
    date,
    updatedAt,
  };
}

async function requestWithFallback<T>(
  requests: Array<() => Promise<T>>
): Promise<T> {
  let lastError: unknown;

  for (const request of requests) {
    try {
      return await request();
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      if (status === 404 || status === 405) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Nenhuma rota de avaliacao respondeu.");
}

export const localReviewsService = {
  async listMine(): Promise<UserReview[]> {
    try {
      if (REVIEWS_LIST_MINE_PATHS.length === 0) {
        throw new Error("Rotas de avaliacao nao configuradas.");
      }

      const data = await requestWithFallback<unknown>(
        REVIEWS_LIST_MINE_PATHS.map(
          (path) => () => http.get(path).then((response) => response.data)
        )
      );

      const parsed = normalizeList(data)
        .map((item) => mapReviewRecord(item, undefined, true))
        .filter((item): item is UserReview => Boolean(item))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

      if (parsed.length > 0) {
        const storage = readStorage().filter((item) => item.user !== CURRENT_USER);
        writeStorage([...parsed, ...storage]);
        return parsed;
      }
    } catch {
      // Fallback local below.
    }

    return readStorage()
      .filter((review) => review.user === CURRENT_USER)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async listByPlace(placeId: number): Promise<UserReview[]> {
    try {
      if (REVIEWS_LIST_BY_POI_PATHS.length === 0) {
        throw new Error("Rotas de avaliacao nao configuradas.");
      }

      const data = await requestWithFallback<unknown>(
        REVIEWS_LIST_BY_POI_PATHS.map(
          (path) => () => http.get(path, { params: { poi_id: placeId } }).then((response) => response.data)
        )
      );

      const parsed = normalizeList(data)
        .map((item) => mapReviewRecord(item, placeId))
        .filter((item): item is UserReview => Boolean(item))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

      if (parsed.length > 0) {
        const storage = readStorage().filter((item) => item.placeId !== placeId);
        writeStorage([...parsed, ...storage]);
        return parsed;
      }
    } catch {
      // Fallback local below.
    }

    return readStorage().filter((review) => review.placeId === placeId);
  },

  async getMyReviewByPlace(placeId: number): Promise<UserReview | undefined> {
    const mine = await this.listMine();
    return mine.find((review) => review.placeId === placeId);
  },

  async upsertMyReview(placeId: number, payload: ReviewUpsertPayload) {
    const requestPayload = {
      poi_id: placeId,
      nota: payload.rating,
      comentario: payload.comment,
    };

    try {
      if (!REVIEWS_UPSERT_PATH || !REVIEWS_UPSERT_METHOD) {
        throw new Error("Rota de avaliacao nao configurada.");
      }

      if (REVIEWS_UPSERT_METHOD === "PUT") {
        await http.put(REVIEWS_UPSERT_PATH, requestPayload);
      } else {
        await http.post(REVIEWS_UPSERT_PATH, requestPayload);
      }
    } catch {
      // Mantem fallback local quando backend ainda nao tem rota final.
    }

    const allReviews = readStorage();
    const now = new Date().toISOString();
    const date = now.slice(0, 10);

    const existing = allReviews.find(
      (review) => review.placeId === placeId && review.user === CURRENT_USER
    );

    if (existing) {
      existing.rating = payload.rating;
      existing.comment = payload.comment;
      existing.date = date;
      existing.updatedAt = now;
    } else {
      allReviews.unshift({
        id: Date.now(),
        placeId,
        user: CURRENT_USER,
        rating: payload.rating,
        comment: payload.comment,
        date,
        updatedAt: now,
      });
    }

    writeStorage(allReviews);
  },
};
