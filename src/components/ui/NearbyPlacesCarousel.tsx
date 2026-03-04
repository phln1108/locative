import NearbyPlaceCard from "./NearbyPlaceCard";

interface NearbyPlace {
  id: number;
  image: string;
  title: string;
  distance: string;
  priceLevel?: 0 | 1 | 2 | 3 | 4;
}

interface NearbyPlacesCarouselProps {
  places: NearbyPlace[];
  onSelect?: (id: number) => void;
}

export default function NearbyPlacesCarousel({
  places,
  onSelect,
}: NearbyPlacesCarouselProps) {
  if (!places.length) return null;

  return (
    <div className="px-4 pointer-events-auto">
      <h3 className="text-sm font-semibold mb-2 text-foreground">
        Lugares próximos
      </h3>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {places.map((place) => (
            <NearbyPlaceCard
              key={place.id}
              image={place.image}
              title={place.title}
              distance={place.distance}
              priceLevel={place.priceLevel}
              onClick={() => onSelect?.(place.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
