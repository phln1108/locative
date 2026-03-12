import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PlaceCardVM } from "@/view-models/place-card.vm";
import CategoryImage from "@/components/ui/category-image";
import { useAuth } from "@/providers/auth-provider";
import { useFavorites } from "@/providers/favorites-provider";
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
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PlaceCard({
  id,
  image,
  title,
  category,
  categoryEmoji,
  categoryColor,
  rating = 0,
  reviews,
  distance,
  price,
  priceLevel,
  openNow,
  address,
  phone,
  website,
  lat,
  lng,
  onClick,
}: PlaceCardVM & { onClick?: () => void }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);

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
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer py-0"
        onClick={onClick}
      >
        <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto">
          <CategoryImage
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            fallbackClassName="w-full h-full"
            categoryEmoji={categoryEmoji}
            categoryColor={categoryColor}
          />
          {categoryEmoji && (
            <span
              title={category ?? "Categoria"}
              style={{ backgroundColor: getBadgeBackgroundColor(categoryColor) }}
              className="absolute top-2 left-2 inline-flex items-center justify-center rounded-md px-2 py-1 text-sm shadow-sm"
            >
              {categoryEmoji}
            </span>
          )}
        </div>

        <CardContent className="flex-1 p-4 sm:p-6">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg">{title}</h3>

              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={favoritesLoading}
                  onClick={async (event) => {
                    event.stopPropagation();
                    if (!isAuthenticated) {
                      setIsLoginRequiredModalOpen(true);
                      return;
                    }
                    if (typeof id !== "number") return;
                    await toggleFavorite(id);
                  }}
                >
                  <Heart
                    className={
                      typeof id === "number" && isFavorite(id)
                        ? "w-4 h-4 fill-rose-500 text-rose-500"
                        : "w-4 h-4"
                    }
                  />
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
              {address ?? "Endereço indisponivel"}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  if (typeof lat === "number" && typeof lng === "number") {
                    const params = new URLSearchParams({
                      destLat: String(lat),
                      destLng: String(lng),
                      destId: String(id),
                    });
                    navigate(`/map?${params.toString()}`);
                    return;
                  }
                  navigate("/map");
                }}
              >
                <Navigation2 className="w-4 h-4 mr-1" />
                Rotas
              </Button>

              {phone && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${phone}`}>
                    <Phone className="w-4 h-4 mr-1" />
                    Ligar
                  </a>
                </Button>
              )}

              {website && (
                <Button size="sm" variant="outline" asChild>
                  <a href={website} target="_blank" rel="noopener noreferrer">
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

      {isLoginRequiredModalOpen && (
        <div className="fixed inset-0 z-1300 flex items-end sm:items-center justify-center bg-black/45 p-4">
          <Card className="w-full max-w-md p-4 space-y-4" onClick={(event) => event.stopPropagation()}>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Login necessario</h3>
              <p className="text-sm text-muted-foreground">
                Você precisa estar logado para favoritar estabelecimentos. Deseja ir para a tela de login?
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsLoginRequiredModalOpen(false)}>
                Agora nao
              </Button>
              <Button
                onClick={() => {
                  setIsLoginRequiredModalOpen(false);
                  navigate("/login");
                }}
              >
                Fazer login
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
