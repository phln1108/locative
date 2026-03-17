import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

type Coordinates = [number, number];

interface RoutingMachineProps {
  start: Coordinates | null;
  end: Coordinates | null;
  profile: "walking" | "driving";
}

export default function RoutingMachine({ start, end, profile }: RoutingMachineProps) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const profileByMode: Record<RoutingMachineProps["profile"], string> = {
      walking: "foot-walking",
      driving: "driving-car",
    };
    const orsApiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY?.trim() ?? "";
    const abortController = new AbortController();

    const routing = (L as unknown as { Routing?: any }).Routing;
    let control: any | null = null;
    let routeLine: L.Polyline | null = null;
    let cancelled = false;

    const drawRouteLine = (points: L.LatLngExpression[]) => {
      routeLine = L.polyline(points, {
        color: "#2563eb",
        opacity: 0.85,
        weight: 6,
      }).addTo(map);
      const currentZoom = map.getZoom();
      const targetZoom = currentZoom < 19 ? 19 : currentZoom;
      map.flyTo(L.latLng(start[0], start[1]), targetZoom, {
        duration: 0.35,
      });
    };

    const buildFallbackRoute = () => {
      if (!routing) return;
      const router = routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile,
      });

      control = routing.control({
        waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
        router,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
        lineOptions: {
          styles: [{ color: "#2563eb", opacity: 0.85, weight: 6 }],
        },
      });

      control.addTo(map);
      const currentZoom = map.getZoom();
      const targetZoom = currentZoom < 19 ? 19 : currentZoom;
      map.flyTo(L.latLng(start[0], start[1]), targetZoom, {
        duration: 0.35,
      });
    };

    const buildRoute = async () => {
      if (!orsApiKey) {
        buildFallbackRoute();
        return;
      }

      try {
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/${profileByMode[profile]}/geojson`,
          {
            method: "POST",
            headers: {
              Authorization: orsApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coordinates: [
                [start[1], start[0]],
                [end[1], end[0]],
              ],
            }),
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`OpenRouteService error: ${response.status}`);
        }

        const data = (await response.json()) as {
          features?: Array<{ geometry?: { coordinates?: Array<[number, number]> } }>;
        };
        const coordinates = data.features?.[0]?.geometry?.coordinates ?? [];

        if (cancelled || coordinates.length === 0) return;

        const points: L.LatLngExpression[] = coordinates.map(([lng, lat]) => [lat, lng]);
        drawRouteLine(points);
      } catch {
        if (!cancelled) {
          buildFallbackRoute();
        }
      }
    };

    void buildRoute();

    return () => {
      cancelled = true;
      abortController.abort();

      if (routeLine) {
        try {
          map.removeLayer(routeLine);
        } catch {
          // ignore remove errors during map teardown
        }
      }

      try {
        if (control) {
          map.removeControl(control);
        }
      } catch {
        // ignore remove errors during map teardown
      }
    };
  }, [end, map, profile, start]);

  return null;
}
