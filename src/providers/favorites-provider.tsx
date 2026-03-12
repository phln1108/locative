import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { placeService } from "@/services/place-service";
import { useAuth } from "@/providers/auth-provider";

type FavoritesContextValue = {
  favoriteIds: number[];
  loading: boolean;
  isFavorite: (poiId: number) => boolean;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (poiId: number) => Promise<boolean>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      return;
    }

    try {
      setLoading(true);
      const ids = await placeService.listFavoriteIds();
      setFavoriteIds(ids);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavorite = useCallback(
    async (poiId: number) => {
      if (!isAuthenticated) {
        throw new Error("AUTH_REQUIRED");
      }

      setLoading(true);
      try {
        const ids = await placeService.toggleFavorite(poiId);
        setFavoriteIds(ids);
        return ids.includes(poiId);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      loading,
      isFavorite: (poiId: number) => favoriteIds.includes(poiId),
      refreshFavorites,
      toggleFavorite,
    }),
    [favoriteIds, loading, refreshFavorites, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  }
  return context;
}

