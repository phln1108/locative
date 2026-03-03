import { Button } from "@/components/ui/button";
import type { CategoryCardsHeaderVM } from "@/view-models/category-cards-page.vm";

interface Props extends CategoryCardsHeaderVM {
  onViewAll: () => void;
}

export default function CategoryHeader({
  title,
  description,
  actionLabel,
  onViewAll,
}: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold capitalize">{title}</h2>
      <p className="text-muted-foreground">{description}</p>

      <Button
        variant="outline"
        onClick={onViewAll}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
