import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Globe,
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

import type { Place } from "@/models/models";
import { getCategoryByKey } from "@/data/categories";

interface Props {
  data: Place;
}

export default function DetailPage({ data }: Props) {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {

    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    onSelect();
    api.on("select", onSelect);
    // return () => api.off("select", onSelect);
  }, [api]);

  const category = getCategoryByKey(data.categoryKey);

  const fullAddress = useMemo(() => {
    if (!data.address) return null;
    const { street, number, neighborhood, city, state } = data.address;
    return `${street}, ${number} - ${neighborhood}, ${city} - ${state}`;
  }, [data.address]);

  return (
    <div className="bg-background min-h-screen w-full flex flex-col max-w-10xl flex-1 container mx-auto">

      {/* HERO */}
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
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-7 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {current} / {data.images.length}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative -mt-6 bg-background rounded-t-3xl px-4 sm:px-6 pt-6 pb-32 space-y-8">

        {/* HEADER */}
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
          <p className="text-muted-foreground">
            {data.subtitle ?? category?.label}
          </p>

          {/* Rating */}
          {data.rating && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{data.rating}</span>
              <span className="text-muted-foreground">
                ({data.reviews ?? 0} avaliações)
              </span>
              <span className="flex items-center text-muted-foreground pl-4 gap-1">
                <MapPin size={16}/>
                {data.distance}
              </span>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        {data.quickActions?.length && (
          <div className="grid grid-cols-2 md:grid-cols-4  gap-2">
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
                >
                  <Icon className="w-5 h-5" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>
        )}

        {/* ABOUT */}
        {data.description && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Sobre</h2>
            <p className="text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>
        )}

        {/* AMENITIES */}
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

        {/* ADDRESS */}
        {fullAddress && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Endereço</h2>
            <p className="text-muted-foreground">{fullAddress}</p>
          </div>
        )}

        {/* OPENING HOURS */}
        {data.openingHours?.schedule?.length && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Horário</h2>
            <div className="space-y-1 text-sm">
              {data.openingHours.schedule.map((s) => (
                <div key={s.day} className="flex justify-between">
                  <span>{s.day}</span>
                  <span>{s.open} - {s.close}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABS (Sections) */}
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
                  {s.content && (
                    <p className="text-muted-foreground">{s.content}</p>
                  )}
                  {s.items?.map((i) => (
                    <div key={i} className="text-sm">• {i}</div>
                  ))}
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* REVIEWS */}
        {data.reviewsDetailed?.length && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Avaliações</h2>
            {data.reviewsDetailed.map((r) => (
              <Card key={r.id} className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{r.user}</span>
                  <span className="text-sm text-muted-foreground">
                    {r.date}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {r.rating}
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA FIXO */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow ">
        <div className="flex justify-between items-center gap-4 flex-1 container mx-auto ">
          {data.type === "tour" ? (
            <div>
              <div className="text-sm text-muted-foreground">A partir de</div>
              <div className="text-xl font-bold text-primary">
                R$ {data.price ?? 0}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-muted-foreground">Distância</div>
              <div className="text-xl font-bold text-primary">
                {data.distance ?? "-"}
              </div>
            </div>
          )}

          <Button className="flex-1 max-w-xs">
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
