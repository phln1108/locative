import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category-card";
import { deriveCategories } from "@/lib/derivations";
import { mockedPlaces } from "@/data/mocked-places";

export default function CategoriesPage() {

  let derivedCategories = deriveCategories(mockedPlaces)

  return (
    <main className="w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
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
            <h1 className="text-left text-xl font-semibold">Todas as Categorias</h1>
            <p className="text-sm text-muted-foreground">
              {derivedCategories.length} categorias •{" "}
              {derivedCategories.reduce((acc, category) => acc + category.nearBy, 0)} locais
              proximos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {derivedCategories.map((category) => (
            <CategoryCard
              key={category.key}
              emoji={category.emoji}
              label={category.label}
              count={category.nearBy}
              color={category.color}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
