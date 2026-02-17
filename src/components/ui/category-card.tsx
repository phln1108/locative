import { cn } from "@/lib/utils";

interface CategoryCardProps {
  emoji: string;
  label: string;
  count: number;
  color: string;
  variant?: "carousel" | "grid";
};


export function CategoryCard({
  emoji,
  label,
  count,
  color,
  variant
}: CategoryCardProps) {
  return (
    <button
      style={{ backgroundColor: color }}
      className={cn(
        "cursor-pointer rounded-3xl flex flex-col items-start justify-between transition-all duration-200 active:scale-[0.96] hover:shadow-md shadow-sm",
        variant === "grid"
          ? "w-full h-35 p-4"
          : "shrink-0 w-31 h-31 p-3"
      )}
    >
      <span className="text-[32px] leading-none">{emoji}</span>

      <span className="text-sm font-semibold leading-[1.2] line-clamp-2 text-left">
        {label}
      </span>

      <span className="text-xs text-muted-foreground">
        {count} por perto
      </span>
    </button>
  );
}
