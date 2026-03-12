import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  categoryEmoji?: string;
  categoryColor?: string;
}

function toSolidCreamColor(color?: string): string {
  if (!color) return "rgb(243, 236, 228)";

  const rgbaMatch = color.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  );

  if (!rgbaMatch) return color;

  const r = Number(rgbaMatch[1]);
  const g = Number(rgbaMatch[2]);
  const b = Number(rgbaMatch[3]);
  const whitenFactor = 0.45;
  const toCream = (channel: number) =>
    Math.round(channel * (1 - whitenFactor) + 255 * whitenFactor);

  return `rgb(${toCream(r)}, ${toCream(g)}, ${toCream(b)})`;
}

export default function CategoryImage({
  src,
  alt,
  className,
  fallbackClassName,
  categoryEmoji,
  categoryColor,
}: CategoryImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">(
    "loading"
  );

  const validSrc = useMemo(() => {
    if (typeof src !== "string") return null;
    const trimmed = src.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, [src]);

  useEffect(() => {
    setStatus("loading");
  }, [validSrc]);

  if (!validSrc) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center",
          fallbackClassName
        )}
        style={{ backgroundColor: toSolidCreamColor(categoryColor) }}
        aria-label={alt}
        role="img"
      >
        <span className="text-3xl select-none">{categoryEmoji ?? "📍"}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {status !== "loaded" && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            fallbackClassName
          )}
          style={{ backgroundColor: toSolidCreamColor(categoryColor) }}
          aria-hidden
        >
          <span className="text-3xl select-none">{categoryEmoji ?? "📍"}</span>
        </div>
      )}

      <img
        src={validSrc}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-200",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("failed")}
        loading="lazy"
      />
    </div>
  );
}
