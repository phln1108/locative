import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DetailPage from "./bio-detail";
import type { Place } from "@/models/models";
import { placeService } from "@/services/place-service";
import { useGeolocation } from "@/providers/geolocation-provider";
import BioDetailSkeleton from "@/components/ui/bio-detail-skeleton";

export default function BioPage() {
  const { placeId } = useParams();
  const { position } = useGeolocation();
  const [place, setPlace] = useState<Place | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const id = Number(placeId);
      if (!Number.isFinite(id)) {
        setPlace(undefined);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await placeService.getById(id, position[0], position[1]);
        if (!cancelled) {
          setPlace(response);
        }
      } catch {
        if (!cancelled) {
          setPlace(undefined);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [placeId, position]);

  if (loading) {
    return <BioDetailSkeleton />;
  }

  if (!place) {
    return (
      <main className="items-center justify-center px-4 min-h-screen w-full flex flex-col max-w-10xl">
        <div className="text-center flex-1 space-y-4">
          <h1 className="text-2xl font-semibold">Estabelecimento nao encontrado</h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o inicio
          </Link>
        </div>
      </main>
    );
  }

  return <DetailPage data={place} />;
}
