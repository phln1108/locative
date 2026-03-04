import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Share2,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Place, ReviewDetailed } from "@/models/models";
import { getCategoryByKey } from "@/data/categories";
import { localReviewsService } from "@/services/local-reviews.service";

interface Props {
  data: Place;
}

export default function DetailPage({ data }: Props) {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  const [myRating, setMyRating] = useState<number>(5);
  const [myComment, setMyComment] = useState<string>("");
  const [localReviews, setLocalReviews] = useState<ReviewDetailed[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    onSelect();
    api.on("select", onSelect);
  }, [api]);

  useEffect(() => {
    const myReview = localReviewsService.getMyReviewByPlace(data.id);
    const reviewsByPlace = localReviewsService.listByPlace(data.id);

    setLocalReviews(reviewsByPlace);

    if (myReview) {
      setMyRating(myReview.rating);
      setMyComment(myReview.comment);
    } else {
      setMyRating(5);
      setMyComment("");
    }
  }, [data.id]);

  const category = getCategoryByKey(data.categoryKey);

  const fullAddress = useMemo(() => {
    if (!data.address) return null;
    const { street, number, neighborhood, city, state } = data.address;
    return `${street}, ${number} - ${neighborhood}, ${city} - ${state}`;
  }, [data.address]);

  const mergedReviews = useMemo(() => {
    const serverReviews = data.reviewsDetailed ?? [];
    return [...localReviews, ...serverReviews];
  }, [data.reviewsDetailed, localReviews]);
  const hasMyReview = useMemo(
    () => localReviews.some((review) => review.user === "Voce"),
    [localReviews]
  );

  const goToRoute = () => {
    if (!data.coordinates) {
      navigate("/map");
      return;
    }

    const params = new URLSearchParams({
      destLat: String(data.coordinates.lat),
      destLng: String(data.coordinates.lng),
      destId: String(data.id),
    });

    navigate(`/map?${params.toString()}`);
  };

  const handleQuickAction = (type: "call" | "website" | "map" | "share") => {
    if (type === "call" && data.contact?.phone) {
      window.location.href = `tel:${data.contact.phone}`;
      return;
    }

    if (type === "website" && data.contact?.website) {
      window.open(data.contact.website, "_blank", "noopener,noreferrer");
      return;
    }

    if (type === "share") {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        void navigator.share({
          title: data.title,
          text: data.description ?? data.subtitle ?? data.title,
          url: window.location.href,
        });
      }
      return;
    }

    if (type === "map") {
      goToRoute();
    }
  };

  const saveMyReview = () => {
    const trimmedComment = myComment.trim();
    if (!trimmedComment) return;

    localReviewsService.upsertMyReview(data.id, {
      rating: myRating,
      comment: trimmedComment,
    });

    setLocalReviews(localReviewsService.listByPlace(data.id));
    setIsReviewModalOpen(false);
  };

  return (
    <div className="bg-background min-h-screen w-full flex flex-col max-w-10xl flex-1 container mx-auto">
      <div className="relative h-[60vh] bg-muted">
        <Carousel setApi={setApi} className="h-full">
          <CarouselContent className="h-full">
            {data.images.map((img, i) => (
              <CarouselItem key={i} className="h-[60vh]">
                <div className="relative h-full">
                  <img
                    src={img}
                    alt={`${data.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/60 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="right-4 top-1/2 -translate-y-1/2" />
        </Carousel>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-2 rounded-full shadow"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            className="bg-background/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-background transition-colors"
            aria-label="Compartilhar"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="bg-background/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-background transition-colors"
            aria-label="Favoritar"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-7 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {current} / {data.images.length}
        </div>
      </div>

      <div className="relative -mt-6 bg-background rounded-t-3xl px-4 sm:px-6 pt-6 pb-32 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {data.badges?.map((b) => (
              <Badge key={b.label} variant={b.variant}>
                {b.label}
              </Badge>
            ))}
            {data.openingHours?.openNow && (
              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                Aberto agora
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-muted-foreground">{data.subtitle ?? category?.label}</p>

          {data.rating && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{data.rating}</span>
              <span className="text-muted-foreground">({data.reviews ?? 0} avaliacoes)</span>
              <span className="flex items-center text-muted-foreground pl-4 gap-1">
                <MapPin size={16} />
                {data.distance}
              </span>
            </div>
          )}
        </div>

        {data.quickActions?.length && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.quickActions.map((action) => {
              const iconMap = {
                call: Phone,
                website: Globe,
                map: Navigation,
                share: Share2,
              };
              const Icon = iconMap[action.type];

              return (
                <Button
                  key={action.type}
                  variant="outline"
                  className="flex-col gap-1 h-auto py-3"
                  onClick={() => handleQuickAction(action.type)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>
        )}

        {data.description && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Sobre</h2>
            <p className="text-muted-foreground leading-relaxed">{data.description}</p>
          </div>
        )}

        {data.amenities?.length && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Comodidades</h2>
            <div className="flex flex-wrap gap-2">
              {data.amenities.map((a) => (
                <Badge key={a} variant="secondary">
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {fullAddress && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Endereco</h2>
            <p className="text-muted-foreground">{fullAddress}</p>
          </div>
        )}

        {data.openingHours?.schedule?.length && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Horario</h2>
            <div className="space-y-1 text-sm">
              {data.openingHours.schedule.map((s) => (
                <div key={s.day} className="flex justify-between">
                  <span>{s.day}</span>
                  <span>
                    {s.open} - {s.close}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.sections?.length && (
          <Tabs defaultValue={data.sections[0].title}>
            <TabsList className="grid grid-cols-3">
              {data.sections.map((s) => (
                <TabsTrigger key={s.title} value={s.title}>
                  {s.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {data.sections.map((s) => (
              <TabsContent key={s.title} value={s.title}>
                <Card className="p-4 space-y-3">
                  {s.content && <p className="text-muted-foreground">{s.content}</p>}
                  {s.items?.map((i) => (
                    <div key={i} className="text-sm">
                      * {i}
                    </div>
                  ))}
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {mergedReviews.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Avaliacoes</h2>
              <Button variant="outline" onClick={() => setIsReviewModalOpen(true)}>
                {hasMyReview ? "Editar avaliacao" : "Avaliar"}
              </Button>
            </div>
            {mergedReviews.map((r) => (
              <Card key={r.id} className="p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.user}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={`${r.id}-${value}`}
                          className={
                            value <= r.rating
                              ? "w-4 h-4 fill-yellow-400 text-yellow-400"
                              : "w-4 h-4 text-muted-foreground"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </Card>
            ))}
          </div>
        )}
        {mergedReviews.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Avaliacoes</h2>
              <Button variant="outline" onClick={() => setIsReviewModalOpen(true)}>
                Avaliar
              </Button>
            </div>
            <Card className="p-4 text-sm text-muted-foreground">
              Nenhuma avaliacao ainda.
            </Card>
          </div>
        )}
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/45 p-4">
          <Card className="w-full max-w-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {hasMyReview ? "Editar avaliacao" : "Nova avaliacao"}
              </h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Fechar
              </Button>
            </div>

            <div className="space-y-3">
              <div className="w-full">
                <label className="text-sm text-muted-foreground">Nota</label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMyRating(value)}
                      aria-label={`Dar nota ${value}`}
                      className="p-1 rounded-sm hover:bg-muted transition-colors"
                    >
                      <Star
                        className={
                          value <= myRating
                            ? "w-5 h-5 fill-yellow-400 text-yellow-400"
                            : "w-5 h-5 text-muted-foreground"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <label className="text-sm text-muted-foreground">Comentario</label>
                <textarea
                  className="w-full min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={myComment}
                  onChange={(event) => setMyComment(event.target.value)}
                  placeholder="Conte como foi sua experiencia..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveMyReview}>Salvar avaliacao</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow">
        <div className="flex justify-between items-center gap-4 flex-1 container mx-auto">
          {data.type === "tour" ? (
            <div>
              <div className="text-sm text-muted-foreground">A partir de</div>
              <div className="text-xl font-bold text-primary">R$ {data.price ?? 0}</div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-muted-foreground">Distancia</div>
              <div className="text-xl font-bold text-primary">{data.distance ?? "-"}</div>
            </div>
          )}

          <Button className="flex-1 max-w-xs" onClick={data.type === "tour" ? undefined : goToRoute}>
            {data.type === "tour" ? (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Reservar
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 mr-2" />
                Como chegar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
