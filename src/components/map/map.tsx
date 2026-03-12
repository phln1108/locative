import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useTheme } from "@/providers/theme-provider";
import { useGeolocation } from "@/providers/geolocation-provider";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import MapControls from "./map-controls";
import RecenterMap from "./recenter-map";
import CustomMarker from "./custom-markers";
import { getCategoryByKey } from "@/data/categories";
import { useNavigate, useSearchParams } from "react-router-dom";
import NearbyPlacesCarousel from "../ui/NearbyPlacesCarousel";
import { Button } from "../ui/button";
import RoutingMachine from "./routing-machine";
import { useLocativeElements } from "@/hooks/use-locative-elements";
import type { BackendPoiDTO } from "@/types/locative-query";
import { mockedElements } from "@/data/mocked-elements";
import CategoryImage from "@/components/ui/category-image";

import "@/lib/map-icons";
import SearchBar from "../navigation/search-bar";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

type MapPlace = {
  id: number;
  type: "place" | "service" | "tour";
  title: string;
  subtitle?: string;
  images: string[];
  coordinates: { lat: number; lng: number };
  distance?: string;
  distanceMeters?: number;
  priceLevel?: 0 | 1 | 2 | 3 | 4;
  categoryKey?: string;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formatDistanceFromMeters(value: unknown): string | undefined {
  const distanceMeters = toNumber(value);
  if (distanceMeters === null) return undefined;
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m`;
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function normalizeCategoryCode(code?: string): string {
  if (!code) return "";

  return code
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function mapCategoryCodeToCategoryKey(code?: string): string | undefined {
  const normalizedCode = normalizeCategoryCode(code);
  if (!normalizedCode) return undefined;

  const map: Record<string, string> = {
    public_place: "public_place",
    infrastructure: "infrastructure",
    public_service: "public_service",
    transport: "transport",
    pois_privados_alimentacao_gastronomia_e_bebidas: "food",
    pois_privados_compras_e_varejo: "shopping",
    pois_privado_compras_e_varejo: "shopping",
    pois_privado_shopping_center: "shopping",
    pois_privados_saude: "health",
    pois_privados_automotivo_e_mobilidade_privada: "automotive",
    servico_publico: "public_service",
    lugar_publico: "public_place",
    infraestrutura_urbana: "infrastructure",
    alimentacao_e_bebidas: "food",
    comercio_e_varejo: "shopping",
    shopping_center: "shopping",
    saude: "health",
    transporte: "transport",
    automotivo_e_mobilidade_privada: "automotive",
  };

  if (map[normalizedCode]) return map[normalizedCode];

  if (normalizedCode.startsWith("pois_privados_alimentacao")) return "food";
  if (normalizedCode.includes("compras") || normalizedCode.includes("varejo")) return "shopping";
  if (normalizedCode.includes("saude")) return "health";
  if (normalizedCode.includes("automotivo") || normalizedCode.includes("mobilidade")) return "automotive";
  if (normalizedCode.includes("transport")) return "transport";
  if (normalizedCode.includes("servico_publico")) return "public_service";
  if (normalizedCode.includes("lugar_publico")) return "public_place";
  if (normalizedCode.includes("infraestrutura")) return "infrastructure";
  if (normalizedCode.includes("turismo")) return "tourism";
  if (normalizedCode.includes("educacao")) return "education";
  if (normalizedCode.includes("finance")) return "finance";

  return "services";
}

function getCoordinates(poi: BackendPoiDTO): { lat: number; lng: number } | null {
  const record = poi as Record<string, unknown>;

  const coordinates = record.coordinates as Record<string, unknown> | undefined;
  const geoCoordinate = record.coordenada_geografica as Record<string, unknown> | undefined;
  const geometry = record.geometry as Record<string, unknown> | undefined;
  const geometryCoordinates = geometry?.coordinates as unknown[] | undefined;

  const lat =
    toNumber(record.latitude) ??
    toNumber(record.lat) ??
    toNumber(record.y) ??
    toNumber(geoCoordinate?.latitude) ??
    toNumber(coordinates?.lat) ??
    toNumber(coordinates?.latitude) ??
    toNumber(geometryCoordinates?.[1]);

  const lng =
    toNumber(record.longitude) ??
    toNumber(record.lng) ??
    toNumber(record.lon) ??
    toNumber(record.x) ??
    toNumber(geoCoordinate?.longitude) ??
    toNumber(coordinates?.lng) ??
    toNumber(coordinates?.longitude) ??
    toNumber(geometryCoordinates?.[0]);

  if (lat === null || lng === null) return null;
  return { lat, lng };
}

function mapBackendPoiToMapPlace(poi: BackendPoiDTO, index: number): MapPlace | null {
  const record = poi as Record<string, unknown>;

  const rawId = record.poi_id ?? record.id ?? record.element_id ?? index + 1;
  const numericId = typeof rawId === "number" ? rawId : Number(rawId);
  const id = Number.isFinite(numericId) ? numericId : index + 1;
  const fallbackElement = mockedElements.find((item) => Number(item.element_id) === id);
  const fallbackCoords =
    fallbackElement?.geometry?.type === "Point"
      ? {
          lat: fallbackElement.geometry.coordinates[1],
          lng: fallbackElement.geometry.coordinates[0],
        }
      : null;
  const coords = getCoordinates(poi) ?? fallbackCoords;
  if (!coords) return null;

  const title =
    toNonEmptyString(record.nome_local) ??
    (record.nome as string | undefined) ??
    (record.name as string | undefined) ??
    (record.title as string | undefined) ??
    `POI ${id}`;

  const subtitle =
    (record.categoria as string | undefined) ??
    (record.category as string | undefined) ??
    (record.tipo as string | undefined) ??
    "";

  const image =
    toNonEmptyString(record.image_url) ??
    toNonEmptyString(record.imagem) ??
    toNonEmptyString(record.photo);

  const rawType = (record.type as string | undefined) ?? (record.place_type as string | undefined);
  const type = rawType === "service" || rawType === "tour" ? rawType : "place";

  const rawPriceLevel = toNumber(record.price_level);
  const priceLevel =
    rawPriceLevel !== null && [0, 1, 2, 3, 4].includes(rawPriceLevel)
      ? (rawPriceLevel as 0 | 1 | 2 | 3 | 4)
      : undefined;

  const distance =
    (record.distance as string | undefined) ??
    (record.distancia as string | undefined) ??
    formatDistanceFromMeters(record.distancia_metros) ??
    "Sem distancia";
  const distanceMeters = toNumber(record.distancia_metros) ?? undefined;

  const categoryCode =
    (record.categoria as string | undefined) ??
    (record.category as string | undefined);

  return {
    id,
    type,
    title,
    subtitle,
    images: [image ?? ""],
    coordinates: coords,
    distance,
    distanceMeters,
    priceLevel,
    categoryKey: mapCategoryCodeToCategoryKey(categoryCode),
  };
}

export default function Map() {
  const { theme } = useTheme();
  const { userPosition, position, loading, requestLocation } = useGeolocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(false);

  const { data: backendPois } = useLocativeElements({
    latitude: position[0],
    longitude: position[1],
    raio_metros: 1500,
    limite: 50,
    enabled: Number.isFinite(position[0]) && Number.isFinite(position[1]),
  });

  const backendPlaces = useMemo(() => {
    const mapped = backendPois
      .map((poi, index) => mapBackendPoiToMapPlace(poi, index))
      .filter((place): place is MapPlace => Boolean(place));

    return mapped.sort((a, b) => {
      const aValue = a.distanceMeters ?? Number.POSITIVE_INFINITY;
      const bValue = b.distanceMeters ?? Number.POSITIVE_INFINITY;
      return aValue - bValue;
    });
  }, [backendPois]);

  const destination = useMemo<[number, number] | null>(() => {
    const destLat = Number(searchParams.get("destLat"));
    const destLng = Number(searchParams.get("destLng"));
    if (Number.isFinite(destLat) && Number.isFinite(destLng)) {
      return [destLat, destLng];
    }

    const destId = Number(searchParams.get("destId"));
    if (!Number.isFinite(destId)) return null;

    const destinationPlace = backendPlaces.find((place) => place.id === destId);
    if (!destinationPlace) return null;

    return [destinationPlace.coordinates.lat, destinationPlace.coordinates.lng];
  }, [backendPlaces, searchParams]);

  const nearbyPlaces = backendPlaces;

  const carouselPlaces = nearbyPlaces.map((place) => {
    const category = place.categoryKey ? getCategoryByKey(place.categoryKey) : undefined;
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
      <MapContainer center={position} zoom={15} zoomControl={false} className="h-full w-full">
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

        {userPosition && (
          <>
            <Marker position={userPosition}>
              <Popup>Você esta aqui</Popup>
            </Marker>

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

        {nearbyPlaces.map((place) => {
          const category = place.categoryKey
            ? getCategoryByKey(place.categoryKey)
            : undefined;

          return (
            <CustomMarker
              key={place.id}
              position={[place.coordinates.lat, place.coordinates.lng]}
              type={place.type}
              categoryKey={place.categoryKey}
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
                  <CategoryImage
                    src={place.images[0]}
                    alt={place.title}
                    className="w-full h-24 object-cover rounded-md"
                    fallbackClassName="w-full h-24 rounded-md"
                    categoryEmoji={category?.emoji}
                    categoryColor={category?.color}
                  />

                  <div>
                    <div className="font-semibold text-sm">{place.title}</div>
                    <div className="text-xs text-muted-foreground">{place.subtitle}</div>
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
          );
        })}
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
            showNearbyPlaces ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none",
          ].join(" ")}
        >
          <NearbyPlacesCarousel places={carouselPlaces} onSelect={(id) => navigate(`/bio/${id}`)} />
        </div>
      </div>
    </div>
  );
}
