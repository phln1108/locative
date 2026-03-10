import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Coordinates = [number, number];

const FALLBACK_POSITION: Coordinates = [-3.731922144804193, -38.5099001755272];

interface GeolocationContextType {
  userPosition: Coordinates | null;
  position: Coordinates;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<Coordinates>;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(
  undefined
);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const isSupported =
    typeof navigator !== "undefined" && !!navigator.geolocation;

  const [userPosition, setUserPosition] = useState<Coordinates | null>(FALLBACK_POSITION);
  const [loading, setLoading] = useState<boolean>(isSupported);
  const [error, setError] = useState<string | null>(
    isSupported ? null : "Geolocalizacao nao suportada neste dispositivo."
  );

  const requestLocation = useCallback((): Promise<Coordinates> => {
    if (!isSupported) {
      return Promise.resolve(FALLBACK_POSITION);
    }

    setLoading(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: Coordinates = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];

          setUserPosition(coords);
          setError(null);
          setLoading(false);
          resolve(coords);
        },
        () => {
          setError("Nao foi possivel acessar sua localizacao.");
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
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: Coordinates = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(coords);
        setError(null);
        setLoading(false);
      },
      () => {
        setError("Nao foi possivel acessar sua localizacao.");
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, [isSupported]);

  const value = useMemo<GeolocationContextType>(
    () => ({
      userPosition,
      position: userPosition ?? FALLBACK_POSITION,
      loading,
      error,
      requestLocation,
    }),
    [error, loading, requestLocation, userPosition]
  );

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const ctx = useContext(GeolocationContext);
  if (!ctx) {
    throw new Error("useGeolocation must be used within GeolocationProvider");
  }
  return ctx;
}
