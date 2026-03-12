import type { LocativeUnion } from "@/domain/models/locative-union";

export const mockedElements: LocativeUnion[] = [
  {
    element_id: "1",
    element_type: "public_place",
    name: "Praca Luiza Tavora",
    description:
      "Praca com brinquedopraca, pista de skate, fonte e programacao cultural.",
    geometry: { type: "Point", coordinates: [-38.51021, -3.73225] },
    status: "active",
    categories: [
      { code: "public_place", is_primary: true },
      { code: "symbolic_heritage", is_primary: false },
    ],
    public_space_kind: "square",
    media: [
      {
        media_id: "1-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
        visibility: "public",
      },
    ],
    tags: ["praca", "skate", "cultura", "aldeota"],
  },
  {
    element_id: "2",
    element_type: "public_service",
    name: "CeArt - Central de Artesanato do Ceara",
    description:
      "Equipamento publico estadual dedicado ao artesanato cearense na Praca Luiza Tavora.",
    geometry: { type: "Point", coordinates: [-38.5099, -3.7322] },
    status: "active",
    categories: [
      { code: "public_service", is_primary: true },
      { code: "symbolic_heritage", is_primary: false },
    ],
    public_service_domain: "citizen_service",
    contact: {
      phone: "+55 85 3101-1644",
      website: "https://www.lojaceart.online/",
    },
    media: [
      {
        media_id: "2-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "3",
    element_type: "public_transport",
    name: "Bicicletar - Estacao Praca Luiza Tavora",
    description:
      "Estacao do sistema de bicicletas compartilhadas Bicicletar.",
    geometry: { type: "Point", coordinates: [-38.51, -3.73225] },
    status: "active",
    categories: [
      { code: "public_transport", is_primary: true },
      { code: "infrastructure", is_primary: false },
    ],
    transport_asset_kind: "station",
    mode: "other",
    schedule: {
      static_timetable_url: "https://www.bicicletar.com.br/mapaestacao.aspx",
    },
    media: [
      {
        media_id: "3-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "4",
    element_type: "infrastructure",
    name: "Wi-For - Wi-Fi publico na Praca Luiza Tavora",
    description: "Hotspot de internet publica gratuita na praca.",
    geometry: { type: "Point", coordinates: [-38.51021, -3.73225] },
    status: "active",
    categories: [{ code: "infrastructure", is_primary: true }],
    infrastructure_kind: "wifi_hotspot",
    operational_status: "operating",
    media: [
      {
        media_id: "4-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "5",
    element_type: "commercial_poi",
    name: "Cafeteria Santa Clara - Vagao",
    description:
      "Cafeteria instalada em vagao ferroviario restaurado dentro da praca.",
    geometry: { type: "Point", coordinates: [-38.50995, -3.7322] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "food_beverage", is_primary: false },
    ],
    poi_macro_type: "food_beverage",
    price_level: 2,
    rating: { value: 4.6, count: 124 },
    contact: {
      website:
        "https://www.visiter-fortaleza.com/pt/activites/cafeteria-santa-clara",
    },
    media: [
      {
        media_id: "5-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "6",
    element_type: "commercial_poi",
    name: "Drogasil Santos Dumont",
    description: "Farmacia e drogaria na Av. Santos Dumont (Aldeota).",
    geometry: { type: "Point", coordinates: [-38.50963, -3.73242] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "personal_services", is_primary: false },
    ],
    poi_macro_type: "personal_services",
    price_level: 2,
    rating: { value: 4.3, count: 88 },
    contact: {
      phone: "+55 85 98149-1958",
      website:
        "https://www.benditoguia.com.br/empresa/drogasil-aldeota-fortaleza",
    },
    media: [
      {
        media_id: "6-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "7",
    element_type: "commercial_poi",
    name: "Farmacias Pague Menos Santos Dumont",
    description: "Farmacia na Av. Santos Dumont (Aldeota).",
    geometry: { type: "Point", coordinates: [-38.50928, -3.73212] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "personal_services", is_primary: false },
    ],
    poi_macro_type: "personal_services",
    price_level: 2,
    rating: { value: 4.2, count: 76 },
    contact: {
      phone: "+55 85 3488-8040",
      website:
        "https://www.guiamais.com.br/fortaleza-ce/produtos-farmaceuticos-e-cosmeticos/farmacias-e-drogarias/413448-3/farmacia-pague-menos",
    },
    media: [
      {
        media_id: "7-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "8",
    element_type: "commercial_poi",
    name: "Otica Cruz de Ouro Center Um",
    description: "Loja de oculos no Center Um.",
    geometry: { type: "Point", coordinates: [-38.50912, -3.73188] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "retail", is_primary: false },
    ],
    poi_macro_type: "retail",
    price_level: 2,
    rating: { value: 4.1, count: 42 },
    contact: {
      phone: "+55 85 3261-6418",
      website: "https://eguias.net/empresa/cruz-de-ouro-center-i/fortaleza/ce/1487501",
    },
    media: [
      {
        media_id: "8-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "9",
    element_type: "commercial_poi",
    name: "Shopping Del Paseo",
    description: "Shopping center com lojas e praca de alimentacao.",
    geometry: { type: "Point", coordinates: [-38.50892, -3.7317] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "retail", is_primary: false },
    ],
    poi_macro_type: "retail",
    price_level: 3,
    rating: { value: 4.5, count: 356 },
    contact: {
      phone: "+55 85 3456-5500",
      website: "https://shoppingdelpaseo.com.br/del-paseo/",
    },
    media: [
      {
        media_id: "9-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "10",
    element_type: "commercial_poi",
    name: "Estacionamento Plus Costa Barros",
    description: "Estacionamento coberto com cobranca por hora e diaria.",
    geometry: { type: "Point", coordinates: [-38.51034, -3.73055] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "automotive", is_primary: false },
    ],
    poi_macro_type: "automotive",
    price_level: 1,
    rating: { value: 4.0, count: 51 },
    contact: {
      phone: "+55 85 3268-1701",
      website:
        "https://www.parkopedia.com.br/parking/carpark/estacionamento_plus/60115/fortaleza/",
    },
    media: [
      {
        media_id: "10-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "11",
    element_type: "commercial_poi",
    name: "Posto Jamaica Shell",
    description: "Posto de combustivel na regiao da Praca Luiza Tavora.",
    geometry: { type: "Point", coordinates: [-38.51036, -3.73067] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "automotive", is_primary: false },
    ],
    poi_macro_type: "automotive",
    price_level: 2,
    rating: { value: 4.1, count: 67 },
    contact: {
      website: "http://www.sobralepalacio.com.br/",
    },
    media: [
      {
        media_id: "11-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1559416523-140ddc3d238c",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "12",
    element_type: "commercial_poi",
    name: "Coco Bambu Dom Pastel",
    description:
      "Restaurante tradicional na Rua Carlos Vasconcelos, com foco em frutos do mar.",
    geometry: { type: "Point", coordinates: [-38.51058, -3.73182] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "food_beverage", is_primary: false },
    ],
    poi_macro_type: "food_beverage",
    price_level: 3,
    rating: { value: 4.7, count: 412 },
    contact: {
      phone: "+55 85 3261-1019",
      website:
        "https://www.tripadvisor.com.br/Restaurant_Review-g303293-d2084285-Reviews-Coco_Bambu_Dom_Pastel-Fortaleza_State_of_Ceara.html",
    },
    media: [
      {
        media_id: "12-1",
        type: "image",
        url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/86/7a/2d/coco-bambu-dom-pastel.jpg",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "13",
    element_type: "commercial_poi",
    name: "Oculos em Foco Aldeota",
    description: "Loja de oculos na Av. Santos Dumont.",
    geometry: { type: "Point", coordinates: [-38.50902, -3.73195] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "retail", is_primary: false },
    ],
    poi_macro_type: "retail",
    price_level: 2,
    rating: { value: 4.2, count: 49 },
    contact: {
      phone: "+55 85 99284-0289",
      website: "https://brasillocais.com/ceara/oculos-em-foco-aldeota-1387659",
    },
    media: [
      {
        media_id: "13-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "14",
    element_type: "commercial_poi",
    name: "BR Super Carga Eletroposto",
    description: "Ponto de recarga para veiculos eletricos.",
    geometry: { type: "Point", coordinates: [-38.50915, -3.73163] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "automotive", is_primary: false },
    ],
    poi_macro_type: "automotive",
    price_level: 2,
    rating: { value: 4.4, count: 33 },
    contact: {
      website: "https://www.brsupercarga.com.br/",
    },
    media: [
      {
        media_id: "14-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1593941707882-a56bbc8df34c",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "15",
    element_type: "public_service",
    name: "Posto de apoio ao turista da Policia Militar",
    description: "Ponto de apoio e orientacao para visitantes na praca.",
    geometry: { type: "Point", coordinates: [-38.50988, -3.73206] },
    status: "active",
    categories: [{ code: "public_service", is_primary: true }],
    public_service_domain: "security",
    media: [
      {
        media_id: "15-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "16",
    element_type: "public_service",
    name: "Espaco Mais Infancia do Estado do Ceara",
    description:
      "Espaco com programacao gratuita de arte, cultura, lazer, saude e educacao para criancas.",
    geometry: { type: "Point", coordinates: [-38.51037, -3.73213] },
    status: "active",
    categories: [
      { code: "public_service", is_primary: true },
      { code: "education", is_primary: false },
    ],
    public_service_domain: "education",
    contact: {
      phone: "+55 85 99243-6306",
      website: "https://www.ceara.gov.br/espaco-mais-infancia/",
    },
    media: [
      {
        media_id: "16-1",
        type: "image",
        url: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerd3XaSEVMP341la9udluqC0sj_d8pZKztiol1sHBPWrtmxbMkZSrEFavXXuvW3_-Plql1cHTBQ3dRu8oQ8BwL45sgR0E-NY2XVghD4FooYhHBYtmSHt9q-PpR3x1jboui5rgHA=w408-h306-k-no",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "17",
    element_type: "public_place",
    name: "Estacionamento publico gratuito",
    description:
      "Estacionamento publico gratuito com vagas reservadas para pessoas com deficiencia.",
    geometry: { type: "Point", coordinates: [-38.51033, -3.73211] },
    status: "active",
    categories: [{ code: "public_place", is_primary: true }],
    public_space_kind: "other",
    media: [
      {
        media_id: "17-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "18",
    element_type: "commercial_poi",
    name: "Pizza Duno Gourmet",
    description: "Pizzaria na Rua Carlos Vasconcelos.",
    geometry: { type: "Point", coordinates: [-38.51058, -3.73182] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "food_beverage", is_primary: false },
    ],
    poi_macro_type: "food_beverage",
    price_level: 2,
    rating: { value: 4.5, count: 131 },
    contact: {
      phone: "3252-1052 | 9.8778-1828",
      website: "https://www.instagram.com/pizzadunogourmet/",
    },
    media: [
      {
        media_id: "18-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "19",
    element_type: "commercial_poi",
    name: "Consultorio odontologico Dra. Lana Pessoa",
    description: "Clinica odontologica na regiao da Costa Barros.",
    geometry: { type: "Point", coordinates: [-38.51042, -3.73115] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "personal_services", is_primary: false },
    ],
    poi_macro_type: "personal_services",
    price_level: 2,
    rating: { value: 4.6, count: 54 },
    contact: {
      phone: "55 85 32618932",
    },
    media: [
      {
        media_id: "19-1",
        type: "image",
        url: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqxVz13KTFwkNIuh7vdoe4SGUUCHQfewpHceE7vzsH0JQRE1RRGTvGQwzZ8FMYcQe4N3tLcmCvpmOq4GkMMe8JrtNOUeyOOXQQdW3ZofmqAa5mo837gvH32BdPhhzj1p0Ug267G13bOMRU=w408-h544-k-no",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "20",
    element_type: "commercial_poi",
    name: "Nyrra Center",
    description: "Open mall na Aldeota.",
    geometry: { type: "Point", coordinates: [-38.51047, -3.73101] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "retail", is_primary: false },
    ],
    poi_macro_type: "retail",
    price_level: 2,
    rating: { value: 4.0, count: 39 },
    media: [
      {
        media_id: "20-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "21",
    element_type: "commercial_poi",
    name: "Banca Santa Rita",
    description: "Banca de revistas e bomboniere.",
    geometry: { type: "Point", coordinates: [-38.50961, -3.73143] },
    status: "active",
    categories: [
      { code: "commercial_poi", is_primary: true },
      { code: "retail", is_primary: false },
    ],
    poi_macro_type: "retail",
    price_level: 1,
    rating: { value: 4.1, count: 28 },
    media: [
      {
        media_id: "21-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "22",
    element_type: "public_transport",
    name: "Parada de onibus Monsenhor Bruno",
    description: "Parada de onibus proxima a Praca Luiza Tavora.",
    geometry: { type: "Point", coordinates: [-38.50972, -3.73147] },
    status: "active",
    categories: [
      { code: "public_transport", is_primary: true },
      { code: "infrastructure", is_primary: false },
    ],
    transport_asset_kind: "stop",
    mode: "bus",
    media: [
      {
        media_id: "22-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
        visibility: "public",
      },
    ],
  },
  {
    element_id: "23",
    element_type: "public_place",
    name: "Pista de skate e patins",
    description: "Pista publica de skate e patins da Praca Luiza Tavora.",
    geometry: { type: "Point", coordinates: [-38.51037, -3.73213] },
    status: "active",
    categories: [{ code: "public_place", is_primary: true }],
    public_space_kind: "park",
    media: [
      {
        media_id: "23-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1547447134-cd3f5c716030",
        visibility: "public",
      },
    ],
  },
];
