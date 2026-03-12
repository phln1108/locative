import { Skeleton } from "@/components/ui/skeleton";

export default function BioDetailSkeleton() {
  return (
    <div className="bg-background min-h-screen w-full flex flex-col max-w-10xl flex-1 container mx-auto">
      <div className="relative h-[60vh] bg-muted">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="relative -mt-6 bg-background rounded-t-3xl px-4 sm:px-6 pt-6 pb-32 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-56" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow">
        <div className="flex justify-between items-center gap-4 flex-1 container mx-auto">
          <div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24 mt-2" />
          </div>
          <Skeleton className="h-10 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}

