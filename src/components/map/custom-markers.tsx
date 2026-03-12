import type React from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Landmark,
  MapPin,
  Store,
} from "lucide-react";
import { getCategoryByKey } from "@/data/categories";

interface CustomMarkerProps {
  position: L.LatLngExpression;
  type: "place" | "service" | "tour";
  categoryKey?: string;
  children: React.ReactNode;
}

function rgbaToSolidBackground(color?: string): string {
  if (!color) return "#0ea5e9";
  const match = color.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i
  );
  if (!match) return color;
  const [, r, g, b] = match;
  return `rgb(${r}, ${g}, ${b})`;
}

const getMarkerConfig = (
  type: CustomMarkerProps["type"],
  categoryKey?: string
) => {
  const category = categoryKey ? getCategoryByKey(categoryKey) : undefined;
  const CategoryIcon = category?.icon;

  if (CategoryIcon) {
    return {
      icon: <CategoryIcon size={16} />,
      backgroundColor: rgbaToSolidBackground(category?.color),
    };
  }

  switch (type) {
    case "place":
      return {
        icon: <MapPin size={16} />,
        backgroundColor: "#10b981",
      };
    case "service":
      return {
        icon: <Store size={16} />,
        backgroundColor: "#eab308",
      };
    case "tour":
      return {
        icon: <Landmark size={16} />,
        backgroundColor: "#f97316",
      };
    default:
      return {
        icon: <MapPin size={16} />,
        backgroundColor: "#0ea5e9",
      };
  }
};

const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  type,
  categoryKey,
  children,
}) => {
  const config = getMarkerConfig(type, categoryKey);

  const iconMarkup = renderToStaticMarkup(
    <div className="text-white">{config.icon}</div>
  );

  const customIcon = L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        <div class="
          flex items-center justify-center
          w-8 h-8
          rounded-full
          shadow-md
        " style="background-color: ${config.backgroundColor};">
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
