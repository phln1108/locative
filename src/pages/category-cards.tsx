import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryHeader from "@/components/ui/category-header";
import NearbyHeader from "@/components/ui/nearby-header";
import PlaceCard from "@/components/ui/place-card";
import { mockedPlaces } from "@/data/mocked-places";
import { mapCategoryToCategoryCardsPageVM } from "@/mappers/category-cards.mapper";

export default function CategoryCardsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryKey = searchParams.get("category") ?? "food";

  const vm = useMemo(
    () => mapCategoryToCategoryCardsPageVM(mockedPlaces, categoryKey),
    [categoryKey]
  );

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      <CategoryHeader
        title={vm.header.title}
        description={vm.header.description}
        actionLabel={vm.header.actionLabel}
        onViewAll={() => navigate("/categories")}
      />

      <div className="space-y-4">
        <NearbyHeader
          title={vm.nearby.title}
          subtitle={vm.nearby.subtitle}
          total={vm.nearby.total}
        />

        <div className="space-y-4">
          {vm.places.map((place) => (
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
