import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import NearbyCard from "@/components/ui/nearby-card";
import { TourCard } from "@/components/ui/tour-card";
import { mockedFavoritePlaces, mockedFavoriteTours } from "@/data/mocked-places";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const totalFavorites = mockedFavoritePlaces.length + mockedFavoriteTours.length;

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
            <p className="text-sm text-muted-foreground">
              {totalFavorites} itens salvos
            </p>
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

        {mockedFavoritePlaces.length > 0 && (
          <section className="space-y-4">
            <SectionHeader
              title="Lugares Favoritos"
              description="Seus estabelecimentos e servicos salvos"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockedFavoritePlaces.map((place) => (
                <NearbyCard
                  key={place.id}
                  {...place}
                  variant="grid"
                  onClick={() => navigate(`/bio/${place.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {mockedFavoriteTours.length > 0 && (
          <section className="space-y-4">
            <SectionHeader
              title="Tours Favoritos"
              description="Experiencias que voce quer fazer"
            />

            <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
              {mockedFavoriteTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  {...tour}
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
