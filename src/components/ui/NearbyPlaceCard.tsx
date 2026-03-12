import { MapPin } from "lucide-react";
import CategoryImage from "./category-image";

interface NearbyPlaceCardProps {
  image: string;
  title: string;
  distance: string;
  priceLevel?: 0 | 1 | 2 | 3 | 4;
  categoryEmoji?: string;
  categoryName?: string;
  categoryColor?: string;
  onClick?: () => void;
}

export default function NearbyPlaceCard({
  image,
  title,
  distance,
  priceLevel,
  categoryEmoji,
  categoryName,
  categoryColor,
  onClick,
}: NearbyPlaceCardProps) {
  const getBadgeBackgroundColor = (color?: string) => {
    if (!color) return "rgb(255,248,240)";

    const rgbaMatch = color.match(
      /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
    );

    if (!rgbaMatch) return color;

    const r = Number(rgbaMatch[1]);
    const g = Number(rgbaMatch[2]);
    const b = Number(rgbaMatch[3]);
    const whitenFactor = 0.45;
    const toCream = (channel: number) =>
      Math.round(channel * (1 - whitenFactor) + 255 * whitenFactor);

    return `rgb(${toCream(r)}, ${toCream(g)}, ${toCream(b)})`;
  };

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
      <div className="relative w-24 h-20 shrink-0">
        <CategoryImage
          src={image}
          alt={title}
          className="w-24 h-20 object-cover shrink-0"
          fallbackClassName="w-24 h-20 shrink-0"
          categoryEmoji={categoryEmoji}
          categoryColor={categoryColor}
        />
        {categoryEmoji && (
          <span
            title={categoryName ?? "Categoria"}
            style={{ backgroundColor: getBadgeBackgroundColor(categoryColor) }}
            className="absolute top-1 left-1 inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-xs shadow-sm"
          >
            {categoryEmoji}
          </span>
        )}
      </div>

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
