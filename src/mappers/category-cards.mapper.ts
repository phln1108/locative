import { getCategoryByKey } from "@/data/categories";
import type { Place } from "@/models/models";
import type { CategoryCardsPageVM } from "@/view-models/category-cards-page.vm";
import type { PlaceCardVM } from "@/view-models/place-card.vm";

function mapPlaceToCardVM(place: Place): PlaceCardVM {
  const categoryLabel = getCategoryByKey(place.categoryKey)?.label ?? "Sem categoria";
  const address = place.address
    ? `${place.address.street}, ${place.address.number} - ${place.address.neighborhood}`
    : "Endereco indisponivel";

  return {
    id: place.id,
    title: place.title,
    image: place.images[0] ?? "",
    category: place.subtitle ?? categoryLabel,
    rating: place.rating ?? 0,
    reviews: place.reviews ?? 0,
    distance: place.distance ?? "N/A",
    price: place.type === "tour" && place.price ? `R$ ${place.price}` : undefined,
    priceLevel: place.priceLevel,
    openNow: place.openingHours?.openNow,
    address,
    phone: place.contact?.phone,
    website: place.contact?.website,
    sponsored: false,
    verified: (place.reviews ?? 0) > 100,
    type: place.type,
  };
}

export function mapCategoryToCategoryCardsPageVM(
  places: Place[],
  categoryKey: string
): CategoryCardsPageVM {
  const category = getCategoryByKey(categoryKey);

  const filteredPlaces = places.filter(
    (place) => place.categoryKey === categoryKey && place.type !== "tour"
  );

  const cards = filteredPlaces.map(mapPlaceToCardVM);
  const categoryTitle = category?.label ?? categoryKey;

  return {
    categoryKey,
    header: {
      title: categoryTitle,
      description: "Servicos e lugares nesta categoria",
      actionLabel: "Ver Todas as Categorias",
    },
    nearby: {
      title: "Servicos Proximos",
      subtitle: `${cards.length} lugares encontrados perto de voce`,
      total: cards.length,
    },
    places: cards,
  };
}
