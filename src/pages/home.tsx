import NearbyCard from "@/components/ui/nearby-card";
import { CategoryCard } from "@/components/ui/category-card";
import { SectionHeader } from "@/components/ui/section-header";
import { TourCard } from "@/components/ui/tour-card";
import { useNavigate } from "react-router-dom";

import { getCategoryByKey } from "@/data/categories";
import { deriveCategories } from "@/lib/derivations";
import { usePlaces } from "@/hooks/use-places";
import {
  CategoryCardSkeleton,
  NearbyCardSkeleton,
  TourCardSkeleton,
} from "@/components/ui/card-skeletons";

const HomePage = () => {
  const navigate = useNavigate();
  const { places, loading } = usePlaces();

  const derivedCategories = deriveCategories(places);
  const nearbyPlaces = places.filter((place) => place.type !== "tour");
  const tours = places.filter((place) => place.type === "tour");

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <SectionHeader
          title="Explorar por categoria"
          actionLabel="Mais categorias"
          onAction={() => navigate("/categories")}
        />

        <div className="relative -mx-4 md:mx-0">
          <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <CategoryCardSkeleton key={`category-skeleton-${index}`} />
                ))
              : derivedCategories.slice(0, 10).map((category) => (
                  <CategoryCard
                    key={category.key}
                    emoji={category.emoji}
                    label={category.label}
                    count={category.nearBy}
                    color={category.color}
                    onClick={() => navigate(`/category?category=${category.key}`)}
                  />
                ))}
          </div>

          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-background to-transparent hidden sm:block" />
        </div>
      </section>

      {(loading || nearbyPlaces.length > 0) && (
        <section className="space-y-4">
          <SectionHeader
            title="Lugares e eventos próximos"
            description="Descubra servicos, estabelecimentos e eventos perto de você"
            actionLabel="Ver mais"
            onAction={() => navigate("/nearby")}
          />

          <div className="relative">
            <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <NearbyCardSkeleton key={`nearby-skeleton-${index}`} />
                  ))
                : nearbyPlaces.slice(0, 8).map((place) => (
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
                      onClick={() => navigate(`/bio/${place.id}`)}
                    />
                  ))}
            </div>

            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-background to-transparent hidden sm:block" />
          </div>
        </section>
      )}

      {(loading || tours.length > 0) && (
        <section className="space-y-4">
          <SectionHeader
            title="Ja conhece Fortaleza?"
            description="Escolha uma opcao de tour indicada por gente de verdade"
            onAction={() => {}}
          />

          <div className="relative">
            <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <TourCardSkeleton key={`tour-skeleton-${index}`} />
                  ))
                : tours.map((tour) => (
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

            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-linear-to-l from-background to-transparent hidden sm:block" />
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
