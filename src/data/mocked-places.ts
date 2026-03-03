import { getCategoryByKey } from "./categories";
import { mockedPlacesFromDomain } from "./mapper";

export const mockedPlaces = mockedPlacesFromDomain;

export const mockedNearPlaces = mockedPlaces
  .filter((place) => place.type !== "tour")
  .map((place) => ({
    id: place.id,
    image: place.images[0],
    title: place.title,
    subtitle: place.subtitle ?? getCategoryByKey(place.categoryKey)?.label ?? "",
    distance: place.distance ?? "",
    rating: place.rating ?? 0,
  }));

export const mockedTours = mockedPlaces
  .filter((place) => place.type === "tour")
  .map((tour) => ({
    id: tour.id,
    image: tour.images[0],
    title: tour.title,
    price: tour.price ?? 0,
    rating: tour.rating ?? 0,
    reviews: tour.reviews ?? 0,
    duration: tour.duration ?? "",
    highlight:
      tour.badges?.some((badge) => badge.label === "Mais vendido") ?? false,
  }));

export const mockedFavoriteIds: number[] = [1, 3, 5, 11, 14];

export const mockedFavoritePlaces = mockedPlaces
  .filter((place) => mockedFavoriteIds.includes(place.id) && place.type !== "tour")
  .map((place) => ({
    id: place.id,
    image: place.images[0],
    title: place.title,
    subtitle: place.subtitle ?? getCategoryByKey(place.categoryKey)?.label ?? "",
    distance: place.distance ?? "",
    rating: place.rating ?? 0,
  }));

export const mockedFavoriteTours = mockedPlaces
  .filter((place) => mockedFavoriteIds.includes(place.id) && place.type === "tour")
  .map((tour) => ({
    id: tour.id,
    image: tour.images[0],
    title: tour.title,
    price: tour.price ?? 0,
    rating: tour.rating ?? 0,
    reviews: tour.reviews ?? 0,
    duration: tour.duration ?? "",
    highlight:
      tour.badges?.some((badge) => badge.label === "Mais vendido") ?? false,
  }));
