import type { Categories, NearPlace, TourPlace } from "./models";


export const mockedCategories: Categories[] = [
  {
    emoji: "🍽️",
    label: "Alimentação",
    nearBy: 127,
  },
  {
    emoji: "☕",
    label: "Cafés e Bebidas",
    nearBy: 84,
  },
  {
    emoji: "🛍️",
    label: "Compras",
    nearBy: 156,
  },
  {
    emoji: "💪",
    label: "Fitness e Bem-Estar",
    nearBy: 43,
  },
  {
    emoji: "🏥",
    label: "Saúde",
    nearBy: 67,
  },
  {
    emoji: "🚌",
    label: "Transporte",
    nearBy: 92,
  },
  {
    emoji: "📚",
    label: "Educação",
    nearBy: 29,
  },
  {
    emoji: "🎭",
    label: "Entretenimento",
    nearBy: 54,
  },
  {
    emoji: "🎨",
    label: "Arte e Cultura",
    nearBy: 38,
  },
  {
    emoji: "🏛️",
    label: "Pontos Turísticos",
    nearBy: 21,
  },
  {
    emoji: "🌳",
    label: "Natureza e Parques",
    nearBy: 35,
  },
  {
    emoji: "🏨",
    label: "Hospedagem",
    nearBy: 48,
  },
  {
    emoji: "🔧",
    label: "Serviços",
    nearBy: 73,
  },
  {
    emoji: "🐾",
    label: "Pets",
    nearBy: 26,
  },
  {
    emoji: "💅",
    label: "Beleza e Estética",
    nearBy: 41,
  },
  {
    emoji: "🚗",
    label: "Automotivo",
    nearBy: 39,
  },
  {
    emoji: "💰",
    label: "Serviços Financeiros",
    nearBy: 58,
  },
  {
    emoji: "⚽",
    label: "Esportes e Lazer",
    nearBy: 31,
  },
];


export const mockedNearPlaces: NearPlace[] = [
  {
    image: "https://images.unsplash.com/photo-1722587561829-8a53e1935e20",
    title: "Trattoria Bella",
    subtitle: "Restaurante Italiano",
    distance: "0.5 km",
    rating: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1761403249481-7223b41bcc26",
    title: "Praça dos Mártires",
    subtitle: "Parque Urbano",
    distance: "0.8 km",
    rating: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
    title: "Festival de Jazz & Blues",
    subtitle: "Festival de Música",
    distance: "1.2 km",
    rating: 4.7,
  },
  {
    image: "https://images.unsplash.com/photo-1719243822751-b64a8bfa2c38",
    title: "Estação Metrô Central",
    subtitle: "Estação de Metrô",
    distance: "0.3 km",
    rating: 4.5,
  },
  {
    image: "https://images.unsplash.com/photo-1749566679636-a9b0f4c52e08",
    title: "Tech Store Premium",
    subtitle: "Loja de Eletrônicos",
    distance: "0.7 km",
    rating: 4.6,
  },

  // 🔽 Lugares adicionados do HTML 🔽

  {
    image: "https://images.unsplash.com/photo-1750243711894-869aeea522ea",
    title: "Blue Bottle Coffee",
    subtitle: "Cafeteria",
    distance: "0.1 km",
    rating: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1758573467051-1d50c47b51c5",
    title: "City Pharmacy Plus",
    subtitle: "Farmácia",
    distance: "0.1 km",
    rating: 4.4,
  },
  {
    image: "https://images.unsplash.com/photo-1658211342695-9fb9c8611aee",
    title: "FitLife Gym",
    subtitle: "Academia",
    distance: "0.2 km",
    rating: 4.6,
  },
  {
    image: "https://images.unsplash.com/photo-1606819717115-9159c900370b",
    title: "Modern Art Gallery",
    subtitle: "Galeria de Arte",
    distance: "0.3 km",
    rating: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a",
    title: "Urban Market",
    subtitle: "Mercado",
    distance: "0.4 km",
    rating: 4.5,
  },
  {
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    title: "The Vegan Spot",
    subtitle: "Restaurante",
    distance: "0.5 km",
    rating: 4.7,
  },
  {
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
    title: "Tech Repair Hub",
    subtitle: "Assistência Técnica",
    distance: "0.6 km",
    rating: 4.3,
  },
  {
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e",
    title: "Sunset Yoga Studio",
    subtitle: "Estúdio de Yoga",
    distance: "0.7 km",
    rating: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1530041539828-114de669390e",
    title: "Pet Care Clinic",
    subtitle: "Clínica Veterinária",
    distance: "0.8 km",
    rating: 4.6,
  },
  {
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    title: "Indie Bookshop",
    subtitle: "Livraria",
    distance: "0.9 km",
    rating: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    title: "Fashion Forward",
    subtitle: "Loja de Roupas",
    distance: "1.0 km",
    rating: 4.4,
  },
  {
    image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2",
    title: "Craft Beer Bar",
    subtitle: "Bar",
    distance: "1.1 km",
    rating: 4.7,
  },
]


export const mockedTours: TourPlace[] = [
  {
    image: "https://images.unsplash.com/photo-1664128901953-962539306582",
    title: "Praias Urbanas",
    price: 85,
    rating: 4.8,
    reviews: 342,
    duration: "4 horas",
    highlight: true,
  },
  {
    image: "https://images.unsplash.com/photo-1682913720465-8c574a591f9c",
    title: "Centro Dragão do Mar",
    price: 65,
    rating: 4.6,
    reviews: 218,
    duration: "3 horas",
  },
  {
    image: "https://images.unsplash.com/photo-1604954433587-ac0647e6e3f0",
    title: "Dunas e Lagoas",
    price: 120,
    rating: 4.9,
    reviews: 156,
    duration: "6 horas",
  },
  {
    image: "https://images.unsplash.com/photo-1623194417728-adf641357d41",
    title: "Centro Histórico",
    price: 55,
    rating: 4.5,
    reviews: 189,
    duration: "3 horas",
  },
  {
    image: "https://images.unsplash.com/photo-1593260085573-8c27e72cdd79",
    title: "Gastronomia Cearense",
    price: 95,
    rating: 4.7,
    reviews: 274,
    duration: "4 horas",
  },
];
