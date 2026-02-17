import { Navigation, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Card } from "./card";

interface NearbyCardProps {
  image: string;
  title: string;
  subtitle: string;
  distance: string;
  rating: number;
  variant?: "carousel" | "grid";
}

export default function NearbyCard({
  image,
  title,
  subtitle,
  distance,
  rating,
  variant = "carousel",
}: NearbyCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-[1.02] p-0",
        variant === "grid"
          ? "w-full"
          : "shrink-0 w-70 snap-start"
      )}
    >
      {/* Imagem */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

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
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">
              {rating}
            </span>
          </div>

          <span className="text-xs text-primary font-medium group-hover:underline">
            Ver detalhes →
          </span>
        </div>
      </div>
    </Card>
  );
}
