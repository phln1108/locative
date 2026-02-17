import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TourPlace } from "@/models/models";

interface TourCardProps extends TourPlace {

};

export function TourCard({
  image,
  title,
  price,
  rating,
  reviews,
  duration,
  highlight,
}: TourCardProps) {
  return (
    <div className="w-45 shrink-0 cursor-pointer transition-all duration-200 active:scale-[0.96] hover:shadow-md">
      {/* Image */}
      <div className="relative h-30 overflow-hidden rounded-3xl shadow-sm border-[3px] border-white">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        {highlight && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
            Destaque
          </Badge>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

        <span className="absolute bottom-2 right-2 text-white text-sm font-semibold drop-shadow-lg">
          R$ {price}
        </span>
      </div>

      {/* Info */}
      <div className="pt-2 space-y-1">
        <h3 className="text-sm font-semibold leading-[1.3]">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-xs">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">
            ({reviews})
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}
