import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTerrains } from "../services/api";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem, ScrollReveal } from "@/components/animate";
import "./TerrainMarketplace.css";

export default function TerrainMarketplace() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [sort, setSort]         = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    getTerrains()
      .then((res) => setTerrains(res.data))
      .catch(() => setTerrains([]))
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
                    <span>🏞️</span>
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
                        state: { region: terrain.region, surface: terrain.surface },
                      })
                    }
                  >
                    Choisir ce terrain →
                  </AnimatedButton>
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
