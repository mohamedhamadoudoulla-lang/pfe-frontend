import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTerrains } from "../services/api";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem, ScrollReveal } from "@/components/animate";
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
    description: "À vendre, un terrain d'habitation d'une superficie de 447 m², bénéficiant d'un emplacement idéal dans un quartier résidentiel calme et sécurisé.",
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
    description: "Ce terrain de superficie 1052 m², situé dans un quartier calme et résidentiel à route de Gremda km7, dispose de deux façades.",
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
    description: "Ce terrain de superficie 920 m² est situé sur la ceinture Bourguiba, route de Tunis km3.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Tecnocasa Sfax", phone: "+21674400000" },
  },
];

export default function TerrainMarketplace() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [sort, setSort]         = useState("default");
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
      if (sort === "price-asc")  return (a.pricePerM2 || 0) - (b.pricePerM2 || 0);
      if (sort === "price-desc") return (b.pricePerM2 || 0) - (a.pricePerM2 || 0);
      if (sort === "surface")    return (b.surface || 0)    - (a.surface || 0);
      return 0;
    });

  if (loading) return <div className="loading">Chargement des terrains...</div>;

  return (
    <div className="terrain-marketplace-page">

      {/* ── Hero ── */}
      <div className="page-header">
        <h1>🏞️ Terrains disponibles</h1>
        <p>Découvrez tous les terrains à vendre en Tunisie</p>
      </div>

      {/* ── Stats bar ── */}
      <div className="tm-stats-bar">
        <div className="tm-stat"><span>📦</span><strong>{terrains.length}</strong> terrains listés</div>
        <div className="tm-stat"><span>📍</span><strong>{new Set(terrains.map(t => t.region)).size}</strong> régions</div>
        <div className="tm-stat"><span>✅</span> Vendeurs vérifiés</div>
      </div>

      {/* ── Filters ── */}
      <div className="tm-filter-bar">
        <div className="tm-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Rechercher par titre ou région..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="tm-sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Trier par défaut</option>
          <option value="price-asc">Prix/m² croissant</option>
          <option value="price-desc">Prix/m² décroissant</option>
          <option value="surface">Surface décroissante</option>
        </select>
      </div>

      <div className="tm-results-count">{filtered.length} résultat(s)</div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Aucun terrain disponible pour le moment</p>
        </div>
      ) : (
        <div className="terrains-container">
          <div className="terrains-grid">
            {filtered.map((terrain, i) => (
              <ScrollReveal key={terrain._id} delay={i * 0.1} direction="up">
                <AnimatedCard className="terrain-card" whileHover={{ scale: 1.02 }}>
                  {/* Image placeholder — remplacer par <img> quand dispo */}
                  <div className="terrain-card-img">
                    {terrain.images?.[0] ? (
                      <img src={terrain.images[0]} alt={terrain.title} className="terrain-card-image" />
                    ) : (
                      <span>🏞️</span>
                    )}
                    <div className="terrain-region-tag">📍 {terrain.region}</div>
                  </div>

                  <div className="terrain-header">
                    <h3>{terrain.title}</h3>
                  </div>

                  <div className="terrain-details">
                    <div className="detail-row">
                      <span>Surface</span>
                      <strong>{terrain.surface} m²</strong>
                    </div>
                    <div className="detail-row">
                      <span>Prix / m²</span>
                      <strong>{terrain.pricePerM2} DT</strong>
                    </div>
                    <div className="detail-row">
                      <span>Prix total</span>
                      <strong>{terrain.totalPrice?.toLocaleString()} DT</strong>
                    </div>
                  </div>

                  {terrain.description && (
                    <p className="description">{terrain.description}</p>
                  )}

                  <div className="seller-info">
                    <span>🏪 {terrain.seller?.name || "Vendeur"}</span>
                    {terrain.seller?.phone && <span>📞 {terrain.seller.phone}</span>}
                  </div>

                  <AnimatedButton
                    className="select-btn"
                    variant="primary"
                    onClick={() =>
                      navigate("/terrain/estimation", {
                        state: { terrain: terrain, region: terrain.region, surface: terrain.surface },
                      })
                    }
                  >
                    Choisir ce terrain →
                  </AnimatedButton>
                  <Link to={`/terrain/${terrain._id}`} className="tm-detail-link">
                    Voir détails →
                  </Link>
                </AnimatedCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      <div className="back-button">
        <button onClick={() => navigate("/terrain/localisation")} className="btn-back">
          ← Retour à la localisation
        </button>
      </div>
    </div>
  );
}
