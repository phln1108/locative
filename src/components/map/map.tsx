import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";
import { useTheme } from "@/providers/theme-provider";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import MapControls from "./map-controls";
import RecenterMap from "./recenter-map";

import "@/lib/map-icons";
import SearchBar from "../navigation/search-bar";

const FALLBACK_POSITION: [number, number] = [-3.730451, -38.496286];

export default function Map() {
    const { theme } = useTheme();

    const [userPosition, setUserPosition] =
        useState<[number, number] | null>(null);

    const [loading, setLoading] = useState(true);

    const getLocation = (): Promise<[number, number]> => {
        setLoading(true);

        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                setUserPosition(FALLBACK_POSITION);
                setLoading(false);
                resolve(FALLBACK_POSITION);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords: [number, number] = [
                        pos.coords.latitude,
                        pos.coords.longitude,
                    ];

                    setUserPosition(coords);
                    setLoading(false);
                    resolve(coords);
                },
                () => {
                    setUserPosition(FALLBACK_POSITION);
                    setLoading(false);
                    resolve(FALLBACK_POSITION);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 60000,
                }
            );
        });
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            const timer = window.setTimeout(() => {
                setUserPosition(FALLBACK_POSITION);
                setLoading(false);
            }, 0);

            return () => window.clearTimeout(timer);
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords: [number, number] = [
                    pos.coords.latitude,
                    pos.coords.longitude,
                ];

                setUserPosition(coords);
                setLoading(false);
            },
            () => {
                setUserPosition(FALLBACK_POSITION);
                setLoading(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000,
            }
        );
    }, []);

    return (
        <div className="relative h-full w-full">
            <MapContainer
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

                <MapControls getLocation={getLocation} />
                <RecenterMap position={userPosition ?? FALLBACK_POSITION} />
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
