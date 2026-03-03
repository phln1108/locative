import NearbyCard from "@/components/ui/nearby-card";
import { CategoryCard } from "@/components/ui/category-card";
import { SectionHeader } from "@/components/ui/section-header";
import { TourCard } from "@/components/ui/tour-card";
import { useNavigate } from "react-router-dom";

import { mockedNearPlaces, mockedPlaces, mockedTours } from "@/data/mocked-places";
import { deriveCategories } from "@/lib/derivations";

const HomePage = () => {
  const navigate = useNavigate();

  const derivedCategories = deriveCategories(mockedPlaces)

  return (
    <div className="space-y-10">

      {/* CATEGORIAS */}
      <section className="space-y-4">
        <SectionHeader
          title="Explorar por categoria"
          actionLabel="Mais categorias"
          onAction={() => navigate("/categories")}
        />

        <div className="relative -mx-4 md:mx-0">
          <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
            {derivedCategories.slice(0, 10).map((category) => (
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


      {/* LUGARES PROXIMOS */}
      {mockedNearPlaces.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            title="Lugares próximos"
            description="Descubra serviços e lugares perto de você"
            actionLabel="Ver mais"
            onAction={() => navigate("/nearby")}
          />

          <div className="relative">
            <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
              {mockedNearPlaces.slice(0, 8).map((place) => (
                <NearbyCard
                  key={place.id}
                  {...place}
                  onClick={() => navigate(`/bio/${place.id}`)}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-background to-transparent hidden sm:block" />
          </div>
        </section>
      )}


      {/* TOURS */}
      {mockedTours.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            title="Já conhece Fortaleza?"
            description="Escolha uma opção de tour indicada por gente de verdade"
            onAction={() => {}}
          />

          <div className="relative">
            <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
              {mockedTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  {...tour}
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
