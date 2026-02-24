export type MediaType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "model3d";

export interface MediaAsset {
  media_id: string;

  type: MediaType;

  url: string;
  thumbnail_url?: string;

  title?: string;
  caption?: string;

  credits?: string;
  license?: string;

  source?: "user_upload" | "city_dataset" | "partner" | "scraped";

  created_at?: string;
  captured_at?: string;

  geo?: {
    lat: number;
    lng: number;
  };

  visibility?: "public" | "internal" | "restricted";

  tags?: string[];
}