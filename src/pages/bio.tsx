import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DetailPage from "./bio-detail";
import { mockedPlaces } from "@/data/mocked-places";

export default function BioPage() {
  const { placeId } = useParams();

  const place = useMemo(
    () => mockedPlaces.find((item) => item.id === parseInt(placeId ?? "")),
    [placeId]
  );

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
