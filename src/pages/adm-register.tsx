import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarkdownContent from "@/components/ui/markdown-content";
import { locativeService } from "@/services/locative.service";
import { categoryRegistry } from "@/data/categories";
import { getCategoryCodeLabel } from "@/lib/category-code-labels";
import type { AdminPoiContactInputDTO } from "@/types/locative-query";

const STATUS_OPTIONS = ["active", "inactive", "planned", "archived"] as const;
const CONTACT_TYPE_OPTIONS = [
  { value: "phone", label: "Telefone" },
  { value: "email", label: "E-mail" },
  { value: "website", label: "Website" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "telegram", label: "Telegram" },
] as const;
const PRICE_OPTIONS = [
  { value: "none", label: "Sem preco" },
  { value: "1", label: "$" },
  { value: "2", label: "$$" },
  { value: "3", label: "$$$" },
  { value: "4", label: "$$$$" },
] as const;

type FormState = {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  category_code: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  address_country: string;
  status: string;
  brand: string;
  price_level: string;
  image_url: string;
  contacts: AdminPoiContactInputDTO[];
};

function createEmptyContact(): AdminPoiContactInputDTO {
  return {
    contact_type: "phone",
    contact_value: "",
    label: "",
    is_primary: false,
  };
}

const initialState: FormState = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  category_code: "public_service",
  address_street: "",
  address_number: "",
  address_neighborhood: "",
  address_city: "Fortaleza",
  address_state: "CE",
  address_postal_code: "",
  address_country: "BR",
  status: "active",
  brand: "",
  price_level: "none",
  image_url: "",
  contacts: [],
};

const CATEGORY_OPTIONS = categoryRegistry.map((category) => category.key);

export default function AdminPoiRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const poiId = Number(searchParams.get("poiId"));
  const isEditing = Number.isFinite(poiId) && poiId > 0;
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(isEditing);
  const [descriptionMode, setDescriptionMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (!isEditing) {
      setBootstrapping(false);
      setForm(initialState);
      return;
    }

    const load = async () => {
      try {
        setBootstrapping(true);
        const item = await locativeService.getAdminPoi(poiId);
        setForm({
          name: item.name ?? "",
          description: item.description ?? "",
          latitude: String(item.latitude ?? ""),
          longitude: String(item.longitude ?? ""),
          category_code: item.category_code ?? "public_service",
          address_street: item.address_street ?? "",
          address_number: item.address_number ?? "",
          address_neighborhood: item.address_neighborhood ?? "",
          address_city: item.address_city ?? "",
          address_state: item.address_state ?? "",
          address_postal_code: item.address_postal_code ?? "",
          address_country: item.address_country ?? "BR",
          status: item.status ?? "active",
          brand: item.brand ?? "",
          price_level: item.price_level === null || item.price_level === undefined ? "none" : String(item.price_level),
          image_url: item.image_url ?? "",
          contacts:
            item.contacts?.map((contact) => ({
              contact_type: contact.contact_type,
              contact_value: contact.contact_value,
              label: contact.label ?? "",
              is_primary: contact.is_primary,
            })) ?? [],
        });
      } catch {
        toast("Nao foi possivel carregar o estabelecimento para edicao.", { type: "error" });
      } finally {
        setBootstrapping(false);
      }
    };

    void load();
  }, [isEditing, poiId]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateContact = (
    index: number,
    field: keyof AdminPoiContactInputDTO,
    value: string | boolean
  ) => {
    setForm((current) => {
      const contacts = current.contacts.map((contact, contactIndex) => {
        if (contactIndex !== index) return contact;

        if (field === "is_primary") {
          const isPrimary = Boolean(value);
          if (!isPrimary) {
            return { ...contact, is_primary: false };
          }

          return { ...contact, is_primary: true };
        }

        return { ...contact, [field]: value };
      });

      if (field === "is_primary" && value) {
        return {
          ...current,
          contacts: contacts.map((contact, contactIndex) => ({
            ...contact,
            is_primary: contactIndex === index,
          })),
        };
      }

      return { ...current, contacts };
    });
  };

  const addContact = () => {
    setForm((current) => ({
      ...current,
      contacts: [...current.contacts, createEmptyContact()],
    }));
  };

  const removeContact = (index: number) => {
    setForm((current) => ({
      ...current,
      contacts: current.contacts.filter((_, contactIndex) => contactIndex !== index),
    }));
  };

  const submit = async () => {
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!form.name.trim()) {
      toast("Informe o nome do estabelecimento.", { type: "error" });
      return;
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast("Informe latitude e longitude validas.", { type: "error" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        latitude,
        longitude,
        category_code: form.category_code,
        address_street: form.address_street.trim() || undefined,
        address_number: form.address_number.trim() || undefined,
        address_neighborhood: form.address_neighborhood.trim() || undefined,
        address_city: form.address_city.trim() || undefined,
        address_state: form.address_state.trim() || undefined,
        address_postal_code: form.address_postal_code.trim() || undefined,
        address_country: form.address_country.trim() || undefined,
        status: form.status,
        brand: form.brand.trim() || undefined,
        price_level: form.price_level === "none" ? undefined : Number(form.price_level),
        image_url: form.image_url.trim() || undefined,
        contacts: form.contacts
          .map((contact) => ({
            contact_type: contact.contact_type,
            contact_value: contact.contact_value.trim(),
            label: contact.label?.trim() || undefined,
            is_primary: contact.is_primary,
          }))
          .filter((contact) => contact.contact_value),
      };

      if (isEditing) {
        await locativeService.updateAdminPoi(poiId, payload);
        toast("Estabelecimento atualizado com sucesso.", { type: "success" });
      } else {
        await locativeService.createAdminPoi(payload);
        toast("Estabelecimento cadastrado com sucesso.", { type: "success" });
      }
      navigate("/adm/list");
    } catch {
      toast(
        isEditing
          ? "Nao foi possivel atualizar o estabelecimento."
          : "Nao foi possivel cadastrar o estabelecimento.",
        { type: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>{isEditing ? "Editar estabelecimento" : "Novo estabelecimento"}</CardTitle>
            <CardDescription>
              Cadastro administrativo de POIs com persistencia direta no backend.
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/adm/list">Ver lista</Link>
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {bootstrapping ? (
            <div className="text-sm text-muted-foreground">Carregando dados do estabelecimento...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descricao</Label>
                  <Tabs
                    value={descriptionMode}
                    onValueChange={(value) => setDescriptionMode(value as "edit" | "preview")}
                    className="space-y-3"
                  >
                    <TabsList>
                      <TabsTrigger value="edit">Edicao</TabsTrigger>
                      <TabsTrigger value="preview">Visualizacao</TabsTrigger>
                    </TabsList>

                    <TabsContent value="edit" className="space-y-2">
                      <textarea
                        id="description"
                        className="border-input min-h-40 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Aceita Markdown. Ex.: titulos, listas, links e imagens.
                      </p>
                    </TabsContent>

                    <TabsContent value="preview">
                      <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
                        {form.description.trim() ? (
                          <MarkdownContent content={form.description} className="space-y-4" />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Digite a descricao em Markdown para visualizar o resultado aqui.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" value={form.latitude} onChange={(event) => updateField("latitude", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" value={form.longitude} onChange={(event) => updateField("longitude", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={form.category_code} onValueChange={(value) => updateField("category_code", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {getCategoryCodeLabel(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value) => updateField("status", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input id="street" value={form.address_street} onChange={(event) => updateField("address_street", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Numero</Label>
                  <Input id="number" value={form.address_number} onChange={(event) => updateField("address_number", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" value={form.address_neighborhood} onChange={(event) => updateField("address_neighborhood", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={form.address_city} onChange={(event) => updateField("address_city", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" value={form.address_state} onChange={(event) => updateField("address_state", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">CEP</Label>
                  <Input id="zip" value={form.address_postal_code} onChange={(event) => updateField("address_postal_code", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Pais</Label>
                  <Input id="country" value={form.address_country} onChange={(event) => updateField("address_country", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" value={form.brand} onChange={(event) => updateField("brand", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Nivel de preco</Label>
                  <Select value={form.price_level} onValueChange={(value) => updateField("price_level", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o preco" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image">URL da imagem</Label>
                  <Input id="image" value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Contatos</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addContact}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar contato
                    </Button>
                  </div>

                  {form.contacts.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      Nenhum contato cadastrado.
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    {form.contacts.map((contact, index) => (
                      <div key={`${contact.contact_type}-${index}`} className="rounded-xl border p-4 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium">Contato {index + 1}</p>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(index)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select
                              value={contact.contact_type}
                              onValueChange={(value) => updateContact(index, "contact_type", value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {CONTACT_TYPE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Rotulo</Label>
                            <Input
                              value={contact.label ?? ""}
                              onChange={(event) => updateContact(index, "label", event.target.value)}
                              placeholder="Ex.: Atendimento"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Valor</Label>
                            <Input
                              value={contact.contact_value}
                              onChange={(event) => updateContact(index, "contact_value", event.target.value)}
                              placeholder="Ex.: (85) 99999-9999 ou https://..."
                            />
                          </div>

                          <div className="flex items-center gap-3 md:col-span-2">
                            <Checkbox
                              id={`contact-primary-${index}`}
                              checked={contact.is_primary}
                              onCheckedChange={(checked) => updateContact(index, "is_primary", Boolean(checked))}
                            />
                            <Label htmlFor={`contact-primary-${index}`}>Contato principal</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" asChild>
                  <Link to="/adm/list">Cancelar</Link>
                </Button>
                <Button onClick={submit} disabled={loading}>
                  {loading ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Cadastrar estabelecimento"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
