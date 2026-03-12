import { ArrowLeft, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import NearbyCard from "@/components/ui/nearby-card";
import { TourCard } from "@/components/ui/tour-card";
import { placeService } from "@/services/place-service";
import type { Place } from "@/models/models";
import { getCategoryByKey } from "@/data/categories";
import { useAuth } from "@/providers/auth-provider";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Place[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const response = await placeService.listFavorites();
        if (!cancelled) {
          setFavorites(response);
        }
      } catch {
        if (!cancelled) {
          setFavorites([]);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="w-full">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6">
          <div className="rounded-xl border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold">Entre para ver seus favoritos</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Esta funcionalidade esta disponivel apenas para usuarios autenticados.
            </p>
            <Button className="mt-4" onClick={() => navigate("/login")}>
              Fazer login
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const favoritePlaces = useMemo(
    () => favorites.filter((item) => item.type !== "tour"),
    [favorites]
  );
  const favoriteTours = useMemo(
    () => favorites.filter((item) => item.type === "tour"),
    [favorites]
  );

  const totalFavorites = favoritePlaces.length + favoriteTours.length;

  return (
    <main className="w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-8">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-left text-xl font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Meus Favoritos
            </h1>
            <p className="text-sm text-muted-foreground">{totalFavorites} itens salvos</p>
          </div>
        </div>

        {totalFavorites === 0 && (
          <div className="rounded-xl border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold">Nenhum favorito ainda</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Explore lugares e toque no coracao para salvar seus favoritos.
            </p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Explorar agora
            </Button>
          </div>
        )}

        {favoritePlaces.length > 0 && (
          <section className="space-y-4">
            <SectionHeader
              title="Lugares Favoritos"
              description="Seus estabelecimentos e servicos salvos"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritePlaces.map((place) => (
                <NearbyCard
                  key={place.id}
                  image={place.images[0]}
                  title={place.title}
                  subtitle={place.subtitle ?? getCategoryByKey(place.categoryKey)?.label ?? ""}
                  categoryEmoji={getCategoryByKey(place.categoryKey)?.emoji}
                  categoryName={getCategoryByKey(place.categoryKey)?.label}
                  categoryColor={getCategoryByKey(place.categoryKey)?.color}
                  distance={place.distance ?? ""}
                  rating={place.rating ?? 0}
                  priceLevel={place.priceLevel}
                  variant="grid"
                  onClick={() => navigate(`/bio/${place.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {favoriteTours.length > 0 && (
          <section className="space-y-4">
            <SectionHeader title="Tours Favoritos" description="Experiencias que você quer fazer" />

            <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
              {favoriteTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  image={tour.images[0]}
                  title={tour.title}
                  price={tour.price ?? 0}
                  rating={tour.rating ?? 0}
                  reviews={tour.reviews ?? 0}
                  priceLevel={tour.priceLevel}
                  duration={tour.duration ?? ""}
                  highlight={
                    tour.badges?.some((badge) => badge.label === "Mais vendido") ?? false
                  }
                  onClick={() => navigate(`/bio/${tour.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
