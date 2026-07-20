import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Coffee,
  Crosshair,
  ExternalLink,
  Heart,
  Home,
  Map,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Star,
  Store,
  TramFront,
  Utensils,
  Wifi,
  WifiOff
} from "lucide-react";
import "./styles.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const base = {
  id: "airbnb",
  name: "Airbnb base",
  area: "Roma Norte",
  address: "Av. Alvaro Obregon 272, Roma Norte, 06100 CDMX",
  lat: 19.4197,
  lng: -99.1648,
  category: "base",
  closing: "Home base",
  vibe: "Reset point between long walks, markets, museum slots, and late snacks.",
  fit: ["walkable", "reset", "wifi"],
  photo: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=900&q=70"
};

const places = [
  {
    id: "frida",
    name: "Museo Frida Kahlo",
    area: "Coyoacan",
    address: "Londres 247, Del Carmen",
    lat: 19.3552,
    lng: -99.1627,
    category: "scheduled",
    closing: "Fri closes 6:00 PM; July evening program may run to 9:00 PM with specific ticket",
    vibe: "Friday 11:15 AM anchor. Casa Azul, photos, garden, Coyoacan wander after.",
    fit: ["museum", "photo", "anchor"],
    source: "https://www.museofridakahlo.org.mx/?lang=en",
    photo: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "quetzalcoatl",
    name: "Parque Quetzalcoatl",
    area: "Naucalpan",
    address: "Naucalpan, EDOMEX",
    lat: 19.4579,
    lng: -99.2642,
    category: "scheduled",
    closing: "Guided visits only; Saturday slots listed at 10:30 AM and 1:00 PM",
    vibe: "Saturday 1:15 PM anchor. Surreal organic architecture and big photo payoff.",
    fit: ["architecture", "photo", "anchor"],
    source: "https://www.parquequetzalcoatl.com/",
    photo: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "anthropology",
    name: "Museo Nacional de Antropologia",
    area: "Chapultepec",
    address: "Av. Paseo de la Reforma s/n, Chapultepec",
    lat: 19.426,
    lng: -99.1862,
    category: "scheduled",
    closing: "Tue-Sun closes 5:00 PM; closed Mondays",
    vibe: "Thursday anchor inside Bosque Chapultepec. Big museum, easy to pair with park wandering.",
    fit: ["museum", "chapultepec", "anchor"],
    photo: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "chapultepec-zoo",
    name: "Zoologico de Chapultepec",
    area: "Chapultepec",
    address: "Primera Seccion del Bosque de Chapultepec",
    lat: 19.4233,
    lng: -99.1894,
    category: "parks",
    closing: "Tue-Sun 9:00 AM-4:30 PM; closed Mondays",
    vibe: "Free zoo in Chapultepec. Good if you want a low-pressure park add-on.",
    fit: ["zoo", "free", "chapultepec"],
    source: "https://data.sedema.cdmx.gob.mx/zoo_chapultepec/index.php/informacion-para-el-visitante/horarios",
    photo: "https://images.unsplash.com/photo-1534567110243-8875d64ca8ff?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "biblioteca-vasconcelos",
    name: "Biblioteca Vasconcelos",
    area: "Buenavista",
    address: "Eje 1 Norte S/N, Buenavista",
    lat: 19.4475,
    lng: -99.1517,
    category: "photo",
    closing: "Usually closes 7:30 PM; verify day-of",
    vibe: "Free floating-books photo spot. Strong architecture stop near Buenavista.",
    fit: ["free", "photo", "architecture"],
    photo: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "casa-snoopy",
    name: "Casa Snoopy Condesa",
    area: "Condesa/Escandon",
    address: "Av. Nuevo Leon 247, Escandon II",
    lat: 19.4039,
    lng: -99.1727,
    category: "cafes",
    closing: "Daily 9:30 AM-8:00 PM",
    vibe: "Official Peanuts cafe with Snoopy desserts, coffee, and photo-friendly theme details.",
    fit: ["snoopy", "cafe", "sweet", "photo"],
    source: "https://www.opentable.com.mx/r/casa-snoopy-condesa-ciudad-de-mexico",
    photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "simicasa",
    name: "SimiCasa",
    area: "Cuauhtemoc",
    address: "Rio Neva 17, Renacimiento",
    lat: 19.4307,
    lng: -99.1665,
    category: "collectibles",
    closing: "Fri-Sun closes 6:00 PM; Tue-Thu closes 5:00 PM",
    vibe: "Dr. Simi origin story, Simiverso, cafe, souvenir shop.",
    fit: ["dr simi", "souvenirs", "cute", "museum"],
    source: "https://sic.cultura.gob.mx/ficha.php?table=museo&table_id=2502",
    photo: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "panini",
    name: "Tienda Panini Plaza Cuauhtemoc",
    area: "Roma/Cuauhtemoc",
    address: "Av. Cuauhtemoc 19, Local 37",
    lat: 19.4232,
    lng: -99.1552,
    category: "collectibles",
    closing: "Daily closes 8:00 PM",
    vibe: "Cards, stickers, manga, comics. Fast collectible mission from Roma.",
    fit: ["trading cards", "stickers", "comics", "quick stop"],
    source: "https://www.findglocal.com/MX/Mexico-City/1980328012196271/Tienda-Panini-Plaza-Cuauht%C3%A9moc",
    photo: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "pokeshop",
    name: "Pokeshop Center Mexico",
    area: "Centro",
    address: "Ayuntamiento 115, Centro",
    lat: 19.4315,
    lng: -99.1431,
    category: "collectibles",
    closing: "Reported Thu 12:00-7:00 PM; verify before crossing town",
    vibe: "Pokemon cards, imports, singles, plushies, and collector-shop browsing.",
    fit: ["trading cards", "pokemon", "collectibles"],
    source: "https://www.corner.inc/place/pchCMe1cRNmj",
    photo: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "hello-kitty-cafe",
    name: "Hello Kitty Cafe Mexico",
    area: "Polanco",
    address: "Plaza Carso 1F, Polanco",
    lat: 19.4409,
    lng: -99.2043,
    category: "sweet",
    closing: "Daily closes 7:30 PM",
    vibe: "Sanrio-coded dessert stop. Best with Soumaya/Jumex or Polanco wandering.",
    fit: ["hello kitty", "sweet treats", "cute"],
    source: "https://hellokitty.cafe/cart/",
    photo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "kawaii-roma",
    name: "Kawaii shop cluster",
    area: "Roma Norte",
    address: "San Luis Potosi 173, Roma Norte",
    lat: 19.4119,
    lng: -99.1668,
    category: "collectibles",
    closing: "Reported daily closes 6:00 PM",
    vibe: "Cute home goods and Sanrio-adjacent finds right near your base.",
    fit: ["hello kitty", "kawaii", "trinkets", "walkable"],
    source: "https://www.chilango.com/shopping/lugares-kawaii-en-la-cdmx/amp/",
    photo: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "mibimbo",
    name: "MiBIMBO Museo Interactivo",
    area: "Centro Historico",
    address: "Isabel La Catolica 51, Centro",
    lat: 19.4318,
    lng: -99.1365,
    category: "photo",
    closing: "Tue-Fri 9:00 AM-6:00 PM; Sat-Sun 10:00 AM-7:00 PM",
    vibe: "Bimbo history museum in Centro. Fun branded stop if you are nearby.",
    fit: ["bimbo", "museum", "cute", "centro"],
    source: "https://www.grupobimbo.com/en/node/2059",
    photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "roma-bars",
    name: "Roma Norte bars",
    area: "Roma Norte",
    address: "Roma Norte, CDMX",
    lat: 19.4191,
    lng: -99.1647,
    category: "food",
    closing: "Friday 10:00 PM plan",
    vibe: "Flexible nightlife anchor around Roma Norte for Friday night.",
    fit: ["bars", "night", "roma"],
    photo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "romantic-date",
    name: "Romantic date",
    area: "CDMX",
    address: "Pick from approved recommendations",
    lat: 19.421,
    lng: -99.168,
    category: "food",
    closing: "Saturday evening",
    vibe: "Placeholder for the date spot you approve from recommendations.",
    fit: ["date", "dinner", "romantic"],
    photo: "https://images.unsplash.com/photo-1529516548873-9ce57c8f155e?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "mercado-89",
    name: "Mercado 89 Coyoacan",
    area: "Coyoacan",
    address: "Allende S/N, Del Carmen",
    lat: 19.3487,
    lng: -99.1634,
    category: "markets",
    closing: "Reported daily around 8:00 AM-6:00 PM",
    vibe: "Classic Coyoacan market for food, crafts, sweets, and post-Frida wandering.",
    fit: ["market", "coyoacan", "food", "crafts"],
    source: "https://culturacoyoacan.com/mercados/",
    photo: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "cosmopolis",
    name: "Cosmopolis Bazar",
    area: "Roma Norte",
    address: "Colima 124, Roma Norte",
    lat: 19.4199,
    lng: -99.1607,
    category: "markets",
    closing: "Fri-Sun closes 7:30 PM",
    vibe: "Vintage, accessories, snacks, piercing, art, plants. Very easy from the Airbnb.",
    fit: ["vintage", "trinkets", "market", "walkable"],
    source: "https://cosmopolisbazar.com/",
    photo: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "bazar-oro",
    name: "Bazar del Oro",
    area: "Roma Norte",
    address: "Calle Oro, Roma Norte",
    lat: 19.4194,
    lng: -99.1712,
    category: "markets",
    closing: "Best by afternoon; semi-permanent street bazar",
    vibe: "Clothes, indie designers, gifts, artisan goods, and casual food without a long detour.",
    fit: ["vintage", "market", "trinkets", "walkable"],
    source: "https://mexicocity.cdmx.gob.mx/venues/bazar-del-oro/?lang=en",
    photo: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "lagunilla",
    name: "La Lagunilla Sunday antiques",
    area: "Centro",
    address: "Ignacio Allende / Comonfort area",
    lat: 19.4442,
    lng: -99.1373,
    category: "markets",
    closing: "Sunday antiques run roughly 9:00 AM-3:00 PM",
    vibe: "Final hunt: vintage objects, records, oddities, art, and bargaining.",
    fit: ["flea market", "vintage", "collectibles", "sunday"],
    source: "https://www.tourme.app/mx/blog/mercado-de-lagunilla-mexico-city-guide",
    photo: "https://images.unsplash.com/photo-1519302959554-a75be0afc82a?auto=format&fit=crop&w=900&q=70"
  },
  {
    id: "mercado-100",
    name: "Mercado el 100",
    area: "Roma Sur",
    address: "Plaza del Lanzador",
    lat: 19.4091,
    lng: -99.1641,
    category: "markets",
    closing: "Sunday open-air morning market; go before lunch",
    vibe: "Local organic market for coffee, snacks, soaps, crafts, and a soft Sunday reset.",
    fit: ["market", "coffee", "snacks", "walkable"],
    source: "https://mexicocity.cdmx.gob.mx/venues/mercado-el-100/?lang=en"
  },
  {
    id: "freaktees",
    name: "Freak Tees",
    area: "Roma Norte",
    address: "Colima 124, Roma Norte",
    lat: 19.4199,
    lng: -99.1607,
    category: "collectibles",
    closing: "Fri-Sun closes 10:00 PM; Mon-Thu closes 8:00 PM",
    vibe: "Graphic tees and limited designs; good add-on near Cosmopolis.",
    fit: ["collectibles", "tees", "walkable"],
    source: "https://www.freaktees.com.mx/"
  },
  {
    id: "terraza-cha-cha-cha",
    name: "Terraza Cha Cha Cha",
    area: "Tabacalera",
    address: "Av. de la Republica 157",
    lat: 19.4355,
    lng: -99.1544,
    category: "rooftop",
    closing: "Late dinner hours vary; reserve/check same day",
    vibe: "Monumento a la Revolucion view. Not free, but strong skyline/photo payoff.",
    fit: ["rooftop", "photo", "dinner"]
  },
  {
    id: "reforma-222",
    name: "Reforma 222 terrace",
    area: "Juarez",
    address: "Paseo de la Reforma 222",
    lat: 19.4271,
    lng: -99.1622,
    category: "rooftop",
    closing: "Mall hours usually evening; use as flexible free-ish viewpoint",
    vibe: "Easy free-access mall terrace near Zona Rosa and Roma.",
    fit: ["free rooftop", "photo", "quick stop"]
  },
  {
    id: "parque-mexico",
    name: "Parque Mexico",
    area: "Condesa",
    address: "Av. Mexico, Hipodromo",
    lat: 19.4114,
    lng: -99.1692,
    category: "parks",
    closing: "Open-air park",
    vibe: "Low-effort walk, dog watching, benches, Art Deco details, coffee nearby.",
    fit: ["park", "walkable", "morning"]
  },
  {
    id: "alameda",
    name: "Alameda Central",
    area: "Centro",
    address: "Av. Hidalgo",
    lat: 19.4353,
    lng: -99.1436,
    category: "parks",
    closing: "Open-air park",
    vibe: "Classic CDMX park near Bellas Artes, Chinatown, shops, and Centro snack runs.",
    fit: ["park", "photo", "centro"]
  },
  {
    id: "churreria",
    name: "El Moro Roma",
    area: "Roma Norte",
    address: "Frontera 122, Roma Norte",
    lat: 19.4188,
    lng: -99.1609,
    category: "sweet",
    closing: "Late-night churros; check line and current hours",
    vibe: "Obvious sweet treat near home base when the night needs a soft landing.",
    fit: ["sweet treats", "walkable", "late"]
  },
  {
    id: "cardinal",
    name: "Cafe Cardinal",
    area: "Roma Norte",
    address: "Cordoba 132, Roma Norte",
    lat: 19.4186,
    lng: -99.1621,
    category: "cafes",
    closing: "Cafe hours vary; best morning/early afternoon",
    vibe: "Good first-day coffee near the Airbnb without committing to a whole neighborhood jump.",
    fit: ["coffee", "walkable", "morning"]
  },
  {
    id: "maque",
    name: "Maque Roma",
    area: "Roma Norte",
    address: "Orizaba 95, Roma Norte",
    lat: 19.4176,
    lng: -99.1603,
    category: "food",
    closing: "Breakfast/lunch/dinner hours; confirm wait time",
    vibe: "Polished Roma brunch comfort pick for pastries, chilaquiles, and slow morning energy.",
    fit: ["breakfast", "walkable", "food"]
  },
  {
    id: "contramar",
    name: "Contramar",
    area: "Roma Norte",
    address: "Durango 200, Roma Norte",
    lat: 19.4194,
    lng: -99.1701,
    category: "food",
    closing: "Lunch-focused; book or arrive early",
    vibe: "Splurge seafood lunch if you want a proper CDMX classic close to home.",
    fit: ["food", "classic", "date"]
  }
];

const days = [
  {
    id: "thu",
    label: "Thu Jul 23",
    short: "Thu",
    mood: "Arrival + Chapultepec",
    anchor: "12:30 AM LAX -> 5:20 AM MEX",
    focus: ["airbnb", "anthropology", "chapultepec-zoo"],
    blocks: [
      {
        id: "thu-list",
        time: "Thu",
        title: "Arrival + Chapultepec",
        recommended: "",
        closing: "",
        placeIds: ["anthropology"],
        tasks: ["12:30 AM LAX -> 5:20 AM MEX", "Bosque Chapultepec + Anthropology Museum"]
      }
    ]
  },
  {
    id: "fri",
    label: "Fri Jul 24",
    short: "Fri",
    mood: "Frida + Roma bars",
    anchor: "Frida Kahlo Museum at 11:15 AM",
    focus: ["airbnb", "frida", "mercado-89", "roma-bars"],
    blocks: [
      {
        id: "fri-list",
        time: "Fri",
        title: "Frida + Roma bars",
        recommended: "",
        closing: "",
        placeIds: ["frida", "roma-bars"],
        tasks: ["Frida Kahlo Museum 11:15 AM", "Roma Norte bars 10:00 PM"]
      }
    ]
  },
  {
    id: "sat",
    label: "Sat Jul 25",
    short: "Sat",
    mood: "Quetzalcóatl + romantic date",
    anchor: "Parque Quetzalcoatl at 1:15 PM",
    focus: ["airbnb", "quetzalcoatl", "romantic-date"],
    blocks: [
      {
        id: "sat-list",
        time: "Sat",
        title: "Quetzalcóatl + romantic date",
        recommended: "",
        closing: "",
        placeIds: ["quetzalcoatl", "romantic-date"],
        tasks: ["Parque Quetzalcóatl 1:15 PM", "Romantic date"]
      }
    ]
  },
  {
    id: "sun",
    label: "Sun Jul 26",
    short: "Sun",
    mood: "Fly home",
    anchor: "7:55 PM MEX -> 10:50 PM LAX",
    focus: ["airbnb"],
    blocks: [
      {
        id: "sun-list",
        time: "Sun",
        title: "Fly home",
        recommended: "",
        closing: "",
        placeIds: [],
        tasks: ["Open slot", "7:55 PM MEX -> 10:50 PM LAX"]
      }
    ]
  }
];

const categoryIcons = {
  base: Home,
  scheduled: Star,
  collectibles: Store,
  markets: Store,
  cafes: Coffee,
  food: Utensils,
  sweet: Heart,
  parks: MapPin,
  rooftop: Navigation,
  photo: Sparkles,
  search: Sparkles
};

const initialState = {
  checked: {},
  saved: [
    "airbnb",
    "biblioteca-vasconcelos",
    "casa-snoopy",
    "hello-kitty-cafe",
    "mibimbo",
    "lagunilla",
    "mercado-89",
    "chapultepec-zoo",
    "anthropology",
    "frida",
    "roma-bars",
    "quetzalcoatl",
    "romantic-date"
  ],
  notes: {},
  customPlaces: []
};
const defaultSavedIds = initialState.saved;
const storageKey = "cdmx-trip-state-v5";

function mapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address} Mexico City`)}`;
}

function distanceKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function travelAdvice(origin, place) {
  const km = distanceKm(origin, place);
  if (place.id === "quetzalcoatl" || km > 9) return { mode: "Uber", icon: Navigation, eta: `${Math.max(18, Math.round(km * 4))}-${Math.max(30, Math.round(km * 7))} min`, detail: `${km.toFixed(1)} km` };
  if (km <= 1.2) return { mode: "Walk", icon: MapPin, eta: `${Math.max(2, Math.round(km * 13))} min`, detail: km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km` };
  if (km <= 5.5) return { mode: "Transit", icon: TramFront, eta: `${Math.max(12, Math.round(km * 7))}-${Math.max(18, Math.round(km * 10))} min`, detail: `${km.toFixed(1)} km` };
  return { mode: "Uber", icon: Navigation, eta: `${Math.max(16, Math.round(km * 4))}-${Math.max(25, Math.round(km * 6))} min`, detail: `${km.toFixed(1)} km` };
}

function getMarkerPosition(place) {
  const bounds = { minLat: 19.34, maxLat: 19.47, minLng: -99.28, maxLng: -99.12 };
  const x = ((place.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = (1 - (place.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
  return { left: `${Math.min(94, Math.max(4, x))}%`, top: `${Math.min(92, Math.max(6, y))}%` };
}

function App() {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  });
  const [view, setView] = useState("map");
  const [itineraryTab, setItineraryTab] = useState("thu");
  const [mapDay, setMapDay] = useState("all");
  const [selectedPlaceId, setSelectedPlaceId] = useState("airbnb");
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState("local");
  const [position, setPosition] = useState(null);
  const [originMode, setOriginMode] = useState("home");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle");

  const allPlaces = useMemo(() => {
    const customPlaces = (state.customPlaces || []).map((place) => ({ ...place, custom: true }));
    return [base, ...places.filter((place) => place.id !== "airbnb"), ...customPlaces];
  }, [state.customPlaces]);
  const itineraryDay = days.find((day) => day.id === itineraryTab) || days[0];
  const selectedPlace = [...allPlaces, ...searchResults].find((place) => place.id === selectedPlaceId) || base;
  const origin = originMode === "current" && position ? position : base;

  const approvedPlaces = useMemo(() => {
    const approved = new Set([...(state.saved || []), ...defaultSavedIds]);
    return allPlaces.filter((place) => approved.has(place.id));
  }, [allPlaces, state.saved]);

  const dayPlaces = useMemo(() => {
    if (mapDay === "all") return approvedPlaces;
    const day = days.find((item) => item.id === mapDay) || days[0];
    return approvedPlaces.filter((place) => day.focus.includes(place.id) || place.dayId === mapDay);
  }, [approvedPlaces, mapDay]);

  const mapPlaces = dayPlaces;
  const mapDisplayPlaces = useMemo(() => [...mapPlaces, ...searchResults], [mapPlaces, searchResults]);
  const savedPlaces = approvedPlaces;
  const recommendedPlaces = useMemo(() => {
    const approved = new Set(approvedPlaces.map((place) => place.id));
    return allPlaces.filter((place) => !approved.has(place.id)).slice(0, 8);
  }, [allPlaces, approvedPlaces]);

  const selectedAdvice = travelAdvice(origin, selectedPlace);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const update = (geo) => {
      setPosition({ lat: geo.coords.latitude, lng: geo.coords.longitude, name: "Current location" });
    };
    navigator.geolocation.getCurrentPosition(update, () => {}, { enableHighAccuracy: true, timeout: 7000 });
    const watchId = navigator.geolocation.watchPosition(update, () => {}, {
      enableHighAccuracy: true,
      maximumAge: 15000,
      timeout: 10000
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function pull() {
      try {
        const response = await fetch("/api/state");
        if (!response.ok) throw new Error("No sync server");
        const remote = await response.json();
        if (!ignore && remote.updatedAt) {
          setState((current) => (remote.updatedAt > (current.updatedAt || 0) ? { ...current, ...remote } : current));
        }
        if (!ignore) setSyncStatus("online");
      } catch {
        if (!ignore) setSyncStatus("local");
      }
    }
    pull();
    const timer = window.setInterval(pull, 8000);
    return () => {
      ignore = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapNode.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapNode.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [base.lng, base.lat],
      zoom: 11.4,
      attributionControl: false
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
  }, []);

  useEffect(() => {
    const search = query.trim();
    if (!search) {
      setSearchResults([]);
      setSearchStatus("idle");
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSearchStatus("searching");
      const searchCenter = originMode === "current" && position ? position : selectedPlace || base;
      const proximity = `${searchCenter.lng},${searchCenter.lat}`;
      try {
        if (!MAPBOX_TOKEN) throw new Error("Missing Mapbox token");
        const params = new URLSearchParams({
          q: search,
          access_token: MAPBOX_TOKEN,
          bbox: "-99.30,19.32,-99.10,19.50",
          proximity,
          limit: "6",
          language: "en"
        });
        const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`);
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        if (cancelled) return;
        const results = (data.features || []).map((feature) => {
          const [lng, lat] = feature.geometry?.coordinates || [base.lng, base.lat];
          return {
            id: `search-${feature.properties?.mapbox_id || feature.id || `${lng},${lat}`}`,
            name: feature.properties?.name || feature.properties?.full_address || search,
            area: feature.properties?.place_formatted || "Search result",
            address: feature.properties?.full_address || feature.properties?.place_formatted || "Search result",
            lat,
            lng,
            category: "search",
            closing: "Search result",
            vibe: "Found from map search.",
            fit: ["search"],
            searchResult: true
          };
        });
        setSearchResults(results);
        setSearchStatus(results.length ? "done" : "empty");
      } catch {
        if (cancelled) return;
        const local = allPlaces.filter((place) => `${place.name} ${place.area} ${place.fit.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
        setSearchResults(local.slice(0, 6).map((place) => ({ ...place, searchResult: true })));
        setSearchStatus(local.length ? "local" : "empty");
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, origin.lat, origin.lng, allPlaces]);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = mapDisplayPlaces.map((place) => {
      const element = document.createElement("button");
      element.className = `real-pin ${place.id === selectedPlaceId ? "selected" : ""} ${place.category}`;
      element.setAttribute("aria-label", place.name);
      element.textContent = place.id === "airbnb" ? "H" : place.category === "scheduled" ? "★" : place.searchResult ? "?" : "•";
      element.addEventListener("click", () => {
        setSelectedPlaceId(place.id);
        setPanelOpen(true);
      });
      const marker = new mapboxgl.Marker(element)
        .setLngLat([place.lng, place.lat])
        .addTo(mapRef.current);
      return marker;
    });
    if (mapDisplayPlaces.length) {
      const bounds = new mapboxgl.LngLatBounds();
      mapDisplayPlaces.forEach((place) => bounds.extend([place.lng, place.lat]));
      mapRef.current.fitBounds(bounds, {
        padding: { top: 110, bottom: panelOpen ? 340 : 120, left: 48, right: 48 },
        maxZoom: 13.5,
        duration: 600
      });
    }
  }, [mapDisplayPlaces, selectedPlaceId, panelOpen]);

  async function push(nextState) {
    setState(nextState);
    try {
      const response = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState)
      });
      if (!response.ok) throw new Error("Sync unavailable");
      const remote = await response.json();
      setState((current) => ({ ...current, ...remote }));
      setSyncStatus("online");
    } catch {
      setSyncStatus("local");
    }
  }

  function toggleTask(blockId, task) {
    const id = `${blockId}:${task}`;
    push({ ...state, checked: { ...state.checked, [id]: !state.checked[id] }, updatedAt: Date.now() });
  }

  function toggleSave(placeId) {
    const place = [...allPlaces, ...searchResults].find((item) => item.id === placeId);
    if (place?.searchResult && !state.saved.includes(place.id)) {
      const savedPlace = {
        ...place,
        id: `custom-${Date.now()}`,
        searchResult: false,
        custom: true,
        dayId: mapDay === "all" ? null : mapDay,
        closing: "Verify hours",
        vibe: "Saved from map search.",
        fit: ["saved", "search"]
      };
      push({
        ...state,
        saved: [...new Set([...(state.saved || []), savedPlace.id])],
        customPlaces: [...(state.customPlaces || []), savedPlace],
        updatedAt: Date.now()
      });
      setSelectedPlaceId(savedPlace.id);
      return;
    }

    const saved = state.saved.includes(placeId) ? state.saved.filter((id) => id !== placeId) : [...state.saved, placeId];
    push({ ...state, saved, updatedAt: Date.now() });
  }

  function locateMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        const next = { lat: geo.coords.latitude, lng: geo.coords.longitude, name: "Current position" };
        setPosition(next);
        setOriginMode("current");
        if (mapRef.current) mapRef.current.flyTo({ center: [next.lng, next.lat], zoom: 13.5 });
      },
      () => setPosition(base),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function dayProgress(day) {
    const tasks = day.blocks.flatMap((block) => block.tasks.map((task) => `${block.id}:${task}`));
    return `${tasks.filter((id) => state.checked[id]).length}/${tasks.length}`;
  }

  const mapFilterDays = [{ id: "all", short: "All", label: "All trip" }, ...days];
  const activeMapLabel = mapFilterDays.find((day) => day.id === mapDay)?.label || "All trip";

  return (
    <main className={`app-shell ${view === "map" ? "map-mode" : "itinerary-mode"}`}>
      <header className="app-header">
        <div>
          <p>Jordan & Alejandra · CDMX</p>
          <h1>{view === "map" ? "Trip map" : "Itinerary"}</h1>
        </div>
        {view === "map" && (
          <div className={`sync ${syncStatus}`}>
            {syncStatus === "online" ? <Wifi size={15} /> : <WifiOff size={15} />}
            <span>{syncStatus === "online" ? "Synced" : "Local"}</span>
          </div>
        )}
      </header>

      <nav className="view-tabs" aria-label="App views">
        <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
          <Map size={18} />
          Map
        </button>
        <button className={view === "itinerary" ? "active" : ""} onClick={() => setView("itinerary")}>
          <CalendarDays size={18} />
          Itinerary
        </button>
      </nav>

      {view === "itinerary" ? (
        <section className="screen itinerary-screen">
          <div className="day-switcher">
            {days.map((day) => (
              <button key={day.id} className={day.id === itineraryTab ? "active" : ""} onClick={() => setItineraryTab(day.id)}>
                <span>{day.short}</span>
                <small>{dayProgress(day)}</small>
              </button>
            ))}
            <button className={itineraryTab === "saved" ? "active" : ""} onClick={() => setItineraryTab("saved")}>
              <span>Saved</span>
              <small>{savedPlaces.length}</small>
            </button>
          </div>

          {itineraryTab === "saved" ? (
            <div className="simple-list">
              <h2>Saved places</h2>
              {savedPlaces.length === 0 ? (
                <p className="empty-state">Heart places on the map to keep them here.</p>
              ) : savedPlaces.map((place) => (
                <button key={place.id} onClick={() => toggleSave(place.id)}>
                  <span><Heart size={15} fill="currentColor" /></span>
                  <strong>{place.id === "airbnb" ? "Home" : place.name}</strong>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="day-heading simple">
                <p>{itineraryDay.label}</p>
                <h2>{itineraryDay.mood}</h2>
              </div>

              <div className="simple-list">
                {itineraryDay.blocks.map((block) => (
                  <section key={block.id}>
                    <h3>{block.time}</h3>
                    {block.tasks.map((task) => {
                      const id = `${block.id}:${task}`;
                      return (
                        <label key={id} className={state.checked[id] ? "done" : ""}>
                          <input type="checkbox" checked={Boolean(state.checked[id])} onChange={() => toggleTask(block.id, task)} />
                          <span><Check size={14} /></span>
                          <strong>{task}</strong>
                        </label>
                      );
                    })}
                  </section>
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="screen map-screen">
          <div className="map-toolbar">
            <div className="day-pills">
              {mapFilterDays.map((day) => (
                <button key={day.id} className={day.id === mapDay ? "active" : ""} onClick={() => setMapDay(day.id)}>
                  {day.short}
                </button>
              ))}
            </div>
            <div className="origin-toggle">
              <button className={originMode === "home" ? "active" : ""} onClick={() => setOriginMode("home")} aria-label="Use home">
                <Home size={16} />
              </button>
              <button className={originMode === "current" ? "active" : ""} onClick={locateMe} aria-label="Use current position">
                <Crosshair size={16} />
              </button>
            </div>
          </div>

          {MAPBOX_TOKEN ? (
            <div className="mapbox" ref={mapNode} />
          ) : (
            <div className="fallback-map">
              <div className="map-label centro">Centro</div>
              <div className="map-label roma">Roma</div>
              <div className="map-label coyo">Coyoacan</div>
              <div className="map-label nau">Naucalpan</div>
              {mapDisplayPlaces.map((place) => (
                <button
                  key={place.id}
                  className={`fallback-pin ${place.id === selectedPlaceId ? "selected" : ""} ${place.category}`}
                  style={getMarkerPosition(place)}
                  onClick={() => {
                    setSelectedPlaceId(place.id);
                    setPanelOpen(true);
                  }}
                  title={place.name}
                >
                  {place.id === "airbnb" ? <Home size={14} /> : <MapPin size={14} />}
                </button>
              ))}
            </div>
          )}

          <aside className={`map-drawer ${panelOpen ? "open" : "closed"}`}>
            <button className="drawer-handle" onClick={() => setPanelOpen(!panelOpen)}>
              <ChevronDown size={18} />
              <span>{panelOpen ? `${activeMapLabel}: ${mapPlaces.length} spots` : `${activeMapLabel}: spots`}</span>
            </button>

            <div className="drawer-body">
              <img className="place-photo" src={selectedPlace.photo || base.photo} alt="" />
              <div className="compact-place">
                <div className="place-icon">
                  {selectedPlace.id === "airbnb" ? <Home size={17} /> : React.createElement(categoryIcons[selectedPlace.category] || MapPin, { size: 17 })}
                </div>
                <div>
                  <strong>{selectedPlace.id === "airbnb" ? "Home" : selectedPlace.name}</strong>
                  <span>{selectedAdvice.eta} · {selectedAdvice.detail} · {selectedAdvice.mode} from {originMode === "current" && position ? "Here" : "Home"}</span>
                </div>
                <button className="icon-button" onClick={() => toggleSave(selectedPlace.id)} aria-label="Save place">
                  <Heart size={17} fill={state.saved.includes(selectedPlace.id) ? "currentColor" : "none"} />
                </button>
                <a className="tiny-directions" href={mapsUrl(selectedPlace)} target="_blank" rel="noreferrer" aria-label="Open directions">
                  <ExternalLink size={16} />
                </a>
              </div>

              <label className="search-box">
                <Search size={17} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search near ${originMode === "current" && position ? "here" : selectedPlace.id === "airbnb" ? "home" : selectedPlace.name}`} />
              </label>

              <div className="recommendations">
                {query.trim() && (
                  <div className="result-section">
                    <p>{searchStatus === "searching" ? "Searching..." : "Search results"}</p>
                    {searchResults.length === 0 && searchStatus !== "searching" ? (
                      <div className="empty-state">No places found yet.</div>
                    ) : searchResults.map((place) => {
                      const Icon = categoryIcons[place.category] || Sparkles;
                      const advice = travelAdvice(origin, place);
                      return (
                        <button key={place.id} className={place.id === selectedPlaceId ? "active" : ""} onClick={() => setSelectedPlaceId(place.id)}>
                          <Icon size={17} />
                          <span>
                            <strong>{place.name}</strong>
                            <small>{advice.eta} · {advice.mode} · {place.area}</small>
                          </span>
                          <i onClick={(event) => {
                            event.stopPropagation();
                            toggleSave(place.id);
                          }}>
                            <Heart size={16} fill={state.saved.includes(place.id) ? "currentColor" : "none"} />
                          </i>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!query.trim() && recommendedPlaces.length > 0 && (
                  <div className="result-section">
                    <p>Recommendations to approve</p>
                    {recommendedPlaces.map((place) => {
                      const Icon = categoryIcons[place.category] || Sparkles;
                      const advice = travelAdvice(origin, place);
                      return (
                        <button key={place.id} onClick={() => setSelectedPlaceId(place.id)}>
                          <Icon size={17} />
                          <span>
                            <strong>{place.name}</strong>
                            <small>{advice.eta} · {advice.mode} · heart to map</small>
                          </span>
                          <i onClick={(event) => {
                            event.stopPropagation();
                            toggleSave(place.id);
                          }}>
                            <Heart size={16} />
                          </i>
                        </button>
                      );
                    })}
                  </div>
                )}

                {mapPlaces.length === 0 ? (
                  <div className="empty-state">
                    No mapped spots for this filter.
                  </div>
                ) : mapPlaces.map((place) => {
                  const Icon = categoryIcons[place.category] || Star;
                  const advice = travelAdvice(origin, place);
                  return (
                    <button
                      key={place.id}
                      className={place.id === selectedPlaceId ? "active" : ""}
                      onClick={() => {
                        setSelectedPlaceId(place.id);
                        setPanelOpen(true);
                      }}
                    >
                      <Icon size={17} />
                      <span>
                        <strong>{place.id === "airbnb" ? "Home" : place.name}</strong>
                        <small>{advice.eta} · {advice.mode} from {originMode === "current" && position ? "Here" : "Home"}</small>
                      </span>
                      <i onClick={(event) => {
                        event.stopPropagation();
                        toggleSave(place.id);
                      }}>
                        <Heart size={16} fill={state.saved.includes(place.id) ? "currentColor" : "none"} />
                      </i>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
