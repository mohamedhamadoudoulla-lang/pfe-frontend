import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Sofa, Check, ArrowRight, ArrowLeft, Loader, Image } from "lucide-react";
import "./Furnishing.css";

const QUALITY_LEVELS = [
  { key: "economique", label: "Economique", color: "#10b981" },
  { key: "standard", label: "Standard", color: "#3b82f6" },
  { key: "haut de gamme", label: "Haut de gamme", color: "#8b5cf6" },
];

const ROOM_CATEGORIES = ["salon", "chambre", "cuisine", "salle_de_bain", "bureau"];

const ROOM_LABELS = {
  salon: "Salon",
  chambre: "Chambre",
  cuisine: "Cuisine",
  salle_de_bain: "Salle de bain",
  bureau: "Bureau",
};

export default function Furnishing() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(
    state?.construction?.finitionLevel || "standard"
  );
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const region = state?.terrainInput?.region || "Tunis";
    API.get(`/pricing/package?finition=${selectedQuality}&region=${encodeURIComponent(region)}`)
      .then((res) => {
        setItems(res.data.items || []);
        setSelectedIds(new Set(res.data.items.map((i) => i._id.toString())));
        setTotal(res.data.total || 0);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [selectedQuality]);

  const toggleItem = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
    const newTotal = items.filter((i) => newSet.has(i._id.toString())).reduce((s, i) => s + i.price, 0);
    setTotal(newTotal);
  };

  const selectAll = () => {
    setSelectedIds(new Set(items.map((i) => i._id.toString())));
    setTotal(items.reduce((s, i) => s + i.price, 0));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
    setTotal(0);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleSubmit = () => {
    const selectedItems = items.filter((i) => selectedIds.has(i._id.toString()));
    const rooms = ROOM_CATEGORIES.map((cat) => {
      const catItems = selectedItems.filter((i) => i.category === cat);
      if (catItems.length === 0) return null;
      return {
        roomType: cat,
        qualityLevel: selectedQuality,
        cost: catItems.reduce((s, i) => s + i.price, 0),
        items: catItems.map((i) => ({ _id: i._id, name: i.name, price: i.price })),
      };
    }).filter(Boolean);
    const totalCost = selectedItems.reduce((s, i) => s + i.price, 0);
    navigate("/devis", { state: { ...state, furnishing: { rooms, totalFurnishingCost: totalCost } } });
  };

  const accent = QUALITY_LEVELS.find((q) => q.key === selectedQuality)?.color || "#3b82f6";

  return (
    <div className="fu-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fu-page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; }
        .fu-header-section { background: linear-gradient(135deg, ${accent}, ${accent}dd); padding: 40px 20px; text-align: center; }
        .fu-header-section h1 { color: white; font-size: 28px; font-weight: 800; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 12px; }
        .fu-header-section p { color: rgba(255,255,255,0.8); font-size: 16px; }
        .fu-progress-bar { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 24px; }
        .fu-progress-step { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.2); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
        .fu-progress-step.active { background: white; color: ${accent}; }
        .fu-progress-line { width: 40px; height: 2px; background: rgba(255,255,255,0.3); }
        .fu-progress-line.active { background: white; }
        .fu-container { max-width: 960px; margin: 0 auto; padding: 32px 16px 120px; }
        .fu-quality-btns { display: flex; gap: 12px; margin-bottom: 24px; justify-content: center; flex-wrap: wrap; }
        .fu-quality-btn { padding: 10px 24px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; background: white; transition: all 0.2s; font-family: inherit; color: #64748b; }
        .fu-quality-btn:hover { border-color: ${accent}; }
        .fu-quality-btn.active { border-color: ${accent}; background: ${accent}; color: white; }
        .fu-select-row { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 16px; }
        .fu-select-btn { padding: 6px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; background: white; color: #64748b; font-family: inherit; }
        .fu-select-btn:hover { border-color: ${accent}; color: ${accent}; }
        .fu-step-badge { display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
        .fu-group-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 20px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9; display: flex; align-items: center; gap: 8px; }
        .fu-room-card { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .fu-room-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .fu-room-name { font-size: 15px; font-weight: 700; color: #1f2937; }
        .fu-room-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .fu-room-price { font-size: 16px; font-weight: 800; color: ${accent}; }
        .fu-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
        .fu-item-card { border: 2px solid #e5e7eb; border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.2s; background: white; }
        .fu-item-card:hover { border-color: ${accent}; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .fu-item-card.selected { border-color: ${accent}; background: rgba(59,130,246,0.03); }
        .fu-item-img-wrap { position: relative; height: 120px; background: #f3f4f6; overflow: hidden; }
        .fu-item-img { width: 100%; height: 100%; object-fit: cover; }
        .fu-item-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); display: flex; align-items: center; justify-content: center; }
        .fu-item-check { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; background: white; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .fu-item-card.selected .fu-item-check { background: ${accent}; border-color: ${accent}; color: white; }
        .fu-item-info { padding: 12px; }
        .fu-item-name { font-size: 12px; font-weight: 700; color: #1f2937; line-height: 1.3; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .fu-item-cat { font-size: 10px; color: #9ca3af; margin-bottom: 6px; }
        .fu-item-price { font-size: 14px; font-weight: 800; color: ${accent}; }
        .fu-item-unit { font-size: 10px; color: #9ca3af; }
        .fu-total-bar { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e2e8f0; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 -4px 12px rgba(0,0,0,0.05); }
        .fu-total-label { font-size: 14px; color: #64748b; }
        .fu-total-value { font-size: 22px; font-weight: 800; color: #1e293b; }
        .fu-btns { display: flex; gap: 12px; }
        .fu-btn-next { display: flex; align-items: center; gap: 8px; padding: 14px 28px; background: ${accent}; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .fu-btn-next:hover { filter: brightness(1.1); }
        .fu-btn-skip { display: flex; align-items: center; gap: 8px; padding: 14px 20px; background: white; color: #64748b; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .fu-skip-row { text-align: center; margin: 20px 0; }
        .fu-skip-link { color: #94a3b8; font-size: 14px; cursor: pointer; text-decoration: underline; }
        .fu-skip-link:hover { color: #64748b; }
        .fu-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; color: #64748b; }
        .fu-empty { text-align: center; padding: 60px; background: white; border-radius: 16px; border: 2px dashed #e2e8f0; }
        @media (max-width: 600px) { .fu-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } .fu-item-img-wrap { height: 100px; } }
      `}</style>

      <section className="fu-header-section">
        <div className="fu-step-badge">Amenagement</div>
        <h1><Sofa size={28} /> Ameublement</h1>
        <p>Choisissez vos equipements par niveau de qualite</p>
        <div className="fu-progress-bar">
          <div className="fu-progress-step active">1</div>
          <div className="fu-progress-line active"></div>
          <div className="fu-progress-step active">2</div>
          <div className="fu-progress-line active"></div>
          <div className="fu-progress-step active">3</div>
          <div className="fu-progress-line"></div>
          <div className="fu-progress-step">4</div>
        </div>
      </section>

      <div className="fu-container">
        {loading ? (
          <div className="fu-loading">
            <Loader size={32} style={{ animation: "spin 1s linear infinite" }} />
            <p>Chargement des equipements...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="fu-empty">
            <Sofa size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p style={{ color: "#64748b" }}>Aucun equipement disponible pour ce pack.</p>
          </div>
        ) : (
          <>
            <div className="fu-quality-btns">
              {QUALITY_LEVELS.map((q) => (
                <button
                  key={q.key}
                  className={`fu-quality-btn ${selectedQuality === q.key ? "active" : ""}`}
                  onClick={() => setSelectedQuality(q.key)}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <div className="fu-select-row">
              <button className="fu-select-btn" onClick={selectAll}>Tout selectionner</button>
              <button className="fu-select-btn" onClick={deselectAll}>Tout deselectionner</button>
            </div>

            {ROOM_CATEGORIES.filter((cat) => groupedItems[cat]).map((cat) => {
              const catItems = groupedItems[cat];
              const catTotal = catItems.reduce((s, i) => s + i.price, 0);
              return (
                <div key={cat} className="fu-room-card">
                  <div className="fu-room-header">
                    <div>
                      <div className="fu-room-name">{ROOM_LABELS[cat] || cat}</div>
                      <div className="fu-room-meta">{catItems.length} element(s)</div>
                    </div>
                    <div className="fu-room-price">{catTotal.toLocaleString()} DT</div>
                  </div>
                  <div className="fu-cards-grid">
                    {catItems.map((item) => {
                      const isSelected = selectedIds.has(item._id.toString());
                      return (
                        <div
                          key={item._id}
                          className={`fu-item-card ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleItem(item._id.toString())}
                        >
                          <div className="fu-item-img-wrap">
                            {item.image ? (
                              <img className="fu-item-img" src={item.image} alt={item.name} loading="lazy" />
                            ) : (
                              <div className="fu-item-img-placeholder"><Image size={28} color="#94a3b8" /></div>
                            )}
                            <div className="fu-item-check">{isSelected && <Check size={12} />}</div>
                          </div>
                          <div className="fu-item-info">
                            <div className="fu-item-name">{item.name}</div>
                            <div className="fu-item-cat">{item.unit}</div>
                            <div className="fu-item-price">{item.price.toLocaleString()} DT</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="fu-skip-row">
              <span className="fu-skip-link" onClick={() => handleSubmit()}>
                Passer cette etape
              </span>
            </div>
          </>
        )}
      </div>

      <div className="fu-total-bar">
        <div>
          <div className="fu-total-label">Total amenagement</div>
          <div className="fu-total-value">{total.toLocaleString()} DT</div>
        </div>
        <div className="fu-btns">
          <button className="fu-btn-skip" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Retour
          </button>
          <button className="fu-btn-next" onClick={handleSubmit} disabled={loading}>
            Continuer <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}