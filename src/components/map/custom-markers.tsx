import type React from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MapPin,
  Store,
  Landmark,
} from "lucide-react";

interface CustomMarkerProps {
  position: L.LatLngExpression;
  type: "place" | "service" | "tour";
  children: React.ReactNode;
}

const getMarkerConfig = (type: CustomMarkerProps["type"]) => {
  switch (type) {
    case "place":
      return {
        icon: <MapPin size={16} />,
        color: "bg-emerald-500",
      };
    case "service":
      return {
        icon: <Store size={16} />,
        color: "bg-yellow-500",
      };
    case "tour":
      return {
        icon: <Landmark size={16} />,
        color: "bg-orange-500",
      };
    default:
      return {
        icon: <MapPin size={16} />,
        color: "bg-primary",
      };
  }
};

const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  type,
  children,
}) => {
  const config = getMarkerConfig(type);

  const iconMarkup = renderToStaticMarkup(
    <div className="text-white">{config.icon}</div>
  );

  const customIcon = L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        <div class="
          flex items-center justify-center
          w-8 h-8
          ${config.color}
          rounded-full
          shadow-md
        ">
          ${iconMarkup}
        </div>
        
      </div>
    `,
    className: "",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
  });

  return (
    <Marker position={position} icon={customIcon}>
      {children}
    </Marker>
  );
};

export default CustomMarker;
