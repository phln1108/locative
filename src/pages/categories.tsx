import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category-card";

import { mockedCategories } from "@/models/mocked";
import { getColorByLabel } from "@/lib/utils";

export default function CategoriesPage() {
  return (
    <main className="w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">

        {/* Header */}
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
            <h1 className="text-left text-xl font-semibold">
              Todas as Categorias
            </h1>
            <p className="text-sm text-muted-foreground">
              {mockedCategories.length} categorias •{" "}
              {mockedCategories.reduce((acc, c) => acc + c.nearBy, 0)} locais próximos
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {mockedCategories.map((category) => (
            <CategoryCard
              key={category.label}
              emoji={category.emoji}
              label={category.label}
              count={category.nearBy}
              color={getColorByLabel(category.label)}
              variant="grid"
            />
          ))}
        </div>

      </div>
    </main>
  );
}
