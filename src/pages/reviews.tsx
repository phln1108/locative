import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockedPlaces } from "@/data/mocked-places";
import { localReviewsService } from "@/services/local-reviews.service";

export default function ReviewsPage() {
  const navigate = useNavigate();

  const reviews = useMemo(() => localReviewsService.listMine(), []);

  return (
    <main className="w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-left text-xl font-semibold">Avaliacoes</h1>
            <p className="text-sm text-muted-foreground">
              {reviews.length} avaliacao(oes) feita(s) por voce
            </p>
          </div>
        </div>

        {reviews.length === 0 && (
          <Card className="p-6 text-center">
            <h2 className="text-lg font-semibold">Nenhuma avaliacao ainda</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Visite um estabelecimento e clique em Avaliar.
            </p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Explorar lugares
            </Button>
          </Card>
        )}

        {reviews.map((review) => {
          const place = mockedPlaces.find((item) => item.id === review.placeId);

          return (
            <Card key={review.id} className="overflow-hidden py-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-40 h-40 sm:h-auto">
                  <img
                    src={
                      place?.images?.[0] ??
                      "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                    }
                    alt={place?.title ?? "Estabelecimento"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{place?.title ?? "Estabelecimento"}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={`${review.id}-${value}`}
                          className={
                            value <= review.rating
                              ? "w-4 h-4 fill-yellow-400 text-yellow-400"
                              : "w-4 h-4 text-muted-foreground"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{review.comment}</p>

                  {place && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/bio/${place.id}`)}
                      >
                        Ver estabelecimento
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
