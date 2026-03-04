import { MapPin } from "lucide-react";

interface NearbyPlaceCardProps {
  image: string;
  title: string;
  distance: string;
  priceLevel?: 0 | 1 | 2 | 3 | 4;
  onClick?: () => void;
}

export default function NearbyPlaceCard({
  image,
  title,
  distance,
  priceLevel,
  onClick,
}: NearbyPlaceCardProps) {
  const priceLevelLabel =
    typeof priceLevel === "number" && priceLevel > 0
      ? "$".repeat(priceLevel)
      : null;

  return (
    <button
      onClick={onClick}
      className="
        shrink-0
        w-64
        bg-card
        rounded-lg
        shadow-lg
        overflow-hidden
        hover:shadow-xl
        transition-shadow
        cursor-pointer
        flex
      "
    >
      <img
        src={image}
        alt={title}
        className="w-24 h-20 object-cover shrink-0"
      />

      <div className="p-2 flex-1 flex flex-col justify-center">
        <h4 className="font-medium text-sm truncate text-left text-foreground">
          {title}
        </h4>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <MapPin className="w-3 h-3" />
          <span>{distance}</span>
          {priceLevelLabel && <span className="font-semibold">{priceLevelLabel}</span>}
        </div>
      </div>
    </button>
  );
}
