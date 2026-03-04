import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PlaceCardVM } from "@/view-models/place-card.vm";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Navigation2,
  Phone,
  Globe,
  Clock,
} from "lucide-react";

export default function PlaceCard({
  image,
  title,
  category,
  rating = 0,
  reviews,
  distance,
  price,
  priceLevel,
  openNow,
  address,
  phone,
  website,
  onClick,
}: PlaceCardVM & { onClick?: () => void }) {
  const priceLevelLabel =
    typeof priceLevel === "number" && priceLevel > 0
      ? "$".repeat(priceLevel)
      : null;

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer py-0"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <CardContent className="flex-1 p-4 sm:p-6">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg">{title}</h3>

              <div className="flex gap-1">
                <Button size="icon" variant="ghost">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {category ?? "Sem categoria"}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{rating}</span>
                <span className="text-muted-foreground">
                  ({reviews ?? 0})
                </span>
              </div>

              <Separator orientation="vertical" className="h-4" />

              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{distance ?? "N/A"}</span>
              </div>

              {price && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground">{price}</span>
                </>
              )}

              {priceLevelLabel && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground font-semibold">
                    {priceLevelLabel}
                  </span>
                </>
              )}

              {openNow && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Aberto agora
                  </Badge>
                </>
              )}
            </div>

            {/* Address */}
            <p className="text-sm text-muted-foreground flex items-start gap-1">
              <MapPin className="w-4 h-4 mt-0.5" />
              {address ?? "Endereco indisponivel"}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm">
                <Navigation2 className="w-4 h-4 mr-1" />
                Rotas
              </Button>

              {phone && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href={`tel:${phone}`}>
                    <Phone className="w-4 h-4 mr-1" />
                    Ligar
                  </a>
                </Button>
              )}

              {website && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Site
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
