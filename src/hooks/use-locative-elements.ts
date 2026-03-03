import type { LocativeUnion } from "@/domain/models/locative-union";
import { locativeService } from "@/services/locative.service";

export function useLocativeElements() {
  return useQuery({
    queryKey: ["locative"],
    queryFn: () => locativeService.getNearElements(-3.77, -38.48),
  });
}

function useQuery(_arg0: { queryKey: string[]; queryFn: () => Promise<LocativeUnion[]>; }) {
    throw new Error("Function not implemented.");
}
