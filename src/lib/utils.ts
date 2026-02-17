import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getColorByLabel(label: string): string {
  const hash = hashString(label.toLowerCase().trim());

  // 🔹 Hue: 0–360 (normal)
  const hue = hash % 360;

  // 🔹 Chroma: agora varia MAIS (0.08 → 0.20)
  const chroma = 0.08 + ((hash >> 3) % 120) / 1000;

  // 🔹 Lightness: leve variação (0.68 → 0.78)
  const lightness = 0.68 + ((hash >> 7) % 10) / 100;

  // Alpha fixo
  const alpha = 0.15;

  return `oklch(${lightness} ${chroma} ${hue} / ${alpha})`;
}



