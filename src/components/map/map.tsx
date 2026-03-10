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
import { useMemo, useState } from "react";
import MapControls from "./map-controls";
import RecenterMap from "./recenter-map";
import CustomMarker from "./custom-markers";
import { mockedPlaces } from "@/data/mocked-places";
import { getCategoryByKey } from "@/data/categories";
import { useNavigate, useSearchParams } from "react-router-dom";
import NearbyPlacesCarousel from "../ui/NearbyPlacesCarousel";
import { Button } from "../ui/button";
import RoutingMachine from "./routing-machine";

import "@/lib/map-icons";
import SearchBar from "../navigation/search-bar";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function Map() {
    const { theme } = useTheme();
    const { userPosition, position, loading, requestLocation } = useGeolocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showNearbyPlaces, setShowNearbyPlaces] = useState(false);

    const destination = useMemo<[number, number] | null>(() => {
        const destLat = Number(searchParams.get("destLat"));
        const destLng = Number(searchParams.get("destLng"));
        if (!Number.isFinite(destLat) || !Number.isFinite(destLng)) return null;
        return [destLat, destLng];
    }, [searchParams]);

    // 🔹 Aqui simulamos o retorno do backend
    const nearbyPlaces = mockedPlaces.filter(
        (place) => place.coordinates
    );
    const carouselPlaces = nearbyPlaces.map((place) => {
        const category = getCategoryByKey(place.categoryKey);
        return {
            id: place.id,
            image: place.images[0],
            title: place.title,
            distance: place.distance ?? "Sem distancia",
            priceLevel: place.priceLevel,
            categoryEmoji: category?.emoji,
            categoryName: category?.label,
            categoryColor: category?.color,
        };
    });

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
                <RoutingMachine start={position} end={destination} />

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

            <div className="absolute bottom-0 left-0 right-0 z-1000 pb-4">
                <div
                    className={[
                        "flex justify-end px-4 -mb-24 transition-transform duration-300 ease-out",
                        showNearbyPlaces ? "-translate-y-22" : "translate-y-0",
                    ].join(" ")}
                >
                    <Button
                        type="button"
                        variant="secondary"
                        className="shadow-md"
                        onClick={() => setShowNearbyPlaces((current) => !current)}
                    >
                        {showNearbyPlaces ? "Ocultar" : "Lugares próximos"}
                    </Button>
                </div>

                <div
                    className={[
                        "transition-transform duration-300 ease-out will-change-transform",
                        showNearbyPlaces
                            ? "translate-y-0 pointer-events-auto"
                            : "translate-y-full pointer-events-none",
                    ].join(" ")}
                >
                    <NearbyPlacesCarousel
                        places={carouselPlaces}
                        onSelect={(id) => navigate(`/bio/${id}`)}
                    />
                </div>
            </div>
        </div>
    );
}
