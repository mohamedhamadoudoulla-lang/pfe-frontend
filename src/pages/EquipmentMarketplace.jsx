import { useState, useEffect } from "react";
import API from "../services/api";
import ProduitCard from "../components/ProduitCard";
import "./EquipmentMarketplace.css";

const CATEGORIES = [
  { key: "all", label: "Tout", icon: "" },
  { key: "carrelage", label: "Carrelage", icon: "" },
  { key: "peinture", label: "Peinture", icon: "" },
  { key: "portes_interieures", label: "Portes interieures", icon: "" },
  { key: "portes_exterieures", label: "Portes exterieures", icon: "" },
  { key: "fenetres", label: "Fenetres", icon: "" },
  { key: "cuisine", label: "Cuisine", icon: "" },
  { key: "sanitaires", label: "Sanitaires", icon: "" },
  { key: "electricite", label: "Electricite", icon: "" },
  { key: "eclairage", label: "Eclairage", icon: "" },
  { key: "plomberie", label: "Plomberie", icon: "" },
  { key: "faux_plafond", label: "Faux plafond", icon: "" },
  { key: "climatisation", label: "Climatisation", icon: "" },
  { key: "revetements", label: "Revetements", icon: "" },
  { key: "menuiserie", label: "Menuiserie", icon: "" },
];

export default function EquipmentMarketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [quality, setQuality] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/equipment")
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = filter === "all" || item.category === filter;
    const matchQuality = quality === "all" || item.qualityLevel === quality;
    const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuality && matchSearch;
  });

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Chargement des equipements...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", padding: "32px 24px", color: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Equipements de construction</h1>
          <p style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>Choisissez les equipements pour votre maison</p>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13 }}>
            <span>{items.length} produits disponibles</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 60px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Rechercher un equipement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14 }}>
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
          </select>
          <select value={quality} onChange={(e) => setQuality(e.target.value)} style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14 }}>
            <option value="all">Toutes qualites</option>
            <option value="economique">Economique</option>
            <option value="standard">Standard</option>
            <option value="haut de gamme">Haut de gamme</option>
          </select>
        </div>

        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>{filtered.length} resultat(s)</p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 14, border: "2px dashed #e5e7eb" }}>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>Aucun equipement trouve</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filtered.map((item) => (
              <ProduitCard
                key={item._id}
                produit={{
                  _id: item._id,
                  name: item.name,
                  nom: item.name,
                  image: item.image,
                  description: item.description,
                  price: item.price,
                  prix: item.price,
                  category: item.category,
                  qualityLevel: item.qualityLevel,
                  shopName: item.shopName,
                  seller: item.seller,
                  unit: item.unit,
                  isAvailable: item.isActive,
                }}
                type="equipement"
                onAjoutPanier={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
