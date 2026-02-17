import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";
import { useTheme } from "@/providers/theme-provider";
import { useGeolocation } from "@/providers/geolocation-provider";
import { Loader2 } from "lucide-react";
import MapControls from "./map-controls";
import RecenterMap from "./recenter-map";

import "@/lib/map-icons";
import SearchBar from "../navigation/search-bar";

export default function Map() {
    const { theme } = useTheme();
    const { userPosition, position, loading, requestLocation } = useGeolocation();

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={position}
                zoom={16}
                zoomControl={false}
                className="h-full w-full"
            >
                <SearchBar/>
                <TileLayer
                    url={
                        theme === "dark"
                            ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                            : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                    }
                />

                <TileLayer
                    url={
                        theme === "dark"
                            ? "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
                            : "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                    }
                />

                <MapControls getLocation={requestLocation} />
                <RecenterMap position={position} />
                {userPosition && (
                    <Marker position={userPosition}>
                        <Popup>
                            Você está aqui!
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm z-1000">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            )}
        </div>
    );
}
