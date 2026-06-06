import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, Package, Loader, Image } from "lucide-react";
import API from "../services/api";
import "./Finition.css";

const COUT_M2 = 1400;

const CATEGORY_LABELS = {
  carrelage: "Carrelage", peinture: "Peinture", portes_interieures: "Portes interieures",
  portes_exterieures: "Portes exterieures", fenetres: "Fenetres", cuisine: "Cuisine",
  sanitaires: "Sanitaires", electricite: "Electricite", eclairage: "Eclairage",
  plomberie: "Plomberie", faux_plafond: "Faux plafond", climatisation: "Climatisation",
  revetements: "Revetements", menuiserie: "Menuiserie",
};

const ACCENT = "#7c3aed";

function useCountUp(target, duration = 400) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    const start = prevRef.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * ease));
      if (progress < 1) requestAnimationFrame(animate);
      else prevRef.current = target;
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

export default function FinitionHautDeGamme() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [surface, setSurface] = useState("");
  const [floors, setFloors] = useState("1");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [total, setTotal] = useState(0);
  const displayTotal = useCountUp(total);
  const estimated = surface ? Number(surface) * COUT_M2 * parseInt(floors) : 0;
  const region = state?.terrainInput?.region || "Tunis";

  useEffect(() => {
    API.get(`/pricing/package?finition=haut+de+gamme&region=${encodeURIComponent(region)}`)
      .then((res) => {
        const data = res.data.items || [];
        setItems(data);
        setSelectedIds(new Set(data.map((i) => i._id.toString())));
        setTotal(res.data.total || 0);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setTotal((prev) => {
      const item = items.find((i) => i._id.toString() === id.toString());
      if (!item) return prev;
      return selectedIds.has(id) ? prev - item.price : prev + item.price;
    });
  };

  const selectAll = () => { setSelectedIds(new Set(items.map((i) => i._id.toString()))); setTotal(items.reduce((s, i) => s + i.price, 0)); };
  const deselectAll = () => { setSelectedIds(new Set()); setTotal(0); };

  const groupedItems = items.reduce((acc, item) => { if (!acc[item.category]) acc[item.category] = []; acc[item.category].push(item); return acc; }, {});

  const handleNext = () => {
    const sel = items.filter((i) => selectedIds.has(i._id.toString()));
    const rooms = Object.entries(groupedItems).map(([cat, catItems]) => {
      const s = sel.filter((i) => i.category === cat);
      if (s.length === 0) return null;
      return { roomType: cat, qualityLevel: "haut de gamme", cost: s.reduce((a, i) => a + i.price, 0) };
    }).filter(Boolean);
    navigate("/devis", { state: { ...state, construction: { surface, floors, finitionLevel: "haut de gamme", constructionType: state?.constructionType || "moderne", totalConstructionCost: estimated }, furnishing: { rooms, totalFurnishingCost: total } } });
  };

  return (
    <div className="fin-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fin-page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; padding-bottom: 100px; }
        .fin-hero { padding: 40px 20px 30px; text-align: center; background: linear-gradient(135deg, #7c3aed, #6d28d9); position: relative; overflow: hidden; }
        .fin-hero::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 50% 60%, rgba(255,255,255,0.12) 0%, transparent 50%); animation: finShineHg 8s ease-in-out infinite; }
        @keyframes finShineHg { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.1) rotate(3deg); } }
        .fin-hero h1 { color: white; font-size: 28px; font-weight: 800; margin-bottom: 6px; animation: finSlideDown 0.6s ease-out; }
        .fin-hero p { color: rgba(255,255,255,0.8); font-size: 15px; animation: finSlideDown 0.6s ease-out 0.1s both; }
        .fin-badges { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 14px; animation: finSlideDown 0.6s ease-out 0.2s both; }
        .fin-badge { background: rgba(255,255,255,0.2); color: white; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; backdrop-filter: blur(4px); transition: transform 0.3s, background 0.3s; }
        .fin-badge:hover { transform: scale(1.05); background: rgba(255,255,255,0.3); }
        .fin-container { max-width: 960px; margin: 0 auto; padding: 20px 16px; }
        .fin-construct-card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; border: 1px solid #e2e8f0; animation: finFadeUp 0.5s ease-out; }
        .fin-construct-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .fin-form-group { margin-bottom: 0; }
        .fin-form-group label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px; }
        .fin-form-group input, .fin-form-group select { width: 100%; padding: 11px 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #1f2937; font-family: inherit; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .fin-form-group input:focus, .fin-form-group select:focus { border-color: ${ACCENT}; box-shadow: 0 0 0 3px rgba(124,58,237,0.15), 0 0 0 6px rgba(124,58,237,0.05); transform: scale(1.01); }
        .fin-calc-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; background: #f5f3ff; border: 1px solid ${ACCENT}; border-radius: 12px; padding: 14px 16px; animation: finPulse 0.4s ease-out; }
        .fin-calc-label { font-size: 13px; color: #4c1d95; font-weight: 500; }
        .fin-calc-value { font-size: 20px; font-weight: 800; color: #6d28d9; }
        .fin-pack-section { margin-bottom: 24px; }
        .fin-pack-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: white; border: 1px solid #e5e7eb; border-radius: 14px 14px 0 0; border-bottom: none; }
        .fin-pack-title { font-size: 15px; font-weight: 700; color: #1f2937; }
        .fin-pack-actions { display: flex; gap: 8px; }
        .fin-pack-btn { padding: 6px 14px; background: #f5f3ff; color: #6d28d9; border: 1px solid #7c3aed; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; position: relative; overflow: hidden; }
        .fin-pack-btn::after { content: ''; position: absolute; inset: 0; background: #7c3aed; transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
        .fin-pack-btn:hover::after { transform: scaleX(1); }
        .fin-pack-btn:hover { color: white; }
        .fin-pack-btn span { position: relative; z-index: 1; }
        .fin-cat-card { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 16px; animation: finFadeUp 0.5s ease-out; transition: box-shadow 0.3s; }
        .fin-cat-card:hover { box-shadow: 0 8px 24px rgba(124,58,237,0.08); }
        .fin-cat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .fin-cat-title { display: flex; align-items: center; gap: 10px; }
        .fin-cat-icon { width: 36px; height: 36px; border-radius: 10px; overflow: hidden; background: #ede9fe; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
        .fin-cat-icon:hover { transform: rotate(-10deg) scale(1.1); }
        .fin-cat-icon img { width: 100%; height: 100%; object-fit: cover; }
        .fin-cat-icon span { font-size: 14px; font-weight: 700; color: #6d28d9; }
        .fin-cat-name { font-size: 15px; font-weight: 700; color: #1f2937; }
        .fin-cat-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .fin-cat-price { font-size: 16px; font-weight: 800; color: #7c3aed; transition: all 0.3s ease; }
        .fin-cat-card:hover .fin-cat-price { transform: scale(1.05); }
        .fin-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .fin-item-card { border: 2px solid #e5e7eb; border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); background: white; position: relative; }
        .fin-item-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 50%, rgba(124,58,237,0.03) 100%); opacity: 0; transition: opacity 0.3s; z-index: 1; pointer-events: none; }
        .fin-item-card:hover { border-color: #7c3aed; box-shadow: 0 8px 24px rgba(124,58,237,0.2); transform: translateY(-4px) scale(1.02); }
        .fin-item-card:hover::before { opacity: 1; }
        .fin-item-card.selected { border-color: #7c3aed; background: #f5f3ff; box-shadow: 0 4px 16px rgba(124,58,237,0.2); transform: translateY(-2px); }
        .fin-item-card:active { transform: scale(0.98); }
        .fin-card-img-wrap { position: relative; height: 140px; background: #f3f4f6; overflow: hidden; }
        .fin-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .fin-item-card:hover .fin-card-img { transform: scale(1.08); }
        .fin-card-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #ede9fe, #ddd6fe); display: flex; align-items: center; justify-content: center; transition: background 0.3s; }
        .fin-item-card:hover .fin-card-img-placeholder { background: linear-gradient(135deg, #ddd6fe, #c4b5fd); }
        .fin-card-check { position: absolute; top: 8px; right: 8px; width: 26px; height: 26px; border-radius: 50%; background: white; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 2; }
        .fin-card-check svg { opacity: 0; transform: scale(0) rotate(-180deg); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .fin-item-card.selected .fin-card-check { background: #7c3aed; border-color: #7c3aed; transform: scale(1.1); box-shadow: 0 0 0 4px rgba(124,58,237,0.2); }
        .fin-item-card.selected .fin-card-check svg { opacity: 1; transform: scale(1) rotate(0deg); }
        .fin-card-body { padding: 12px; position: relative; z-index: 1; }
        .fin-card-name { font-size: 12px; font-weight: 700; color: #1f2937; line-height: 1.3; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.2s; }
        .fin-item-card.selected .fin-card-name { color: #4c1d95; }
        .fin-card-desc { font-size: 10px; color: #9ca3af; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.2s; }
        .fin-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .fin-card-price { font-size: 15px; font-weight: 800; color: #7c3aed; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: inline-block; }
        .fin-item-card.selected .fin-card-price { color: #6d28d9; animation: finPriceBounceViolet 0.4s ease-out; }
        @keyframes finPriceBounceViolet { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .fin-card-unit { font-size: 10px; color: #9ca3af; }
        .fin-cta-bar { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e5e7eb; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 -4px 24px rgba(0,0,0,0.1); z-index: 100; backdrop-filter: blur(10px); animation: finSlideUp 0.4s ease-out; }
        .fin-cta-info h3 { font-size: 14px; font-weight: 700; color: #1f2937; }
        .fin-cta-info p { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .fin-cta-btns { display: flex; gap: 10px; align-items: center; }
        .fin-btn-back { display: flex; align-items: center; gap: 6px; padding: 12px 16px; background: white; color: #6b7280; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .fin-btn-back:hover { background: #f9fafb; border-color: #7c3aed; color: #7c3aed; transform: translateX(-2px); }
        .fin-btn-next { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: #7c3aed; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .fin-btn-next::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: transform 0.4s; }
        .fin-btn-next:hover { background: #6d28d9; transform: scale(1.03); box-shadow: 0 4px 16px rgba(124,58,237,0.4); }
        .fin-btn-next:hover::before { transform: translateX(100%); }
        .fin-btn-next:active { transform: scale(0.97); }
        .fin-btn-next:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .fin-total-anim { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .fin-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 12px; color: #6b7280; }
        .fin-empty { text-align: center; padding: 40px 20px; background: white; border-radius: 16px; border: 2px dashed #e5e7eb; }
        @keyframes finFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes finSlideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes finSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes finPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @media (max-width: 600px) { .fin-construct-grid { grid-template-columns: 1fr; } .fin-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } .fin-card-img-wrap { height: 100px; } }
      `}</style>

      <div className="fin-hero">
        <h1>Finition Haut de Gamme</h1>
        <p>L'excellence et le luxe pour votre maison de reve</p>
        <div className="fin-badges">
          <span className="fin-badge">~1400 DT/m2 construction</span>
          <span className="fin-badge">Materiaux premium</span>
          <span className="fin-badge">Photos reelles</span>
        </div>
      </div>

      <div className="fin-container">
        <div className="fin-construct-card">
          <div className="fin-construct-grid">
            <div className="fin-form-group">
              <label>Surface habitable (m2)</label>
              <input type="number" min="80" placeholder="Ex: 250" value={surface} onChange={(e) => setSurface(e.target.value)} />
            </div>
            <div className="fin-form-group">
              <label>Nombre d'etages</label>
              <select value={floors} onChange={(e) => setFloors(e.target.value)}>
                <option value="1">RDC</option>
                <option value="2">R+1</option>
                <option value="3">R+2</option>
              </select>
            </div>
          </div>
          {surface && (
            <div className="fin-calc-bar">
              <div>
                <div className="fin-calc-label">Estimation construction</div>
                <div style={{ fontSize: "10px", color: "#4c1d95" }}>{surface} m2 x {COUT_M2} DT x {floors}</div>
              </div>
              <div className="fin-calc-value">{estimated.toLocaleString()} DT</div>
            </div>
          )}
        </div>

        <div className="fin-pack-section">
          <div className="fin-pack-header">
            <div className="fin-pack-title">Pack equipement haut de gamme</div>
            <div className="fin-pack-actions">
              <button className="fin-pack-btn" onClick={selectAll}><span>Tout</span></button>
              <button className="fin-pack-btn" onClick={deselectAll}><span>Reset</span></button>
            </div>
          </div>

          {loading ? (
            <div className="fin-loading">
              <Loader size={28} style={{ animation: "spin 1s linear infinite" }} />
              <p>Chargement du pack...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="fin-empty">
              <Package size={40} style={{ opacity: 0.3 }} />
              <p style={{ marginTop: 12 }}>Pack vide. Contactez l'administrateur.</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([cat, catItems]) => {
              const catTotal = catItems.reduce((s, i) => s + i.price, 0);
              const catImg = catItems[0]?.image;
              return (
                <div key={cat} className="fin-cat-card">
                  <div className="fin-cat-header">
                    <div className="fin-cat-title">
                      <div className="fin-cat-icon">
                        {catImg ? <img src={catImg} alt={CATEGORY_LABELS[cat]} /> : <span>{CATEGORY_LABELS[cat]?.[0]}</span>}
                      </div>
                      <div>
                        <div className="fin-cat-name">{CATEGORY_LABELS[cat] || cat}</div>
                        <div className="fin-cat-meta">{catItems.length} element(s)</div>
                      </div>
                    </div>
                    <div className="fin-cat-price">{catTotal.toLocaleString()} DT</div>
                  </div>
                  <div className="fin-cards-grid">
                    {catItems.map((item) => {
                      const isSelected = selectedIds.has(item._id.toString());
                      return (
                        <div key={item._id} className={`fin-item-card ${isSelected ? "selected" : ""}`} onClick={() => toggleItem(item._id.toString())}>
                          <div className="fin-card-img-wrap">
                            {item.image ? (
                              <img className="fin-card-img" src={item.image} alt={item.name} loading="lazy" />
                            ) : (
                              <div className="fin-card-img-placeholder"><Image size={32} color="#7c3aed" /></div>
                            )}
                            <div className="fin-card-check"><Check size={14} color="white" /></div>
                          </div>
                          <div className="fin-card-body">
                            <div className="fin-card-name">{item.name}</div>
                            <div className="fin-card-desc">{item.description}</div>
                            <div className="fin-card-footer">
                              <div>
                                <span className="fin-card-price">{item.price.toLocaleString()} DT</span>
                                <span className="fin-card-unit">/{item.unit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="fin-cta-bar">
        <div className="fin-cta-info">
          <h3>Total equipements selectionnes</h3>
          <p>{selectedIds.size} element(s)</p>
        </div>
        <div className="fin-total-anim" style={{ fontSize: "22px", fontWeight: "800", color: "#6d28d9" }}>{displayTotal.toLocaleString()} DT</div>
        <div className="fin-cta-btns">
          <button className="fin-btn-back" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Retour</button>
          <button className="fin-btn-next" onClick={handleNext} disabled={!surface}>Continuer <ArrowRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}