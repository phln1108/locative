import type { Place } from "@/models/models";
import { getCategoryByKey } from "./categories";

/**
 * DADOS CENTRALIZADOS E ENRIQUECIDOS
 */

export const mockedPlaces: Place[] = [
    {
        id: 1,
        type: "place",
        title: "Trattoria Bella",
        subtitle: "Restaurante Italiano",
        categoryKey: "food",
        description:
            "Restaurante italiano tradicional com massas artesanais, ambiente acolhedor e carta de vinhos selecionada.",

        images: [
            "https://images.unsplash.com/photo-1722587561829-8a53e1935e20",
            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
            "https://images.unsplash.com/photo-1555992336-03a23c7b20ee",
        ],

        rating: 4.8,
        reviews: 214,

        ratingBreakdown: {
            five: 168,
            four: 32,
            three: 9,
            two: 3,
            one: 2,
        },

        reviewsDetailed: [
            {
                id: 1,
                user: "Mariana Souza",
                rating: 5,
                comment: "Melhor massa que já comi em Fortaleza. Atendimento impecável!",
                date: "2024-05-14",
            },
            {
                id: 2,
                user: "Carlos Mendes",
                rating: 4,
                comment: "Ambiente muito agradável, preço justo.",
                date: "2024-05-02",
            },
            {
                id: 3,
                user: "Fernanda Lima",
                rating: 5,
                comment: "O tiramisu é simplesmente perfeito.",
                date: "2024-04-28",
            },
        ],

        distance: "0.5 km",

        address: {
            street: "Rua dos Sabores",
            number: "245",
            neighborhood: "Aldeota",
            city: "Fortaleza",
            state: "CE",
            zip: "60150-000",
        },

        coordinates: { lat: -3.7685, lng: -38.4819 },

        contact: {
            phone: "85999998888",
            website: "https://trattoriabella.com.br",
            email: "contato@trattoriabella.com.br",
        },

        openingHours: {
            openNow: true,
            schedule: [
                { day: "Segunda", open: "11:30", close: "22:30" },
                { day: "Terça", open: "11:30", close: "22:30" },
                { day: "Quarta", open: "11:30", close: "22:30" },
                { day: "Quinta", open: "11:30", close: "23:00" },
                { day: "Sexta", open: "11:30", close: "23:30" },
                { day: "Sábado", open: "12:00", close: "23:30" },
                { day: "Domingo", open: "12:00", close: "21:00" },
            ],
        },

        amenities: [
            "Wi-Fi gratuito",
            "Ar-condicionado",
            "Acessibilidade",
            "Aceita cartão",
        ],

        social: {
            instagram: "@trattoriabella",
            facebook: "facebook.com/trattoriabella",
        },

        badges: [
            { label: "Reservas rápidas" },
        ],

        sections: [
            {
                title: "Especialidades",
                items: [
                    "Fettuccine artesanal",
                    "Risoto de camarão",
                    "Tiramisu clássico",
                ],
            },
            {
                title: "História",
                content:
                    "Fundado em 1998 por uma família italiana, o restaurante mantém receitas tradicionais passadas por gerações.",
            },
        ],

        quickActions: [
            { type: "call", label: "Ligar", value: "85999998888" },
            { type: "website", label: "Site" },
            { type: "map", label: "Rota" },
            { type: "share", label: "Compartilhar" },
        ],
    },
    {
        id: 2,
        type: "place",
        title: "Blue Bottle Coffee",
        subtitle: "Cafeteria Especial",
        categoryKey: "coffee",
        description:
            "Cafeteria especializada em grãos selecionados e métodos artesanais de preparo.",

        images: [
            "https://images.unsplash.com/photo-1750243711894-869aeea522ea",
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        ],

        coordinates: { lat: -3.7696, lng: -38.4814 },

        rating: 4.7,
        reviews: 182,

        ratingBreakdown: {
            five: 140,
            four: 30,
            three: 7,
            two: 3,
            one: 2,
        },

        reviewsDetailed: [
            {
                id: 1,
                user: "João Ribeiro",
                rating: 5,
                comment: "O melhor cappuccino da cidade.",
                date: "2024-05-18",
            },
        ],

        distance: "0.2 km",

        address: {
            street: "Av. Santos Dumont",
            number: "1200",
            neighborhood: "Meireles",
            city: "Fortaleza",
            state: "CE",
        },

        contact: {
            phone: "85988887777",
            website: "https://bluebottlecoffee.com",
        },

        openingHours: {
            openNow: true,
            schedule: [
                { day: "Seg-Sex", open: "07:00", close: "20:00" },
                { day: "Sáb-Dom", open: "08:00", close: "18:00" },
            ],
        },

        amenities: ["Wi-Fi", "Tomadas para notebook", "Ambiente climatizado"],

        badges: [{ label: "Ambiente tranquilo" }],

        quickActions: [
            { type: "call", label: "Ligar", value: "85988887777" },
            { type: "map", label: "Rota" },
        ],
    },

    {
        id: 3,
        type: "place",
        title: "FitLife Gym",
        subtitle: "Academia Completa",
        categoryKey: "fitness",
        description:
            "Academia moderna com equipamentos de última geração e aulas coletivas.",

        images: [
            "https://images.unsplash.com/photo-1658211342695-9fb9c8611aee",
            "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
        ],

        coordinates: { lat: -3.7702, lng: -38.4830 },

        rating: 4.6,
        reviews: 126,

        ratingBreakdown: {
            five: 88,
            four: 28,
            three: 6,
            two: 2,
            one: 2,
        },

        distance: "0.8 km",

        address: {
            street: "Rua Silva Jatahy",
            number: "400",
            neighborhood: "Aldeota",
            city: "Fortaleza",
            state: "CE",
        },

        contact: {
            phone: "85977776666",
        },

        openingHours: {
            openNow: false,
            schedule: [
                { day: "Seg-Sex", open: "05:30", close: "23:00" },
                { day: "Sábado", open: "08:00", close: "18:00" },
            ],
        },

        amenities: ["Musculação", "Crossfit", "Personal Trainer", "Estacionamento"],

        quickActions: [
            { type: "call", label: "Ligar", value: "85977776666" },
            { type: "map", label: "Rota" },
        ],
    },

    {
        id: 4,
        type: "place",
        title: "Modern Art Gallery",
        subtitle: "Galeria de Arte Contemporânea",
        categoryKey: "culture",
        description:
            "Exposições rotativas de artistas locais e internacionais.",

        images: [
            "https://images.unsplash.com/photo-1606819717115-9159c900370b",
        ],

        coordinates: { lat: -3.7678, lng: -38.4834 },

        rating: 4.9,
        reviews: 204,

        ratingBreakdown: {
            five: 180,
            four: 18,
            three: 4,
            two: 1,
            one: 1,
        },

        distance: "1.4 km",

        address: {
            street: "Rua Nogueira Acioli",
            number: "310",
            neighborhood: "Centro",
            city: "Fortaleza",
            state: "CE",
        },

        amenities: ["Acessibilidade", "Loja de souvenirs"],

        openingHours: {
            openNow: true,
            schedule: [
                { day: "Ter-Dom", open: "10:00", close: "19:00" },
            ],
        },

        badges: [{ label: "Entrada gratuita", variant: "secondary" }],
    },

    {
        id: 5,
        type: "service",
        title: "Tech Store Premium",
        subtitle: "Loja de Eletrônicos",
        categoryKey: "shopping",
        description:
            "Especializada em tecnologia, acessórios premium e assistência técnica.",

        images: [
            "https://images.unsplash.com/photo-1749566679636-a9b0f4c52e08",
        ],

        coordinates: { lat: -3.7699, lng: -38.4808 },


        rating: 4.5,
        reviews: 320,

        ratingBreakdown: {
            five: 210,
            four: 70,
            three: 25,
            two: 10,
            one: 5,
        },

        distance: "0.7 km",

        address: {
            street: "Av. Dom Luís",
            number: "500",
            neighborhood: "Meireles",
            city: "Fortaleza",
            state: "CE",
        },

        contact: {
            phone: "85966665555",
            website: "https://techstorepremium.com",
        },

        openingHours: {
            openNow: true,
            schedule: [
                { day: "Seg-Sex", open: "09:00", close: "19:00" },
                { day: "Sábado", open: "09:00", close: "14:00" },
            ],
        },

        amenities: ["Assistência técnica", "Parcelamento", "Entrega rápida"],
    },
    {
        id: 6,
        type: "place",
        title: "Indie Bookshop",
        subtitle: "Livraria Independente",
        categoryKey: "education",
        description:
            "Livraria com curadoria especial de literatura contemporânea e clássicos.",

        images: [
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        ],

        coordinates: { lat: -3.7708, lng: -38.4825 },

        rating: 4.8,
        reviews: 140,

        ratingBreakdown: {
            five: 110,
            four: 22,
            three: 5,
            two: 2,
            one: 1,
        },

        distance: "1.1 km",

        address: {
            street: "Rua Barbosa de Freitas",
            number: "910",
            neighborhood: "Aldeota",
            city: "Fortaleza",
            state: "CE",
        },

        openingHours: {
            openNow: true,
            schedule: [
                { day: "Seg-Sáb", open: "09:00", close: "20:00" },
            ],
        },

        amenities: ["Café interno", "Eventos literários", "Clube do livro"],
    },

    {
        id: 7,
        type: "place",
        title: "Pet Care Clinic",
        subtitle: "Clínica Veterinária",
        categoryKey: "pets",
        description:
            "Atendimento veterinário 24h com exames e internação.",

        images: [
            "https://images.unsplash.com/photo-1530041539828-114de669390e",
        ],

        coordinates: { lat: -3.7712, lng: -38.4840 },

        rating: 4.6,
        reviews: 98,

        ratingBreakdown: {
            five: 70,
            four: 20,
            three: 5,
            two: 2,
            one: 1,
        },

        distance: "2.3 km",

        contact: {
            phone: "85955554444",
        },

        openingHours: {
            openNow: true,
            schedule: [
                { day: "Todos os dias", open: "00:00", close: "23:59" },
            ],
        },

        badges: [{ label: "24h", variant: "secondary" }],
    },

    {
        id: 8,
        type: "place",
        title: "Fashion Forward",
        subtitle: "Loja de Roupas",
        categoryKey: "shopping",
        description:
            "Moda casual e premium com coleções exclusivas.",

        images: [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        ],

        coordinates: { lat: -3.7689, lng: -38.4832 },

        rating: 4.4,
        reviews: 110,

        ratingBreakdown: {
            five: 60,
            four: 30,
            three: 12,
            two: 5,
            one: 3,
        },

        distance: "0.9 km",
    },

    {
        id: 9,
        type: "place",
        title: "Craft Beer Bar",
        subtitle: "Bar Artesanal",
        categoryKey: "entertainment",
        description:
            "Bar com 20 torneiras de chopes artesanais e música ao vivo.",

        images: [
            "https://images.unsplash.com/photo-1436076863939-06870fe779c2",
        ],

        coordinates: { lat: -3.7675, lng: -38.4810 },

        rating: 4.7,
        reviews: 143,

        ratingBreakdown: {
            five: 102,
            four: 30,
            three: 6,
            two: 3,
            one: 2,
        },

        distance: "1.8 km",

        amenities: ["Música ao vivo", "Happy hour", "Área externa"],
    },

    {
        id: 10,
        type: "service",
        title: "City Pharmacy Plus",
        subtitle: "Farmácia",
        categoryKey: "health",
        description:
            "Farmácia com entrega rápida e manipulação.",

        images: [
            "https://images.unsplash.com/photo-1758573467051-1d50c47b51c5",
        ],

        coordinates: { lat: -3.7693, lng: -38.4837 },

        rating: 4.3,
        reviews: 76,

        ratingBreakdown: {
            five: 45,
            four: 18,
            three: 8,
            two: 3,
            one: 2,
        },

        distance: "0.4 km",
    },
    {
        id: 11,
        type: "tour",
        title: "Dunas e Lagoas",
        subtitle: "Aventura nas Dunas",
        categoryKey: "tourism",
        description:
            "Passeio 4x4 pelas dunas com parada para banho em lagoas cristalinas.",

        images: [
            "https://images.unsplash.com/photo-1604954433587-ac0647e6e3f0",
        ],

        coordinates: { lat: -3.7705, lng: -38.4805 },

        rating: 4.9,
        reviews: 156,

        ratingBreakdown: {
            five: 130,
            four: 20,
            three: 4,
            two: 1,
            one: 1,
        },

        price: 120,
        duration: "6 horas",

        amenities: ["Guia local", "Transporte incluso", "Seguro"],
    },

    {
        id: 12,
        type: "tour",
        title: "Centro Histórico",
        subtitle: "Tour Cultural",
        categoryKey: "culture",
        description:
            "Caminhada guiada pelos principais pontos históricos da cidade.",

        images: [
            "https://images.unsplash.com/photo-1623194417728-adf641357d41",
        ],

        coordinates: { lat: -3.7682, lng: -38.4842 },

        rating: 4.6,
        reviews: 189,

        price: 55,
        duration: "3 horas",
    },

    {
        id: 13,
        type: "tour",
        title: "Gastronomia Cearense",
        subtitle: "Experiência Gastronômica",
        categoryKey: "food",
        description:
            "Tour por restaurantes típicos com degustação incluída.",

        images: [
            "https://images.unsplash.com/photo-1593260085573-8c27e72cdd79",
        ],

        coordinates: { lat: -3.7715, lng: -38.4828 },

        rating: 4.8,
        reviews: 274,

        price: 95,
        duration: "4 horas",
    },

    {
        id: 14,
        type: "tour",
        title: "Praias Urbanas",
        subtitle: "Passeio Costeiro",
        categoryKey: "tourism",
        description:
            "Visita às principais praias urbanas com guia especializado.",

        images: [
            "https://images.unsplash.com/photo-1664128901953-962539306582",
        ],

        coordinates: { lat: -3.7679, lng: -38.4802 },

        rating: 4.7,
        reviews: 342,

        price: 85,
        duration: "4 horas",
    },


]


export const mockedNearPlaces = mockedPlaces
    .filter((place) => place.type !== "tour")
    .map((place) => ({
        id: place.id,
        image: place.images[0],
        title: place.title,
        subtitle:
            place.subtitle ??
            getCategoryByKey(place.categoryKey)?.label ??
            "",
        distance: place.distance ?? "",
        rating: place.rating ?? 0,
    }));


export const mockedTours = mockedPlaces
    .filter((place) => place.type === "tour")
    .map((tour) => ({
        id: tour.id,
        image: tour.images[0],
        title: tour.title,
        price: tour.price ?? 0,
        rating: tour.rating ?? 0,
        reviews: tour.reviews ?? 0,
        duration: tour.duration ?? "",
        highlight: tour.badges?.some(
            (badge) => badge.label === "Mais vendido"
        ) ?? false,
    }));

