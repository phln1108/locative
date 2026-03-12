import { useEffect, useState } from "react";
import { useGeolocation } from "@/providers/geolocation-provider";
import { placeService } from "@/services/place-service";
import type { Place } from "@/models/models";

export function usePlaces() {
  const { position } = useGeolocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await placeService.getAll(position[0], position[1]);
        if (!cancelled) {
          setPlaces(response);
        }
      } catch {
        if (!cancelled) {
          setPlaces([]);
          setError("Nao foi possivel carregar os lugares da API.");
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
  }, [position]);

  return { places, loading, error };
}
