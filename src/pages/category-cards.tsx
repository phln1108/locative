import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NearbyHeader from "@/components/ui/nearby-header";
import PlaceCard from "@/components/ui/place-card";
import { mapCategoryToCategoryCardsPageVM } from "@/mappers/category-cards.mapper";
import { usePlaces } from "@/hooks/use-places";
import { PlaceCardSkeleton } from "@/components/ui/card-skeletons";
import { Button } from "@/components/ui/button";

export default function CategoryCardsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryKey = searchParams.get("category") ?? "food";
  const { places, loading } = usePlaces();

  const vm = useMemo(
    () => mapCategoryToCategoryCardsPageVM(places, categoryKey),
    [categoryKey, places]
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/categories");
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleBack} aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-left text-xl font-semibold capitalize">{vm.header.title}</h1>
            <p className="text-sm text-muted-foreground">{vm.header.description}</p>
          </div>
        </div>

        <Button variant="outline" onClick={() => navigate("/categories")}>
          {vm.header.actionLabel}
        </Button>
      </div>

      <div className="space-y-4">
        <NearbyHeader
          title={vm.nearby.title}
          subtitle={loading ? "Carregando lugares..." : vm.nearby.subtitle}
          total={vm.nearby.total}
        />

        <div className="space-y-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <PlaceCardSkeleton key={`category-card-skeleton-${index}`} />
              ))
            : vm.places.map((place) => (
                <PlaceCard
                  key={place.id}
                  {...place}
                  onClick={() => navigate(`/bio/${place.id}`)}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
