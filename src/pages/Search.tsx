import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PlaceCard from "@/components/ui/place-card";
import { PlaceCardSkeleton } from "@/components/ui/card-skeletons";
import { placeService } from "@/services/place-service";
import type { Place } from "@/models/models";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = (searchParams.get("q") ?? "").trim();
  const category = (searchParams.get("category") ?? "").trim();
  const keywords = useMemo(() => {
    const raw = searchParams.get("keywords") ?? "";
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [searchParams]);

  const keywordsKey = keywords.join(",");
  const hasFilters = Boolean(query || category || keywords.length > 0);

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!hasFilters) {
        setPlaces([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await placeService.search({
          query,
          categoryCode: category,
          keywords,
        });
        if (!cancelled) {
          setPlaces(response);
        }
      } catch {
        if (!cancelled) {
          setPlaces([]);
          setError("Nao foi possivel carregar os resultados.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [query, category, keywordsKey, hasFilters, keywords]);

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1">
          <h1 className="text-left text-xl font-semibold">Resultados da busca</h1>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? loading
                ? "Buscando locais..."
                : `${places.length} ${places.length === 1 ? "local encontrado" : "locais encontrados"}`
              : "Use o campo de busca para filtrar por nome, categoria ou palavras-chave."}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <PlaceCardSkeleton key={`search-card-skeleton-${index}`} />
            ))
          : places.map((place) => (
              <PlaceCard
                key={place.id}
                {...place}
                onClick={() => navigate(`/bio/${place.id}`)}
              />
            ))}
      </div>
    </div>
  );
};

export default SearchPage;
