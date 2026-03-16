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

    const routing = (L as unknown as { Routing?: any }).Routing;
    if (!routing) return;

    const router = routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
      profile,
    });

    const control = routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      router,
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        styles: [{ color: "#2563eb", opacity: 0.85, weight: 6 }],
      },
    });

    control.addTo(map);

    return () => {
      try {
        map.removeControl(control);
      } catch {
        // ignore remove errors during map teardown
      }
    };
  }, [end, map, profile, start]);

  return null;
}
