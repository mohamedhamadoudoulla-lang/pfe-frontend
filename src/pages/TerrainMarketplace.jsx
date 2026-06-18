import { useState, useEffect } from "react";
import { getTerrains } from "../services/api";
import PageShell from "../components/ui/PageShell";
import SearchBar from "../components/ui/SearchBar";
import TerrainCard from "../components/ui/TerrainCard";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_TERRAINS = [
  {
    _id: "terrain-fallback-1",
    title: "Terrain habitation ind. en vente",
    region: "Kairouan",
    city: "Kairouan",
    surface: 447,
    pricePerM2: 738,
    totalPrice: 330000,
    description: "A vendre, un terrain d'habitation d'une superficie de 447 m2, beneficiant d'un emplacement ideal dans un quartier residentiel calme et securise.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Kairouan Invest Sarl", phone: "+21628842842" },
  },
  {
    _id: "terrain-fallback-2",
    title: "Terrain habitation ind. en vente",
    region: "Sfax",
    city: "Route Gremda",
    surface: 1052,
    pricePerM2: 309,
    totalPrice: 325000,
    description: "Ce terrain de superficie 1052 m2, situe dans un quartier calme et residentiel a route de Gremda km7, dispose de deux faades.",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Tecnocasa Sfax", phone: "+21674400000" },
  },
  {
    _id: "terrain-fallback-3",
    title: "Terrain habitation collective en vente",
    region: "Sfax",
    city: "Route De Tunis",
    surface: 920,
    pricePerM2: 701,
    totalPrice: 645000,
    description: "Ce terrain de superficie 920 m2 est situe sur la ceinture Bourguiba, route de Tunis km3.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Tecnocasa Sfax", phone: "+21674400000" },
  },
  {
    _id: "terrain-fallback-4",
    title: "Grand terrain constructible",
    region: "Tunis",
    city: "La Marsa",
    surface: 800,
    pricePerM2: 1200,
    totalPrice: 960000,
    description: "Terrain premium situe dans le quartier le plus pris de La Marsa, ideal pour un projet residentiel de standing.",
    images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Tunis Immobilier", phone: "+21671000000" },
  },
  {
    _id: "terrain-fallback-5",
    title: "Terrain agricole et residentiel",
    region: "Sousse",
    city: "Kantaoui",
    surface: 1500,
    pricePerM2: 200,
    totalPrice: 300000,
    description: "Terrain mixte a proximite de la zone touristique de Kantaoui. Superficie 1500m2, ideal pour projet residentiel ou agricole.",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Sousse Invest", phone: "+21673000000" },
  },
];

const SORT_OPTIONS = [
  { value: "default", label: "Defaut" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix decroissant" },
  { value: "surface", label: "Surface" },
];

export default function TerrainMarketplace() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    getTerrains()
      .then((res) => setTerrains(res.data.length > 0 ? res.data : FALLBACK_TERRAINS))
      .catch(() => setTerrains(FALLBACK_TERRAINS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = terrains
    .filter((t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.region?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return (a.pricePerM2 || 0) - (b.pricePerM2 || 0);
      if (sort === "price-desc") return (b.pricePerM2 || 0) - (a.pricePerM2 || 0);
      if (sort === "surface") return (b.surface || 0) - (a.surface || 0);
      return 0;
    });

  const stats = [
    { label: "Terrains disponibles", value: terrains.length, helper: "A vendre en Tunisie" },
    { label: "Regions couvertes", value: new Set(terrains.map(t => t.region)).size, helper: "Partout en Tunisie" },
    { label: "Vendeurs verifies", value: new Set(terrains.map(t => t.seller?.name)).size, helper: "Professionnels" },
  ];

  const handleChooseTerrain = (terrain) => {
    localStorage.setItem("selectedTerrainId", terrain._id);
    localStorage.setItem("selectedTerrain", JSON.stringify(terrain));
    window.location.href = "/terrain-location";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#3b82f6]" />
          <p className="text-sm text-gray-500">Chargement des terrains...</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      eyebrow="Marche immobilier"
      title="Terrains disponibles"
      subtitle="Decouvrez tous les terrains a vendre en Tunisie"
      stats={stats}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher par titre ou region..."
          />
        </div>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                sort === opt.value
                  ? "bg-[#1f1f1f] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-400">
        {filtered.length} resultat(s)
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${search}-${sort}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 py-20">
              <p className="text-base font-medium text-gray-500">Aucun terrain disponible</p>
              <p className="mt-1 text-sm text-gray-400">Essayez d'elargir votre recherche</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((terrain) => (
                <TerrainCard
                  key={terrain._id}
                  terrain={terrain}
                  onChoose={handleChooseTerrain}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}
