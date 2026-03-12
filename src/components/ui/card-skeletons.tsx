import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CategoryCardSkeleton({ variant }: { variant?: "carousel" | "grid" }) {
  return (
    <div
      className={cn(
        "rounded-3xl p-3 bg-muted/50",
        variant === "grid" ? "w-full h-35 p-4" : "shrink-0 w-31 h-31"
      )}
    >
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="mt-8 h-4 w-20" />
      <Skeleton className="mt-2 h-3 w-16" />
    </div>
  );
}

export function NearbyCardSkeleton({ variant = "carousel" }: { variant?: "carousel" | "grid" }) {
  return (
    <Card
      className={cn(
        "overflow-hidden p-0",
        variant === "grid" ? "w-full" : "shrink-0 w-70 snap-start"
      )}
    >
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </Card>
  );
}

export function TourCardSkeleton() {
  return (
    <div className="w-45 shrink-0">
      <Skeleton className="h-30 w-full rounded-3xl" />
      <div className="pt-2 space-y-1">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="w-full sm:w-48 h-48 sm:h-auto rounded-none" />
        <CardContent className="flex-1 p-4 sm:p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-6 w-2/5" />
              <div className="flex gap-1">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-4 w-1/4" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            <Skeleton className="h-4 w-3/4" />

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

