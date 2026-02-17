import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface Props {
  position: [number, number];
}

export default function RecenterMap({ position }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 16, { animate: true });
  }, [position, map]);

  return null;
}