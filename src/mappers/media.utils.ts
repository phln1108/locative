import type { LocativeUnion } from "@/domain/models/locative-union";

export function getPrimaryImage(element: LocativeUnion): string {
  return (
    element.media?.find(m => m.type === "image")?.url ??
    "/placeholder.jpg"
  );
}