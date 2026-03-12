import { Navigation, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Card } from "./card";
import CategoryImage from "./category-image";

interface NearbyCardProps {
  image: string;
  title: string;
  subtitle: string;
  categoryEmoji?: string;
  categoryName?: string;
  categoryColor?: string;
  distance: string;
  rating: number;
  priceLevel?: 0 | 1 | 2 | 3 | 4;
  variant?: "carousel" | "grid";
  onClick?: () => void;
}

export default function NearbyCard({
  image,
  title,
  subtitle,
  categoryEmoji,
  categoryName,
  categoryColor,
  distance,
  rating,
  priceLevel,
  variant = "carousel",
  onClick,
}: NearbyCardProps) {
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
    <Card
      onClick={onClick}
      className={cn(
        "overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-[1.02] p-0",
        variant === "grid"
          ? "w-full"
          : "shrink-0 w-70 snap-start"
      )}
    >
      {/* Imagem */}
      <div className="relative h-36 overflow-hidden">
        <CategoryImage
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          fallbackClassName="w-full h-full"
          categoryEmoji={categoryEmoji}
          categoryColor={categoryColor}
        />

        {categoryEmoji && (
          <span
            title={categoryName ?? subtitle}
            style={{ backgroundColor: getBadgeBackgroundColor(categoryColor) }}
            className="absolute top-3 left-3 inline-flex items-center justify-center rounded-md px-2 py-1 text-sm shadow-sm"
          >
            {categoryEmoji}
          </span>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-success to-success/70 opacity-20 group-hover:opacity-30 transition-opacity" />

        <Badge className="absolute top-3 right-3 bg-background/95 text-foreground border-0">
          <Navigation className="w-3 h-3 mr-1" />
          {distance}
        </Badge>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-2">
        <div>
          <h4 className="font-semibold line-clamp-1">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">
              {rating}
            </span>
            {priceLevelLabel && (
              <span className="text-xs text-muted-foreground font-semibold">
                {priceLevelLabel}
              </span>
            )}
          </div>

          <span className="text-xs text-primary font-medium group-hover:underline">
            Ver detalhes →
          </span>
        </div>
      </div>
    </Card>
  );
}
