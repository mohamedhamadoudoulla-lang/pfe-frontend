import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import { ShoppingCart, Check, X, Trash2 } from "lucide-react";
import "./EquipmentMarketplace.css";

const CATEGORIES = [
  { key: "all",           label: "Tout",          icon: "📦" },
  { key: "salon",         label: "Salon",          icon: "🛋️" },
  { key: "chambre",       label: "Chambre",        icon: "🛏️" },
  { key: "cuisine",       label: "Cuisine",        icon: "🍳" },
  { key: "salle_de_bain", label: "Salle de bain",  icon: "🚿" },
  { key: "bureau",        label: "Bureau",         icon: "💼" },
];

export default function EquipmentMarketplace() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [quality, setQuality]     = useState("all");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState([]);

  useEffect(() => {
    API.get("/furniture")
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (state?.preselected) {
      const ids = state.preselected.map((p) => p._id || p.id);
      setSelected((prev) => {
        const existing = new Set(prev.map((s) => s._id || s.id));
        const toAdd = state.preselected.filter((p) => !existing.has(p._id || p.id));
        return [...prev, ...toAdd];
      });
    }
  }, [state?.preselected]);

  const toggleItem = (item) => {
    setSelected((prev) => {
      const id = item._id;
      const exists = prev.find((s) => s._id === id);
      return exists ? prev.filter((s) => s._id !== id) : [...prev, item];
    });
  };

  const filtered = items.filter((item) => {
    const matchCat     = filter  === "all" || item.category     === filter;
    const matchQuality = quality === "all" || item.qualityLevel === quality;
    const matchSearch  = item.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuality && matchSearch;
  });

  const totalSelected = selected.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleValidate = () => {
    if (selected.length === 0) {
      toast.error("Sélectionnez au moins un produit");
      return;
    }
    navigate("/devis", {
      state: {
        ...state,
        selectedProducts: selected,
      },
    });
  };

  if (loading) return (
    <div className="eqm-loading">
      <div className="eqm-spinner"></div>
      <p>Chargement des équipements...</p>
    </div>
  );

  return (
    <div className="eqm-page">

      {/* ── Hero ── */}
      <div className="eqm-hero">
        <h1>🛋️ Sélection des produits</h1>
        <p>Choisissez les équipements et meubles pour votre maison</p>
        <div className="eqm-hero-stats">
          <span>{items.length} produits disponibles</span>
          <span>•</span>
          <span>{selected.length} sélectionné(s)</span>
        </div>
      </div>

      {/* ── Cart Bar ── */}
      {selected.length > 0 && (
        <div className="eqm-cart-bar">
          <div className="eqm-cart-info">
            <ShoppingCart size={20} />
            <span><strong>{selected.length}</strong> produit(s) sélectionné(s)</span>
            <span className="eqm-cart-total">{totalSelected.toLocaleString()} DT</span>
          </div>
          <div className="eqm-cart-actions">
            <AnimatedButton className="eqm-cart-clear" variant="destructive" onClick={() => setSelected([])}>
              <Trash2 size={16} />
              Tout effacer
            </AnimatedButton>
            <AnimatedButton className="eqm-cart-validate" variant="primary" onClick={handleValidate}>
              <Check size={16} />
              Valider la sélection →  
            </AnimatedButton>
          </div>
        </div>
      )}

      {/* ── Filtres ── */}
      <div className="eqm-filters">
        <div className="eqm-search">
          <span>🔍</span>
          <input type="text" placeholder="Rechercher un produit..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="eqm-cat-btns">
          {CATEGORIES.map((cat) => (
            <AnimatedButton key={cat.key} className={`eqm-cat-btn ${filter === cat.key ? "active" : ""}`} onClick={() => setFilter(cat.key)}>
              {cat.icon} {cat.label}
            </AnimatedButton>
          ))}
        </div>
        <div className="eqm-quality-btns">
          {["all", "économique", "standard", "haut de gamme"].map((q) => (
            <AnimatedButton key={q} className={`eqm-quality-btn ${quality === q ? "active" : ""}`} onClick={() => setQuality(q)}>
              {q === "all" ? "Toutes qualités" : q}
            </AnimatedButton>
          ))}
        </div>
      </div>

      {/* ── Résultats ── */}
      <div className="eqm-results-bar">
        <span>{filtered.length} résultat(s)</span>
      </div>

      {filtered.length === 0 ? (
        <div className="eqm-empty">
          <span>📭</span>
          <h3>Aucun produit trouvé</h3>
          <p>Essayez une autre catégorie ou un autre mot-clé.</p>
        </div>
      ) : (
        <div className="eqm-grid">
          {filtered.map((item, i) => {
            const cat = CATEGORIES.find((c) => c.key === item.category);
            const isSelected = selected.some((s) => s._id === item._id);
            return (
              <ScrollReveal key={item._id} delay={i * 0.05} direction="up">
                <AnimatedCard
                  className={`eqm-card ${isSelected ? "selected" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleItem(item)}
                >
                  <div className="eqm-card-check">
                    {isSelected ? (
                      <span className="eqm-check-on"><Check size={16} /></span>
                    ) : (
                      <span className="eqm-check-off" />
                    )}
                  </div>
                  <div className="eqm-card-img">
                    <span>{cat?.icon || "📦"}</span>
                    <div className={`eqm-quality-tag quality-${item.qualityLevel?.replace(" ", "-")}`}>
                      {item.qualityLevel}
                    </div>
                  </div>
                  <div className="eqm-card-body">
                    <h3>{item.name}</h3>
                    <p className="eqm-category">{cat?.label || item.category}</p>
                    {item.description && <p className="eqm-desc">{item.description}</p>}
                    <div className="eqm-card-footer">
                      <span className="eqm-price">{Number(item.price).toLocaleString()} DT</span>
                      {item.seller?.name && <span className="eqm-seller">🏪 {item.seller.name}</span>}
                    </div>
                  </div>
                </AnimatedCard>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}