import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type SectionHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({
  title,
  description,
  actionLabel = "Ver todos",
  onAction,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-[18px] font-semibold">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {onAction && (
        <Button
          variant="ghost"
          className="gap-1 shrink-0"
          onClick={onAction}
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
