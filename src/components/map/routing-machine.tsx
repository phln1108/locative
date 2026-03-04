import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

type Coordinates = [number, number];

interface RoutingMachineProps {
  start: Coordinates | null;
  end: Coordinates | null;
}

export default function RoutingMachine({ start, end }: RoutingMachineProps) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routing = (L as unknown as { Routing?: any }).Routing;
    if (!routing) return;

    const control = routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
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
  }, [end, map, start]);

  return null;
}
