import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    Circle,
} from "react-leaflet";
import { useTheme } from "@/providers/theme-provider";
import { useGeolocation } from "@/providers/geolocation-provider";
import { Loader2 } from "lucide-react";
import MapControls from "./map-controls";
import RecenterMap from "./recenter-map";
import CustomMarker from "./custom-markers";
import { mockedPlaces } from "@/data/mocked-places";
import { useNavigate } from "react-router-dom";

import "@/lib/map-icons";
import SearchBar from "../navigation/search-bar";

export default function Map() {
    const { theme } = useTheme();
    const { userPosition, position, loading, requestLocation } = useGeolocation();
    const navigate = useNavigate();

    // 🔹 Aqui simulamos o retorno do backend
    const nearbyPlaces = mockedPlaces.filter(
        (place) => place.coordinates
    );

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={position}
                zoom={15}
                zoomControl={false}
                className="h-full w-full"
            >
                <SearchBar />

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

                {/* 📍 Usuário */}
                {userPosition && (
                    <>
                        <Marker position={userPosition}>
                            <Popup>Você está aqui</Popup>
                        </Marker>

                        {/* 🔵 Apenas visual */}
                        <Circle
                            center={userPosition}
                            radius={1000}
                            pathOptions={{
                                color: "#2563eb",
                                fillColor: "#2563eb",
                                fillOpacity: 0.05,
                            }}
                        />
                    </>
                )}

                {/* 📌 Estabelecimentos (vindos do backend) */}
                {nearbyPlaces.map((place) => (
                    <CustomMarker
                        key={place.id}
                        position={[place.coordinates!.lat, place.coordinates!.lng]}
                        type={place.type}
                    >

                        <Popup offset={[0, -20]} className="custom-popup">
                            <div
                                className="
                                    space-y-2 w-56
                                    bg-background
                                    text-foreground
                                    rounded-lg
                                    p-2
                                "
                            >
                                <img
                                    src={place.images[0]}
                                    alt={place.title}
                                    className="w-full h-24 object-cover rounded-md"
                                />

                                <div>
                                    <div className="font-semibold text-sm">
                                        {place.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {place.subtitle}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/bio/${place.id}`)}
                                    className="
                                        w-full text-sm
                                        bg-primary
                                        text-primary-foreground
                                        rounded-md
                                        py-1.5
                                        hover:opacity-90
                                        transition
                                    "
                                >
                                    Ver detalhes
                                </button>
                            </div>
                        </Popup>

                    </CustomMarker>
                ))}
            </MapContainer>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm z-50">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            )}
        </div>
    );
}
