import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Compass, Map, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { categoryRegistry } from "@/data/categories";
import { locativeService } from "@/services/locative.service";

type Suggestion = {
  label: string;
  type: "categoria" | "palavra-chave" | "local";
  value: string;
};

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [placeSuggestions, setPlaceSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const currentFilters = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const category = (params.get("category") ?? "").trim();
    const keywords = (params.get("keywords") ?? "")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    return { category, keywords };
  }, [location.search]);

  const categorySuggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return categoryRegistry
      .filter((category) => category.label.toLowerCase().includes(normalized))
      .map((category) => ({ label: category.label, value: category.key }));
  }, [query]);

  const mergedSuggestions = useMemo(() => {
    const items: Suggestion[] = [];

    for (const category of categorySuggestions) {
      items.push({ type: "categoria", label: category.label, value: category.value });
    }

    for (const label of keywordSuggestions) {
      if (!items.some((item) => item.label.toLowerCase() === label.toLowerCase())) {
        items.push({ type: "palavra-chave", label, value: label });
      }
    }

    for (const label of placeSuggestions) {
      if (!items.some((item) => item.label.toLowerCase() === label.toLowerCase())) {
        items.push({ type: "local", label, value: label });
      }
    }

    return items.slice(0, 8);
  }, [categorySuggestions, keywordSuggestions, placeSuggestions]);

  useEffect(() => {
    const normalized = query.trim();
    if (!normalized) {
      setKeywordSuggestions([]);
      setPlaceSuggestions([]);
      setHighlightedIndex(0);
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      try {
        const [keywords, places] = await Promise.all([
          locativeService.listKeywords(normalized),
          locativeService.search({ busca: normalized, limite: 6 }),
        ]);

        if (!cancelled) {
          const placeNames = places
            .map((item) => {
              const record = item as Record<string, unknown>;
              return (
                (record.nome_local as string | undefined) ??
                (record.nome as string | undefined) ??
                (record.name as string | undefined)
              );
            })
            .filter((name): name is string => Boolean(name?.trim()));

          setKeywordSuggestions(keywords);
          setPlaceSuggestions(placeNames);
          setHighlightedIndex(0);
        }
      } catch {
        if (!cancelled) {
          setKeywordSuggestions([]);
          setPlaceSuggestions([]);
          setHighlightedIndex(0);
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const navigateWithFilters = (
    nextQuery?: string,
    nextCategory?: string,
    nextKeywords?: string[]
  ) => {
    const params = new URLSearchParams();
    const normalizedQuery = (nextQuery ?? query).trim();
    const normalizedCategory = (nextCategory ?? currentFilters.category ?? "").trim();
    const normalizedKeywords = (nextKeywords ?? currentFilters.keywords ?? [])
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    }
    if (normalizedCategory) {
      params.set("category", normalizedCategory);
    }
    if (normalizedKeywords.length > 0) {
      params.set("keywords", normalizedKeywords.join(","));
    }

    if (Array.from(params.keys()).length === 0) {
      return;
    }

    navigate(`/nearby?${params.toString()}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>, overrideQuery?: string) => {
    event.preventDefault();
    navigateWithFilters(overrideQuery);
  };

  const selectSuggestion = (item: Suggestion) => {
    if (item.type === "categoria") {
      setQuery(item.label);
      setKeywordSuggestions([]);
      setPlaceSuggestions([]);
      setHighlightedIndex(0);
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
      navigateWithFilters("", item.value);
      return;
    }

    if (item.type === "palavra-chave") {
      const normalized = item.value.trim().toLowerCase();
      if (!normalized) return;
      const mergedKeywords = Array.from(
        new Set([...(currentFilters.keywords ?? []), normalized])
      );
      setQuery("");
      setKeywordSuggestions([]);
      setPlaceSuggestions([]);
      setHighlightedIndex(0);
      navigateWithFilters("", currentFilters.category, mergedKeywords);
      return;
    }

    setQuery(item.value);
    setKeywordSuggestions([]);
    setPlaceSuggestions([]);
    setHighlightedIndex(0);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    navigateWithFilters(item.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      if (mergedSuggestions.length === 0) return;
      event.preventDefault();
      setHighlightedIndex((current) =>
        current >= mergedSuggestions.length - 1 ? 0 : current + 1
      );
      return;
    }

    if (event.key === "ArrowUp") {
      if (mergedSuggestions.length === 0) return;
      event.preventDefault();
      setHighlightedIndex((current) =>
        current <= 0 ? mergedSuggestions.length - 1 : current - 1
      );
      return;
    }

    if (event.key === "Escape") {
      setKeywordSuggestions([]);
      setPlaceSuggestions([]);
      setHighlightedIndex(0);
      return;
    }

    if (event.key === "Enter" && mergedSuggestions.length > 0) {
      event.preventDefault();
      const selected = mergedSuggestions[highlightedIndex];
      if (selected) {
        selectSuggestion(selected);
        return;
      }
      handleSubmit(event as unknown as FormEvent<HTMLFormElement>, query);
    }
  };


  return (
    <div className="sticky top-0 bg-transparent z-1000">
      <div className="container mx-auto px-4 py-3">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="flex items-center gap-2 w-full">
            {location.pathname !== "/" && (
              <Button
                type="button"
                size="icon"
                className="
                                        w-12 h-12 rounded-full
                                        bg-[rgb(0,136,204)]
                                        hover:bg-primary/90
                                        shadow-md
                                    "
                aria-label="Explorar"
                onClick={() => navigate("/")}
              >
                <Compass className="w-5 h-5 text-primary-foreground" />
              </Button>
            )}
            <div className="flex-1 flex items-center gap-2 bg-muted rounded-full shadow-sm px-2 py-2">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setIsFocused(false), 120);
                }}
                ref={inputRef}
                className="
                                            w-full bg-transparent border-0
                                            px-4 py-3 text-base
                                            placeholder:text-muted-foreground
                                            focus-visible:outline-none
                                            focus-visible:ring-0
                                        "
                placeholder="O que procura?"
              />
              <Button
                type="submit"
                size="icon"
                className="w-12 h-12 rounded-full bg-button-secondary hover:bg-button-secondary/80 shadow-sm"
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5 text-black" />
              </Button>
            </div>
            {location.pathname !== "/map" && (
              <Button
                type="button"
                size="icon"
                className="
                                        w-12 h-12 rounded-full
                                        bg-[rgb(0,136,204)]
                                        hover:bg-primary/90
                                        shadow-md
                                    "
                aria-label="Ver mapa"
                onClick={() => navigate("/map")}
              >
                <Map className="w-5 h-5 text-primary-foreground" />
              </Button>
            )}
          </div>

          {isFocused && mergedSuggestions.length > 0 && (
            <div className="relative">
              <div className="absolute left-0 right-0 top-2 z-20 overflow-hidden rounded-xl border bg-background shadow-lg">
                {mergedSuggestions.map((item, index) => (
                  <button
                    key={`${item.type}-${item.label}`}
                    type="button"
                    onClick={() => selectSuggestion(item)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={[
                      "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition",
                      highlightedIndex === index ? "bg-muted" : "hover:bg-muted",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
