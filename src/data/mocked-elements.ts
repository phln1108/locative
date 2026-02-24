import type { LocativeUnion } from "@/models/locative-union";

export const mockedElements: LocativeUnion[] = [

  {
    element_id: "1",
    element_type: "commercial_poi",
    name: "Trattoria Bella",
    description: "Restaurante italiano tradicional.",
    geometry: { type: "Point", coordinates: [-38.4819, -3.7685] },
    status: "active",

    media: [
      {
        media_id: "1-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1722587561829-8a53e1935e20",
        caption: "Ambiente interno",
        visibility: "public",
      },
      {
        media_id: "1-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        caption: "Prato principal",
        visibility: "public",
      },
    ],

    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "food_beverage", is_primary: false },
    ],

    poi_macro_type: "food_beverage",
    rating: { value: 4.8, count: 214 },
  },

  {
    element_id: "2",
    element_type: "commercial_poi",
    name: "Blue Bottle Coffee",
    geometry: { type: "Point", coordinates: [-38.4814, -3.7696] },
    status: "active",

    media: [
      {
        media_id: "2-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1750243711894-869aeea522ea",
        visibility: "public",
      },
    ],

    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "food_beverage", is_primary: false },
    ],

    poi_macro_type: "food_beverage",
    rating: { value: 4.7, count: 182 },
  },

  {
    element_id: "3",
    element_type: "commercial_poi",
    name: "FitLife Gym",
    geometry: { type: "Point", coordinates: [-38.483, -3.7702] },
    status: "active",

    media: [
      {
        media_id: "3-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1658211342695-9fb9c8611aee",
        visibility: "public",
      },
    ],

    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "personal_services", is_primary: false },
    ],

    poi_macro_type: "personal_services",
    rating: { value: 4.6, count: 126 },
  },

  {
    element_id: "4",
    element_type: "commercial_poi",
    name: "Modern Art Gallery",
    geometry: { type: "Point", coordinates: [-38.4834, -3.7678] },
    status: "active",

    media: [
      {
        media_id: "4-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1606819717115-9159c900370b",
        visibility: "public",
      },
    ],

    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "entertainment", is_primary: false },
    ],

    poi_macro_type: "entertainment",
    rating: { value: 4.9, count: 204 },
  },

  {
    element_id: "5",
    element_type: "commercial_poi",
    name: "Tech Store Premium",
    geometry: { type: "Point", coordinates: [-38.4808, -3.7699] },
    status: "active",

    media: [
      {
        media_id: "5-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1749566679636-a9b0f4c52e08",
        visibility: "public",
      },
    ],

    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "retail", is_primary: false },
    ],

    poi_macro_type: "retail",
    rating: { value: 4.5, count: 320 },
  },

  {
    element_id: "6",
    element_type: "commercial_poi",
    name: "Indie Bookshop",
    geometry: { type: "Point", coordinates: [-38.4825, -3.7708] },
    status: "active",

    media: [
      {
        media_id: "6-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
        visibility: "public",
      },
    ],

    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "retail", is_primary: false },
    ],

    poi_macro_type: "retail",
    rating: { value: 4.8, count: 140 },
  },

  {
    element_id: "14",
    element_type: "natural_element",
    name: "Praias Urbanas",
    geometry: { type: "Point", coordinates: [-38.4802, -3.7679] },
    natural_kind: "beach",
    status: "active",

    media: [
      {
        media_id: "14-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1664128901953-962539306582",
        visibility: "public",
      },
    ],
  },
];