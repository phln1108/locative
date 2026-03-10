import { getCategoryByKey } from "./categories";
import { mockedPlacesFromDomain } from "./mapper";

export const mockedPlaces = mockedPlacesFromDomain;

function inferPriceLevelFromPrice(price?: number): 0 | 1 | 2 | 3 | 4 | undefined {
  if (typeof price !== "number") return undefined;
  if (price <= 40) return 1;
  if (price <= 90) return 2;
  if (price <= 180) return 3;
  return 4;
}

export const mockedNearPlaces = mockedPlaces
  .filter((place) => place.type !== "tour")
  .map((place) => {
    const category = getCategoryByKey(place.categoryKey);
    return {
      id: place.id,
      image: place.images[0],
      title: place.title,
      subtitle: place.subtitle ?? category?.label ?? "",
      categoryEmoji: category?.emoji,
      categoryName: category?.label,
      categoryColor: category?.color,
      distance: place.distance ?? "",
      rating: place.rating ?? 0,
      priceLevel: place.priceLevel,
    };
  });

export const mockedTours = mockedPlaces
  .filter((place) => place.type === "tour")
  .map((tour) => ({
    id: tour.id,
    image: tour.images[0],
    title: tour.title,
    price: tour.price ?? 0,
    rating: tour.rating ?? 0,
    reviews: tour.reviews ?? 0,
    priceLevel: tour.priceLevel ?? inferPriceLevelFromPrice(tour.price),
    duration: tour.duration ?? "",
    highlight:
      tour.badges?.some((badge) => badge.label === "Mais vendido") ?? false,
  }));

export const mockedFavoriteIds: number[] = [1, 3, 5, 11, 14];

export const mockedFavoritePlaces = mockedPlaces
  .filter((place) => mockedFavoriteIds.includes(place.id) && place.type !== "tour")
  .map((place) => {
    const category = getCategoryByKey(place.categoryKey);
    return {
      id: place.id,
      image: place.images[0],
      title: place.title,
      subtitle: place.subtitle ?? category?.label ?? "",
      categoryEmoji: category?.emoji,
      categoryName: category?.label,
      categoryColor: category?.color,
      distance: place.distance ?? "",
      rating: place.rating ?? 0,
      priceLevel: place.priceLevel,
    };
  });

export const mockedFavoriteTours = mockedPlaces
  .filter((place) => mockedFavoriteIds.includes(place.id) && place.type === "tour")
  .map((tour) => ({
    id: tour.id,
    image: tour.images[0],
    title: tour.title,
    price: tour.price ?? 0,
    rating: tour.rating ?? 0,
    reviews: tour.reviews ?? 0,
    priceLevel: tour.priceLevel ?? inferPriceLevelFromPrice(tour.price),
    duration: tour.duration ?? "",
    highlight:
      tour.badges?.some((badge) => badge.label === "Mais vendido") ?? false,
  }));
