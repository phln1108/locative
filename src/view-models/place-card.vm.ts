export interface PlaceCardVM {
  id: string | number;
  title: string;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
  distance?: string;
  price?: string;
  priceLevel?: 0 | 1 | 2 | 3 | 4;
  openNow?: boolean;
  address?: string;
  phone?: string;
  website?: string;
  sponsored?: boolean;
  verified?: boolean;
  type?: string;
}
