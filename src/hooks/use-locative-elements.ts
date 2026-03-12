import { locativeService } from "@/services/locative.service";
import type { BackendPoiDTO } from "@/types/locative-query";
import { useEffect, useState } from "react";

interface UseLocativeElementsOptions {
  latitude: number;
  longitude: number;
  raio_metros?: number;
  limite?: number;
  enabled?: boolean;
}

export function useLocativeElements({
  latitude,
  longitude,
  raio_metros,
  limite,
  enabled = true,
}: UseLocativeElementsOptions) {
  const [data, setData] = useState<BackendPoiDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await locativeService.getNearElements(latitude, longitude, {
          raio_metros,
          limite,
        });

        if (!cancelled) {
          setData(response);
        }
      } catch {
        if (!cancelled) {
          setError("Nao foi possivel carregar elementos locativos.");
          setData([]);
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
  }, [enabled, latitude, limite, longitude, raio_metros]);

  return {
    data,
    loading,
    error,
    refetch: () =>
      locativeService.getNearElements(latitude, longitude, {
        raio_metros,
        limite,
      }),
  };
}
