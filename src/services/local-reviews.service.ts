import type { ReviewDetailed } from "@/models/models";

const STORAGE_KEY = "locative:user-reviews:v1";
const CURRENT_USER = "Voce";

export interface UserReview extends ReviewDetailed {
  placeId: number;
  updatedAt: string;
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

export const localReviewsService = {
  listMine(): UserReview[] {
    return readStorage()
      .filter((review) => review.user === CURRENT_USER)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  listByPlace(placeId: number): UserReview[] {
    return readStorage().filter((review) => review.placeId === placeId);
  },

  getMyReviewByPlace(placeId: number): UserReview | undefined {
    return readStorage().find(
      (review) => review.placeId === placeId && review.user === CURRENT_USER
    );
  },

  upsertMyReview(placeId: number, payload: { rating: number; comment: string }) {
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
      const newReview: UserReview = {
        id: Date.now(),
        placeId,
        user: CURRENT_USER,
        rating: payload.rating,
        comment: payload.comment,
        date,
        updatedAt: now,
      };
      allReviews.unshift(newReview);
    }

    writeStorage(allReviews);
  },
};
