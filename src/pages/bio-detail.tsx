import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Copy,
  ExternalLink,
  Globe,
  Heart,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Share2,
  Star,
  TriangleAlert,
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
import CategoryImage from "@/components/ui/category-image";
import MarkdownContent from "@/components/ui/markdown-content";

import type { Place, PlaceContact, ReviewDetailed } from "@/models/models";
import { getCategoryByKey } from "@/data/categories";
import { localReviewsService } from "@/services/local-reviews.service";
import { useAuth } from "@/providers/auth-provider";
import { useFavorites } from "@/providers/favorites-provider";
import { toast } from "react-toastify";

interface Props {
  data: Place;
}

export default function DetailPage({ data }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  const [myRating, setMyRating] = useState<number>(5);
  const [myComment, setMyComment] = useState<string>("");
  const [localReviews, setLocalReviews] = useState<ReviewDetailed[]>([]);
  const [myReviewId, setMyReviewId] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);
  const [pendingFeatureLabel, setPendingFeatureLabel] = useState<string>("esta funcionalidade");
  const [reportDetails, setReportDetails] = useState("");

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    onSelect();
    api.on("select", onSelect);
  }, [api]);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      const [myReview, reviewsByPlace] = await Promise.all([
        localReviewsService.getMyReviewByPlace(data.id),
        localReviewsService.listByPlace(data.id),
      ]);

      if (cancelled) return;

      setLocalReviews(reviewsByPlace);

      if (myReview) {
        setMyRating(myReview.rating);
        setMyComment(myReview.comment);
        setMyReviewId(myReview.id);
      } else {
        setMyRating(5);
        setMyComment("");
        setMyReviewId(null);
      }
    };

    void loadReviews();

    return () => {
      cancelled = true;
    };
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

  const displayReviewsCount = useMemo(() => {
    if (mergedReviews.length > 0) return mergedReviews.length;
    return data.reviews ?? 0;
  }, [data.reviews, mergedReviews.length]);

  const displayRating = useMemo(() => {
    if (mergedReviews.length > 0) {
      const sum = mergedReviews.reduce((acc, review) => acc + review.rating, 0);
      return Number((sum / mergedReviews.length).toFixed(1));
    }

    return data.rating ?? 0;
  }, [data.rating, mergedReviews]);

  const hasMyReview = myReviewId !== null;
  const contacts = useMemo(() => data.contacts ?? [], [data.contacts]);

  const goToRoute = () => {
    const params = new URLSearchParams({
      destId: String(data.id),
    });

    if (data.coordinates) {
      params.set("destLat", String(data.coordinates.lat));
      params.set("destLng", String(data.coordinates.lng));
    }

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

  const getContactLabel = (contact: PlaceContact) => {
    if (contact.label) return contact.label;

    const labels: Record<string, string> = {
      phone: "Telefone",
      whatsapp: "WhatsApp",
      email: "E-mail",
      instagram: "Instagram",
      facebook: "Facebook",
      telegram: "Telegram",
      website: "Site",
    };

    return labels[contact.type] ?? contact.type;
  };

  const handleContactClick = async (contact: PlaceContact) => {
    if (contact.type === "website") {
      window.open(contact.value, "_blank", "noopener,noreferrer");
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(contact.value);
        toast("Contato copiado.", { type: "success" });
        return;
      } catch {
        // fallback below
      }
    }

    const tempInput = document.createElement("textarea");
    tempInput.value = contact.value;
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    toast("Contato copiado.", { type: "success" });
  };

  const ensureAuthenticated = (featureLabel = "esta funcionalidade") => {
    if (isAuthenticated) return true;
    setPendingFeatureLabel(featureLabel);
    setIsLoginRequiredModalOpen(true);
    return false;
  };

  const saveMyReview = async () => {
    if (!ensureAuthenticated("avaliar estabelecimentos")) return;

    const trimmedComment = myComment.trim();
    if (!trimmedComment) return;

    await localReviewsService.upsertMyReview(data.id, {
      rating: myRating,
      comment: trimmedComment,
    });

    const [myReview, reviewsByPlace] = await Promise.all([
      localReviewsService.getMyReviewByPlace(data.id),
      localReviewsService.listByPlace(data.id),
    ]);
    setLocalReviews(reviewsByPlace);
    setMyReviewId(myReview?.id ?? null);
    setIsReviewModalOpen(false);
    toast("Avaliacao salva com sucesso!", { type: "success" });
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const deleteMyReview = async () => {
    if (myReviewId === null) return;

    await localReviewsService.deleteMyReview(myReviewId, data.id);

    const [myReview, reviewsByPlace] = await Promise.all([
      localReviewsService.getMyReviewByPlace(data.id),
      localReviewsService.listByPlace(data.id),
    ]);

    setLocalReviews(reviewsByPlace);
    setMyReviewId(myReview?.id ?? null);
    setMyRating(5);
    setMyComment("");
    setIsReviewModalOpen(false);
    toast("Avaliacao excluida com sucesso!", { type: "success" });
  };

  const handleCancelReport = () => {
    setIsReportModalOpen(false);
    setReportDetails("");
  };

  const handleSaveReport = () => {
    toast("Denúncia/reclamação registrada com sucesso!", { type: "success" });
    handleCancelReport();
  };

  const handleToggleFavorite = async () => {
    if (!ensureAuthenticated("favoritar estabelecimentos")) return;

    try {
      const nowFavorite = await toggleFavorite(data.id);
      toast(
        nowFavorite
          ? "Estabelecimento favoritado com sucesso!"
          : "Estabelecimento removido dos favoritos.",
        { type: "success" }
      );
    } catch {
      toast("Nao foi possivel atualizar favoritos.", { type: "error" });
    }
  };

  return (
    <div className="bg-background min-h-screen w-full flex flex-col max-w-10xl flex-1 container mx-auto">
      <div className="relative h-[60vh] bg-muted">
        <Carousel setApi={setApi} className="h-full">
          <CarouselContent className="h-full">
            {data.images.map((img, i) => (
              <CarouselItem key={i} className="h-[60vh]">
                <div className="relative h-full">
                  <CategoryImage
                    src={img}
                    alt={`${data.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                    fallbackClassName="w-full h-full"
                    categoryEmoji={category?.emoji}
                    categoryColor={category?.color}
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
            onClick={() => void handleToggleFavorite()}
            disabled={favoritesLoading}
          >
            <Heart
              className={
                isFavorite(data.id)
                  ? "w-5 h-5 fill-rose-500 text-rose-500"
                  : "w-5 h-5"
              }
            />
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

          {(displayRating > 0 || displayReviewsCount > 0) && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{displayRating}</span>
              <span className="text-muted-foreground">({displayReviewsCount} avaliacoes)</span>
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

        {data.keywords?.length ? (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Palavras-chave</h2>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {contacts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contatos</h2>
            <div className="space-y-2">
              {contacts.map((contact, index) => {
                const Icon =
                  contact.type === "website"
                    ? Globe
                    : contact.type === "email"
                      ? Mail
                      : Phone;

                return (
                  <button
                    key={`${contact.type}-${contact.value}-${index}`}
                    type="button"
                    onClick={() => void handleContactClick(contact)}
                    className="flex w-full items-start gap-3 rounded-xl border p-3 text-left cursor-pointer transition hover:bg-muted/40"
                  >
                    <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{getContactLabel(contact)}</div>
                      <div className="break-all text-sm text-muted-foreground">{contact.value}</div>
                    </div>
                    {contact.type === "website" ? (
                      <ExternalLink className="self-start h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Copy className="self-start h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {data.description && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Sobre</h2>
            <MarkdownContent content={data.description} className="space-y-4" />
          </div>
        )}

        {(data.eventInfo?.startsAt ||
          data.eventInfo?.endsAt ||
          data.eventInfo?.recurrence ||
          typeof data.eventInfo?.capacity === "number") && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Informações do evento</h2>
            <div className="space-y-1 text-sm">
              {data.eventInfo?.startsAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Início</span>
                  <span>{data.eventInfo.startsAt}</span>
                </div>
              )}
              {data.eventInfo?.endsAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Fim</span>
                  <span>{data.eventInfo.endsAt}</span>
                </div>
              )}
              {typeof data.eventInfo?.capacity === "number" && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Capacidade</span>
                  <span>{data.eventInfo.capacity} pessoas</span>
                </div>
              )}
              {data.eventInfo?.recurrence && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Recorrência</span>
                  <span className="text-right">{data.eventInfo.recurrence}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {data.eventInfo?.organizerItems?.length ? (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Organização</h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              {data.eventInfo.organizerItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        ) : null}

        {data.eventInfo?.ticketItems?.length ? (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Ingressos</h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              {data.eventInfo.ticketItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        ) : null}

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
            <h2 className="text-xl font-semibold">Endereço</h2>
            <p className="text-muted-foreground">{fullAddress}</p>
          </div>
        )}

        {(data.openingHours?.alwaysOpen || data.openingHours?.schedule?.length) && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Horario</h2>
            {data.openingHours?.alwaysOpen ? (
              <p className="text-sm text-muted-foreground">Aberto 24 horas.</p>
            ) : (
              <div className="space-y-1 text-sm">
                {data.openingHours?.schedule.map((s) => (
                  <div key={`${s.day}-${s.open}-${s.close}`} className="flex justify-between">
                    <span>{s.day}</span>
                    <span>
                      {s.open} - {s.close}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                  {s.content && <MarkdownContent content={s.content} className="space-y-4" />}
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
              {isAuthenticated ? (
                <Button variant="outline" onClick={() => setIsReviewModalOpen(true)}>
                  {hasMyReview ? "Editar avaliacao" : "Avaliar"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => ensureAuthenticated("avaliar estabelecimentos")}
                >
                  Entrar para avaliar
                </Button>
              )}
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

            <div className="flex justify-end pt-1">
              <Button
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={handleOpenReportModal}
              >
                <TriangleAlert className="w-4 h-4 mr-2" />
                Registrar denúncia/reclamação
              </Button>
            </div>
          </div>
        )}
        {mergedReviews.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Avaliacoes</h2>
              {isAuthenticated ? (
                <Button variant="outline" onClick={() => setIsReviewModalOpen(true)}>
                  Avaliar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => ensureAuthenticated("avaliar estabelecimentos")}
                >
                  Entrar para avaliar
                </Button>
              )}
            </div>
            <Card className="p-4 text-sm text-muted-foreground">
              Nenhuma avaliacao ainda.
            </Card>

            <div className="flex justify-end pt-1">
              <Button
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={handleOpenReportModal}
              >
                <TriangleAlert className="w-4 h-4 mr-2" />
                Registrar denúncia/reclamação
              </Button>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated && isReviewModalOpen && (
        <div className="fixed inset-0 z-1200 flex items-end sm:items-center justify-center bg-black/45 p-4">
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

            <div className="flex justify-between gap-2">
              {hasMyReview ? (
                <Button
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                  onClick={() => void deleteMyReview()}
                >
                  Excluir avaliacao
                </Button>
              ) : (
                <div />
              )}
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveMyReview}>Salvar avaliacao</Button>
            </div>
          </Card>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 z-1200 flex items-end sm:items-center justify-center bg-black/45 p-4">
          <Card className="w-full max-w-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Registrar denúncia/reclamação</h3>
              <Button type="button" variant="ghost" onClick={handleCancelReport}>
                Fechar
              </Button>
            </div>

            <textarea
              className="w-full min-h-28 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Descreva o motivo da denúncia/reclamação..."
              value={reportDetails}
              onChange={(event) => setReportDetails(event.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelReport}>
                Cancelar
              </Button>
              <Button onClick={handleSaveReport}>Registrar denúncia/reclamação</Button>
            </div>
          </Card>
        </div>
      )}

      {isLoginRequiredModalOpen && (
        <div className="fixed inset-0 z-1300 flex items-end sm:items-center justify-center bg-black/45 p-4">
          <Card className="w-full max-w-md p-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Login necessario</h3>
              <p className="text-sm text-muted-foreground">
                Você precisa estar logado para {pendingFeatureLabel}. Deseja ir para a tela de login?
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsLoginRequiredModalOpen(false);
                }}
              >
                Agora nao
              </Button>
              <Button
                onClick={() => {
                  setIsLoginRequiredModalOpen(false);
                  navigate("/login");
                }}
              >
                Fazer login
              </Button>
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
