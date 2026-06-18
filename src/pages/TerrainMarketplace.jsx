import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTerrains } from "../services/api";
import ProduitCard from "../components/ProduitCard";
import { ArrowLeft } from "lucide-react";
import "./TerrainMarketplace.css";

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

export default function TerrainMarketplace() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const navigate = useNavigate();

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

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Chargement des terrains...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", padding: "32px 24px", color: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={16} /> Retour
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Terrains disponibles</h1>
          <p style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>Decouvrez tous les terrains a vendre en Tunisie</p>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13 }}>
            <span>{terrains.length} terrains listes</span>
            <span>•</span>
            <span>{new Set(terrains.map(t => t.region)).size} regions</span>
            <span>•</span>
            <span>Vendeurs verifies</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 60px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Rechercher par titre ou region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14 }}>
            <option value="default">Trier par defaut</option>
            <option value="price-asc">Prix/m2 croissant</option>
            <option value="price-desc">Prix/m2 decroissant</option>
            <option value="surface">Surface decroissante</option>
          </select>
        </div>

        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>{filtered.length} resultat(s)</p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 14, border: "2px dashed #e5e7eb" }}>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>Aucun terrain disponible</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map((terrain) => (
              <ProduitCard
                key={terrain._id}
                produit={{
                  _id: terrain._id,
                  nom: terrain.title,
                  titre: terrain.title,
                  image: terrain.images?.[0],
                  images: terrain.images,
                  description: terrain.description,
                  surface: terrain.surface,
                  pricePerM2: terrain.pricePerM2,
                  totalPrice: terrain.totalPrice || (terrain.surface * terrain.pricePerM2),
                  city: terrain.city,
                  region: terrain.region,
                  seller: terrain.seller,
                  isAvailable: terrain.isAvailable,
                }}
                type="terrain"
                onAjoutPanier={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
