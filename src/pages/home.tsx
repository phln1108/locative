import NearbyCard from "@/components/ui/nearby-card";
import { CategoryCard } from "@/components/ui/category-card";

import { mockedCategories, mockedNearPlaces, mockedTours } from "@/models/mocked";
import { getColorByLabel } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { TourCard } from "@/components/ui/tour-card";

import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">

            <section className="space-y-4">
                <SectionHeader
                    title="Explorar por categoria"
                    actionLabel="Mais categorias"
                    onAction={() => navigate("/categories")}
                />

                <div className="relative -mx-4 md:mx-0">
                    <div
                        className="
                            flex gap-4 pb-4
                            overflow-x-auto
                            scrollbar-hide
                        "
                    >
                        {mockedCategories.slice(0, 10).map((category) => (
                            <CategoryCard
                                key={category.label}
                                emoji={category.emoji}
                                label={category.label}
                                count={category.nearBy}
                                color={getColorByLabel(category.label)}
                            />
                        ))}
                    </div>
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-linear-to-l from-background to-transparent hidden sm:block" />

                </div>

            </section>

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
                            <NearbyCard key={place.title} {...place} />
                        ))}
                    </div>

                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-linear-to-l from-background to-transparent hidden sm:block" />
                </div>
            </section>

            <section className="space-y-4">
                <SectionHeader
                    title="Já conhece Fortaleza?"
                    description="Escolha uma opção de tour indicados por gente de verdade"
                />

                <div className="relative">
                    <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
                        {mockedTours.map((tour) => (
                            <TourCard key={tour.title} {...tour} />
                        ))}
                    </div>

                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-background to-transparent hidden sm:block" />
                </div>
            </section>

        </div>
    );
};

export default HomePage;
