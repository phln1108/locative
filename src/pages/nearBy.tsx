import { ArrowLeft, Funnel, MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NearbyCard from "@/components/ui/nearby-card";
import { getCategoryByKey } from "@/data/categories";
import { useNavigate } from "react-router-dom";
import { usePlaces } from "@/hooks/use-places";
import { NearbyCardSkeleton } from "@/components/ui/card-skeletons";

const NearbyPlacesPage = () => {
  const navigate = useNavigate();
  const { places, loading } = usePlaces();
  const nearbyPlaces = places.filter((place) => place.type !== "tour");

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-background border-b">
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1">
              <h1 className="text-[20px] font-semibold">Lugares próximos</h1>
              <p className="text-sm text-muted-foreground">
                {loading ? "Carregando lugares..." : `${nearbyPlaces.length} ${nearbyPlaces.length !== 1 ? "lugares encontrados" : "lugar encontrado"} `}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            <Select>
              <SelectTrigger className="w-auto gap-2">
                <MapPin className="w-4 h-4" />
                <SelectValue placeholder="Todas distancias" />
              </SelectTrigger>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Funnel className="w-4 h-4" />
                  Categorias
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>

            <Select>
              <SelectTrigger className="w-auto gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <SelectValue placeholder="Mais próximos" />
              </SelectTrigger>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <NearbyCardSkeleton key={`nearby-page-skeleton-${index}`} variant="grid" />
            ))
          : nearbyPlaces.map((place) => (
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
    </div>
  );
};

export default NearbyPlacesPage;
