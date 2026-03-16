import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NearbyCard from "@/components/ui/nearby-card";
import { getCategoryByKey } from "@/data/categories";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePlaces } from "@/hooks/use-places";
import { NearbyCardSkeleton } from "@/components/ui/card-skeletons";
import { placeService } from "@/services/place-service";
import type { Place } from "@/models/models";
import { categoryRegistry } from "@/data/categories";

const NearbyPlacesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const categoryParam = (searchParams.get("category") ?? "").trim();
  const keywordsParam = useMemo(() => {
    const raw = searchParams.get("keywords") ?? "";
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [searchParams]);
  const keywordsKey = keywordsParam.join(",");
  const { places, loading } = usePlaces();
  const nearbyPlaces = places.filter((place) => place.type !== "tour");

  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState(categoryParam);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(keywordsParam);

  useEffect(() => {
    if (categoryParam !== categoryFilter) {
      setCategoryFilter(categoryParam);
    }
    if (keywordsParam.join(",") !== selectedKeywords.join(",")) {
      setSelectedKeywords(keywordsParam);
    }
  }, [categoryParam, keywordsParam, categoryFilter, selectedKeywords]);

  const updateFilters = (nextCategory?: string, nextKeywords?: string[]) => {
    const params = new URLSearchParams();
    const normalizedCategory = (nextCategory ?? categoryFilter).trim();
    const keywords = (nextKeywords ?? selectedKeywords)
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (query) {
      params.set("q", query);
    }
    if (normalizedCategory) {
      params.set("category", normalizedCategory);
    }
    if (keywords.length > 0) {
      params.set("keywords", keywords.join(","));
    }

    navigate(`/nearby?${params.toString()}`);
  };

  useEffect(() => {
    if (!query && !categoryFilter && selectedKeywords.length === 0) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setSearchLoading(true);
        setSearchError(null);
        const results = await placeService.search({
          query,
          categoryCode: categoryFilter,
          keywords: selectedKeywords,
        });
        if (!cancelled) {
          setSearchResults(results);
        }
      } catch {
        if (!cancelled) {
          setSearchResults([]);
          setSearchError("Nao foi possivel carregar a busca.");
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [query, categoryFilter, keywordsKey, selectedKeywords]);

  const effectivePlaces = useMemo(
    () => (query || categoryFilter || selectedKeywords.length > 0 ? searchResults : nearbyPlaces),
    [query, categoryFilter, selectedKeywords.length, searchResults, nearbyPlaces]
  );
  const effectiveLoading = query || categoryFilter || selectedKeywords.length > 0 ? searchLoading : loading;

  const removeKeyword = (keywordToRemove: string) => {
    const next = selectedKeywords.filter((keyword) => keyword !== keywordToRemove);
    setSelectedKeywords(next);
    updateFilters(undefined, next);
  };

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
                {effectiveLoading
                  ? "Carregando lugares..."
                  : `${effectivePlaces.length} ${effectivePlaces.length !== 1 ? "lugares encontrados" : "lugar encontrado"} `}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pb-2 -mx-6 px-6 scrollbar-hide">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 w-fit">
                  <Funnel className="w-4 h-4" />
                  {categoryFilter
                    ? categoryRegistry.find((item) => item.key === categoryFilter)?.label ?? "Categoria"
                    : "Categoria"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem
                  onClick={() => {
                    setCategoryFilter("");
                    updateFilters("", undefined);
                  }}
                >
                  Todas categorias
                </DropdownMenuItem>
                {categoryRegistry.map((item) => (
                  <DropdownMenuItem
                    key={item.key}
                    onClick={() => {
                      setCategoryFilter(item.key);
                      updateFilters(item.key, undefined);
                    }}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedKeywords.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Palavras-chave
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedKeywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-sm"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="text-muted-foreground transition hover:text-foreground"
                        aria-label={`Remover ${keyword}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {searchError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {effectiveLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <NearbyCardSkeleton key={`nearby-page-skeleton-${index}`} variant="grid" />
            ))
          : effectivePlaces.map((place) => (
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
