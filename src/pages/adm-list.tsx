import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryImage from "@/components/ui/category-image";
import { Separator } from "@/components/ui/separator";
import { getCategoryCodeLabel } from "@/lib/category-code-labels";
import { locativeService } from "@/services/locative.service";
import type { AdminEventListItemDTO, AdminPoiListItemDTO } from "@/types/locative-query";
import { CalendarClock, Edit, ImageIcon, MapPin, Tag } from "lucide-react";

function formatAddress(item: AdminPoiListItemDTO | AdminEventListItemDTO) {
  return [
    [item.address_street, item.address_number].filter(Boolean).join(", "),
    item.address_neighborhood,
    item.address_city,
    item.address_state,
  ]
    .filter(Boolean)
    .join(" • ");
}

function formatPriceLevel(priceLevel?: number | null) {
  if (!priceLevel || priceLevel < 1) return "Sem preco";
  return "$".repeat(priceLevel);
}

export default function AdminPoiListPage() {
  const [items, setItems] = useState<AdminPoiListItemDTO[]>([]);
  const [eventItems, setEventItems] = useState<AdminEventListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "event" ? "event" : "poi";
  const [listType, setListType] = useState<"poi" | "event">(initialType);
  const isPendingCategory = (categoryCode?: string | null) =>
    ["uncategorized", "sem_categoria"].includes((categoryCode ?? "").trim().toLowerCase());
  const sortedPoiItems = [...items].sort(
    (a, b) => Number(isPendingCategory(b.category_code)) - Number(isPendingCategory(a.category_code))
  );
  const currentItems = listType === "event" ? eventItems : sortedPoiItems;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (listType === "event") {
          const response = await locativeService.listAdminEvents();
          setEventItems(response);
        } else {
          const response = await locativeService.listAdminPois();
          setItems(response);
        }
      } catch {
        setError(
          listType === "event"
            ? "Nao foi possivel carregar os eventos."
            : "Nao foi possivel carregar os estabelecimentos."
        );
        toast(
          listType === "event"
            ? "Falha ao carregar eventos admin."
            : "Falha ao carregar estabelecimentos admin.",
          { type: "error" }
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [listType]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (listType === "event") {
      params.set("type", "event");
    } else {
      params.delete("type");
    }
    setSearchParams(params, { replace: true });
  }, [listType, searchParams, setSearchParams]);

  const formatEventDate = (value?: string | null) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleString("pt-BR");
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>{listType === "event" ? "Eventos" : "Estabelecimentos"}</CardTitle>
            <CardDescription>
              {listType === "event"
                ? "Painel administrativo do piloto para listar e editar eventos."
                : "Painel administrativo do piloto para listar e editar POIs."}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={listType === "poi" ? "default" : "outline"}
              onClick={() => setListType("poi")}
            >
              POIs
            </Button>
            <Button
              variant={listType === "event" ? "default" : "outline"}
              onClick={() => setListType("event")}
            >
              Eventos
            </Button>
            <Button asChild>
              <Link to={listType === "event" ? "/adm/register?type=event" : "/adm/register"}>
                {listType === "event" ? "Novo evento" : "Novo estabelecimento"}
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {listType === "event" ? "Carregando eventos..." : "Carregando estabelecimentos..."}
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      {!loading && !error && currentItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {listType === "event"
              ? "Nenhum evento cadastrado."
              : "Nenhum estabelecimento cadastrado."}
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {listType === "event"
          ? eventItems.map((item) => (
            <Card key={item.id} className="overflow-hidden py-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-52 w-full sm:h-auto sm:w-52">
                  <CategoryImage
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    fallbackClassName="h-full w-full"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Badge variant="secondary">Evento</Badge>
                    <Badge variant={item.status === "active" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="flex-1 p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/adm/register?eventId=${item.id}`}>
                            <Edit className="mr-1 h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        <span>
                          {formatEventDate(item.start_datetime)} - {formatEventDate(item.end_datetime)}
                        </span>
                      </div>

                      <Separator orientation="vertical" className="h-4" />

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {item.latitude}, {item.longitude}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {formatAddress(item) || "Endereco nao informado"}
                    </p>

                    <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <div>ID: {item.id}</div>
                      <div>Tipo: {item.kind || "-"}</div>
                      <div>Capacidade: {item.capacity ?? "-"}</div>
                      <div>Criado em: {new Date(item.created_at).toLocaleString("pt-BR")}</div>
                      <div>Atualizado em: {new Date(item.updated_at).toLocaleString("pt-BR")}</div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
            ))
          : sortedPoiItems.map((item) => (
            <Card key={item.id} className="overflow-hidden py-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-52 w-full sm:h-auto sm:w-52">
                  <CategoryImage
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    fallbackClassName="h-full w-full"
                  />
                  <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-1">
                    <Badge variant="secondary">{getCategoryCodeLabel(item.category_code)}</Badge>
                    {isPendingCategory(item.category_code) && (
                      <Badge variant="destructive">Recategorizar</Badge>
                    )}
                    <Badge variant={item.status === "active" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="flex-1 p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/adm/register?poiId=${item.id}`}>
                            <Edit className="mr-1 h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span>{formatPriceLevel(item.price_level)}</span>
                      </div>

                      <Separator orientation="vertical" className="h-4" />

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {item.latitude}, {item.longitude}
                        </span>
                      </div>

                      <Separator orientation="vertical" className="h-4" />

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        <span>{item.image_url ? "Imagem cadastrada" : "Sem imagem"}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {formatAddress(item) || "Endereco nao informado"}
                    </p>

                    <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <div>ID: {item.id}</div>
                      <div>Marca: {item.brand || "-"}</div>
                      <div>Criado em: {new Date(item.created_at).toLocaleString("pt-BR")}</div>
                      <div>Atualizado em: {new Date(item.updated_at).toLocaleString("pt-BR")}</div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
            ))}
      </div>
    </div>
  );
}
