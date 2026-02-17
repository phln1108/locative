export interface Categories {
    label: string;
    nearBy: number;
    emoji: string;
}

export interface NearPlace {
    image: string
    title: string
    subtitle: string
    distance: string
    rating: number
}

export interface TourPlace {
    image: string,
    title: string,
    price: number,
    rating: number,
    reviews: number,
    duration: string,
    highlight?: boolean,
}
