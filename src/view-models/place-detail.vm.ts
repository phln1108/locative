export interface PlaceDetailVM {
  id: string;
  title: string;
  description?: string;
  images: string[];
  rating?: number;
  meta: Record<string, any>;
}