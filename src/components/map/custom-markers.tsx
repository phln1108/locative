import type React from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Mars } from "lucide-react";

interface CustomMarkerProps {
    position: L.LatLngExpression;
    children: React.ReactNode;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ position, children }) => {

    const iconMarkup = renderToStaticMarkup(
        <Mars size={16} className="text-primary" />
    );

    const customIcon = L.divIcon({
        html: `
            <div class="flex flex-col items-center">
            
            <div class="
                flex items-center justify-center
                w-7 h-7
                bg-card
                text-primary
                rounded-full
                shadow-(--shadow-floating)
            ">
                ${iconMarkup}
            </div>

            <div class="
                w-0 h-0
                border-l-[6px] border-l-transparent
                border-r-[6px] border-r-transparent
                border-t-10
                border-t-card
                -mt-0.5
            "></div>

            </div>
        `,
        className: "",
        iconSize: [28, 38],
        iconAnchor: [14, 38],
    });

    return (
        <Marker position={position} icon={customIcon}>
            {children}
        </Marker>
    );
};

export default CustomMarker;
