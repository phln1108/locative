import type { LocativeUnion } from "@/domain/models/locative-union";
import type { Place } from "@/models/models";
import { getUiCategoryByCode } from "./ui-category-registry";
import { mockedElements } from "./mocked-elements";

function getPrimaryCategoryCode(element: LocativeUnion): string | undefined {
  return (
    element.categories?.find((category) => category.is_primary)?.code ??
    element.categories?.[0]?.code
  );
}

function getSecondaryCategoryCode(element: LocativeUnion): string | undefined {
  return element.categories?.find((category) => !category.is_primary)?.code;
}

function mapCategoryCodeToCategoryKey(code?: string): string {
  const map: Record<string, string> = {
    public_place: "culture",
    infrastructure: "services",
    public_service: "health",
    situated_event: "tourism",
    symbolic_heritage: "culture",
    commercial_poi: "services",
    public_transport: "transport",
    natural_element: "nature",
    mobile_element: "services",
    religious_spiritual: "culture",
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
    social_assistance: "services",
    security: "services",
    citizen_service: "services",
    shelter: "services",
    other: "services",
  };

  if (!code) return "services";
  return map[code] ?? "services";
}

function mapElementTypeToPlaceType(
  elementType: LocativeUnion["element_type"]
): Place["type"] {
  if (elementType === "situated_event") return "tour";
  if (elementType === "public_service") return "service";
  return "place";
}

function resolveUiCategoryCode(element: LocativeUnion): string | undefined {
  const primaryCode = getPrimaryCategoryCode(element);
  const secondaryCode = getSecondaryCategoryCode(element);

  if (element.element_type === "commercial_poi") {
    return element.poi_macro_type ?? secondaryCode ?? primaryCode;
  }

  if (element.element_type === "situated_event") {
    return secondaryCode ?? primaryCode;
  }

  return primaryCode ?? secondaryCode;
}

function resolveCategoryKeyCode(element: LocativeUnion): string | undefined {
  if (element.element_type === "public_service") {
    return element.public_service_domain;
  }

  return resolveUiCategoryCode(element);
}

function mapElementToBasePlace(element: LocativeUnion): Place {
  const uiCategoryCode = resolveUiCategoryCode(element);
  const uiCategory = getUiCategoryByCode(uiCategoryCode);
  const categoryKeyCode = resolveCategoryKeyCode(element);

  const image =
    element.media?.find((asset) => asset.type === "image")?.url ??
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e";

  const coordinates =
    element.geometry?.type === "Point"
      ? {
          lng: element.geometry.coordinates[0],
          lat: element.geometry.coordinates[1],
        }
      : undefined;

  const rating = "rating" in element ? element.rating?.value : undefined;
  const reviews = "rating" in element ? element.rating?.count : undefined;

  return {
    id: Number(element.element_id),
    type: mapElementTypeToPlaceType(element.element_type),
    title: element.name,
    subtitle: uiCategory?.label,
    categoryKey: mapCategoryCodeToCategoryKey(categoryKeyCode),
    description: element.description,
    images: [image],
    rating,
    reviews,
    coordinates,
    address: element.address
      ? {
          street: element.address.street ?? "",
          number: element.address.number ?? "",
          neighborhood: element.address.neighborhood ?? "",
          city: element.address.city ?? "",
          state: element.address.state ?? "",
          zip: element.address.zip,
        }
      : undefined,
  };
}

const mockOverrides: Record<number, Partial<Place>> = {
  1: {
    subtitle: "Restaurante Italiano",
    distance: "0.5 km",
    contact: {
      phone: "85999998888",
      website: "https://trattoriabella.com.br",
      email: "contato@trattoriabella.com.br",
    },
    openingHours: {
      openNow: true,
      schedule: [{ day: "Todos os dias", open: "11:30", close: "23:00" }],
    },
    quickActions: [
      { type: "call", label: "Ligar", value: "85999998888" },
      { type: "website", label: "Site" },
      { type: "map", label: "Rota" },
      { type: "share", label: "Compartilhar" },
    ],
  },
  2: { subtitle: "Cafeteria Especial", distance: "0.2 km" },
  3: { subtitle: "Academia Completa", distance: "0.8 km" },
  4: { subtitle: "Galeria de Arte Contemporanea", distance: "1.4 km" },
  5: { subtitle: "Loja de Eletronicos", distance: "0.7 km" },
  6: { subtitle: "Livraria e Educacao", distance: "1.1 km" },
  7: { subtitle: "Clinica Veterinaria", distance: "2.3 km" },
  8: { subtitle: "Loja de Roupas", distance: "0.9 km" },
  9: { subtitle: "Bar Artesanal", distance: "1.8 km" },
  10: { subtitle: "Farmacia", distance: "0.4 km", rating: 4.3, reviews: 76 },
  11: {
    type: "tour",
    subtitle: "Aventura nas Dunas",
    distance: "12 km",
    rating: 4.9,
    reviews: 156,
    price: 120,
    duration: "6 horas",
  },
  12: {
    type: "tour",
    subtitle: "Tour Cultural",
    distance: "5 km",
    rating: 4.6,
    reviews: 189,
    price: 55,
    duration: "3 horas",
  },
  13: {
    type: "tour",
    subtitle: "Experiencia Gastronomica",
    distance: "3 km",
    rating: 4.8,
    reviews: 274,
    price: 95,
    duration: "4 horas",
  },
  14: {
    subtitle: "Praias Urbanas",
    distance: "8 km",
    rating: 4.7,
    reviews: 342,
  },
};

export function mapElementToPlace(element: LocativeUnion): Place {
  const base = mapElementToBasePlace(element);
  const override = mockOverrides[base.id] ?? {};
  return { ...base, ...override };
}

export const mockedPlacesFromDomain: Place[] = mockedElements.map(mapElementToPlace);

export const mockedNearElements = mockedElements
  .filter((element) => element.element_type !== "situated_event")
  .map((element) => ({
    id: element.element_id,
    title: element.name,
    image:
      element.media?.find((asset) => asset.type === "image")?.url ??
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    rating: "rating" in element ? element.rating?.value ?? 0 : 0,
  }));
