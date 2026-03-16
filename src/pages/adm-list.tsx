import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryImage from "@/components/ui/category-image";
import { Separator } from "@/components/ui/separator";
import { getCategoryCodeLabel } from "@/lib/category-code-labels";
import { locativeService } from "@/services/locative.service";
import type { AdminPoiListItemDTO } from "@/types/locative-query";
import { Edit, ImageIcon, MapPin, Tag } from "lucide-react";

function formatAddress(item: AdminPoiListItemDTO) {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await locativeService.listAdminPois();
        setItems(response);
      } catch {
        setError("Nao foi possivel carregar os estabelecimentos.");
        toast("Falha ao carregar estabelecimentos admin.", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>Estabelecimentos</CardTitle>
            <CardDescription>
              Painel administrativo do piloto para listar e editar POIs.
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/adm/register">Novo estabelecimento</Link>
          </Button>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Carregando estabelecimentos...
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Nenhum estabelecimento cadastrado.
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {items.map((item) => (
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
                  <Badge variant="secondary">{getCategoryCodeLabel(item.category_code)}</Badge>
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
