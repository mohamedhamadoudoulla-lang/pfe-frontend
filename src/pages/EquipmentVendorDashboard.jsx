import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { Edit3, Trash2, Plus, X, Check, Image, Package } from "lucide-react";
import "./EquipmentVendorDashboard.css";

const CATEGORIES = [
  { value: "carrelage", label: "Carrelage" },
  { value: "peinture", label: "Peinture" },
  { value: "portes_interieures", label: "Portes interieures" },
  { value: "portes_exterieures", label: "Portes exterieures" },
  { value: "fenetres", label: "Fenetres" },
  { value: "cuisine", label: "Cuisine" },
  { value: "sanitaires", label: "Sanitaires" },
  { value: "electricite", label: "Electricite" },
  { value: "eclairage", label: "Eclairage" },
  { value: "plomberie", label: "Plomberie" },
  { value: "faux_plafond", label: "Faux plafond" },
  { value: "climatisation", label: "Climatisation" },
  { value: "revetements", label: "Revetements" },
  { value: "menuiserie", label: "Menuiserie" },
];

const PACKAGES = [
  { key: "economique", label: "Economique", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)", badge: "Eco" },
  { key: "standard", label: "Standard", color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)", badge: "Std" },
  { key: "haut de gamme", label: "Haut de gamme", color: "#7c3aed", gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)", badge: "HG" },
];

export default function EquipmentVendorDashboard() {
  const { user } = useAuth();
  const [activePackage, setActivePackage] = useState("economique");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    name: "", category: "carrelage", qualityLevel: "economique", unit: "piece", price: "", description: "", image: "",
    shopName: "", shopEmail: "", shopAddress: "", shopPhone: "",
  });

  useEffect(() => {
    API.get("/equipment/vendor")
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const pkg = PACKAGES.find((p) => p.key === activePackage);
  const filteredItems = items.filter((e) => e.qualityLevel === activePackage);
  const grouped = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const stats = PACKAGES.map((p) => ({
    ...p,
    count: items.filter((e) => e.qualityLevel === p.key).length,
    total: items.filter((e) => e.qualityLevel === p.key).reduce((s, e) => s + (e.price || 0), 0),
  }));

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/equipment", form);
      setItems([res.data, ...items]);
      setShowForm(false);
      setForm({ name: "", category: "carrelage", qualityLevel: activePackage, unit: "piece", price: "", description: "", image: "", shopName: "", shopEmail: "", shopAddress: "", shopPhone: "" });
      toast.success("Equipement ajoute au pack " + pkg?.label);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet equipement ?")) return;
    try {
      await API.delete(`/equipment/${id}`);
      setItems(items.filter((e) => e._id !== id));
      toast.success("Equipement supprime");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      category: item.category,
      qualityLevel: item.qualityLevel,
      unit: item.unit,
      price: item.price,
      description: item.description || "",
      image: item.image || "",
      shopName: item.shopName || "",
      shopEmail: item.shopEmail || "",
      shopAddress: item.shopAddress || "",
      shopPhone: item.shopPhone || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      const res = await API.put(`/equipment/${id}`, editForm);
      setItems(items.map((e) => (e._id === id ? res.data : e)));
      setEditingId(null);
      toast.success("Equipement modifie");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  if (loading) return <div className="evd-loading">Chargement...</div>;

  return (
    <div className="evd-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .evd-page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; }
        .evd-header-top { background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 28px 24px; color: white; }
        .evd-header-top h1 { font-size: 22px; font-weight: 800; }
        .evd-header-top p { font-size: 13px; opacity: 0.8; margin-top: 4px; }
        .evd-container { max-width: 1100px; margin: 0 auto; padding: 20px 16px 120px; }
        .evd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .evd-stat-card { background: white; border-radius: 14px; padding: 16px; border: 1px solid #e5e7eb; text-align: center; cursor: pointer; transition: all 0.2s; }
        .evd-stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .evd-stat-icon { width: 44px; height: 44px; border-radius: 10px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: white; }
        .evd-stat-value { font-size: 24px; font-weight: 800; color: #1f2937; }
        .evd-stat-label { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .evd-stat-total { font-size: 11px; color: #9ca3af; margin-top: 4px; }
        .evd-pkg-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
        .evd-pkg-tab { flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: center; transition: all 0.2s; font-family: inherit; min-width: 120px; }
        .evd-pkg-tab:hover { border-color: #94a3b8; }
        .evd-pkg-tab.active { border-color: transparent; color: white; }
        .evd-pkg-tab-label { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
        .evd-pkg-tab-count { font-size: 11px; opacity: 0.8; }
        .evd-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .evd-bar h2 { font-size: 18px; font-weight: 700; color: #1e293b; }
        .evd-bar-meta { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .evd-add-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; background: ${pkg?.color || "#3b82f6"}; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .evd-add-btn:hover { filter: brightness(1.1); }
        .evd-form-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        .evd-form-title { font-size: 15px; font-weight: 700; color: #1f293b; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .evd-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .evd-form-group { display: flex; flex-direction: column; }
        .evd-form-group label { font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 4px; }
        .evd-form-group input, .evd-form-group select, .evd-form-group textarea { padding: 9px 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #1f2937; font-family: inherit; outline: none; transition: border-color 0.2s; width: 100%; }
        .evd-form-group input:focus, .evd-form-group select:focus, .evd-form-group textarea:focus { border-color: ${pkg?.color || "#3b82f6"}; }
        .evd-form-group textarea { resize: vertical; min-height: 60px; }
        .evd-form-group.full { grid-column: 1 / -1; }
        .evd-form-actions { display: flex; gap: 8px; margin-top: 14px; }
        .evd-btn-submit { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: ${pkg?.color || "#3b82f6"}; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .evd-btn-cancel { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: white; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .evd-cat-block { background: white; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
        .evd-cat-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #f9fafb; border-bottom: 1px solid #f3f4f6; }
        .evd-cat-title { display: flex; align-items: center; gap: 10px; }
        .evd-cat-icon { width: 34px; height: 34px; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: ${pkg?.color || "#3b82f6"}20; }
        .evd-cat-icon img { width: 100%; height: 100%; object-fit: cover; }
        .evd-cat-icon span { font-size: 13px; font-weight: 800; color: ${pkg?.color || "#3b82f6"}; }
        .evd-cat-name { font-size: 14px; font-weight: 700; color: #1f2937; }
        .evd-cat-count { font-size: 11px; color: #9ca3af; margin-top: 1px; }
        .evd-cat-price { font-size: 16px; font-weight: 800; color: ${pkg?.color || "#3b82f6"}; }
        .evd-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; padding: 14px 18px; }
        .evd-eq-card { border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: all 0.2s; background: white; }
        .evd-eq-card:hover { border-color: ${pkg?.color || "#3b82f6"}; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .evd-card-img { width: 100%; height: 130px; object-fit: cover; background: #f3f4f6; }
        .evd-card-img-placeholder { width: 100%; height: 130px; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); display: flex; align-items: center; justify-content: center; }
        .evd-card-body { padding: 12px; }
        .evd-card-name { font-size: 12px; font-weight: 700; color: #1f2937; line-height: 1.3; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .evd-card-desc { font-size: 10px; color: #9ca3af; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .evd-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .evd-card-price { font-size: 14px; font-weight: 800; color: ${pkg?.color || "#3b82f6"}; }
        .evd-card-unit { font-size: 10px; color: #9ca3af; }
        .evd-card-actions { display: flex; gap: 4px; }
        .evd-btn-edit { width: 28px; height: 28px; border-radius: 6px; background: #f3f4f6; color: #64748b; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .evd-btn-edit:hover { background: ${pkg?.color || "#3b82f6"}; color: white; }
        .evd-btn-delete { width: 28px; height: 28px; border-radius: 6px; background: #fef2f2; color: #dc2626; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .evd-btn-delete:hover { background: #dc2626; color: white; }
        .evd-edit-section { background: ${pkg?.color || "#3b82f6"}10; border: 2px solid ${pkg?.color || "#3b82f6"}; border-radius: 12px; overflow: hidden; margin-bottom: 4px; }
        .evd-edit-bar { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: white; border-bottom: 1px solid #f3f4f6; gap: 8px; flex-wrap: wrap; }
        .evd-edit-label { font-size: 11px; font-weight: 700; color: ${pkg?.color || "#3b82f6"}; }
        .evd-edit-row { display: flex; gap: 6px; padding: 8px 14px; flex-wrap: wrap; }
        .evd-edit-input { padding: 6px 8px; border: 1px solid ${pkg?.color || "#3b82f6"}; border-radius: 6px; font-size: 12px; font-family: inherit; outline: none; width: 120px; }
        .evd-edit-select { padding: 6px 8px; border: 1px solid ${pkg?.color || "#3b82f6"}; border-radius: 6px; font-size: 12px; font-family: inherit; outline: none; }
        .evd-edit-actions { display: flex; gap: 4px; }
        .evd-btn-save { width: 28px; height: 28px; border-radius: 6px; background: ${pkg?.color || "#3b82f6"}; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .evd-btn-x { width: 28px; height: 28px; border-radius: 6px; background: #e5e7eb; color: #64748b; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .evd-empty { text-align: center; padding: 48px 20px; background: white; border-radius: 14px; border: 2px dashed #e5e7eb; }
        .evd-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-size: 16px; color: #64748b; font-family: 'Inter', sans-serif; }
        .evd-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
        @media (max-width: 768px) { .evd-form-grid { grid-template-columns: 1fr 1fr; } .evd-form-group.full { grid-column: 1 / -1; } .evd-stats { grid-template-columns: 1fr 1fr; } .evd-items-grid { grid-template-columns: repeat(2, 1fr); } .evd-pkg-tabs { flex-wrap: wrap; } }
        @media (max-width: 480px) { .evd-stats { grid-template-columns: 1fr; } .evd-items-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="evd-header-top">
        <h1>Vendeur d'Equipements</h1>
        <p>Gerez les equipements des packs Economique, Standard et Haut de gamme</p>
      </div>

      <div className="evd-container">
        <div className="evd-stats">
          {stats.map((s) => (
            <div
              key={s.key}
              className="evd-stat-card"
              style={activePackage === s.key ? { borderColor: s.color, boxShadow: `0 4px 12px ${s.color}30` } : {}}
              onClick={() => setActivePackage(s.key)}
            >
              <div className="evd-stat-icon" style={{ background: s.gradient }}>{s.badge}</div>
              <div className="evd-stat-value">{s.count}</div>
              <div className="evd-stat-label">{s.label}</div>
              <div className="evd-stat-total">{s.total.toLocaleString()} DT total</div>
            </div>
          ))}
        </div>

        <div className="evd-pkg-tabs">
          {PACKAGES.map((p) => {
            const count = items.filter((e) => e.qualityLevel === p.key).length;
            return (
              <button
                key={p.key}
                className={`evd-pkg-tab ${activePackage === p.key ? "active" : ""}`}
                style={activePackage === p.key ? { background: p.gradient } : { color: p.color }}
                onClick={() => setActivePackage(p.key)}
              >
                <div className="evd-pkg-tab-label">{p.label}</div>
                <div className="evd-pkg-tab-count">{count} equipements</div>
              </button>
            );
          })}
        </div>

        <div className="evd-bar">
          <div>
            <h2>{pkg?.label} - Catalogue</h2>
            <div className="evd-bar-meta">
              {filteredItems.length} equipement(s) | {filteredItems.reduce((s, e) => s + (e.price || 0), 0).toLocaleString()} DT
            </div>
          </div>
          <button className="evd-add-btn" onClick={() => { setForm({ ...form, qualityLevel: activePackage }); setShowForm(!showForm); }}>
            {showForm ? <><X size={14} /> Fermer</> : <><Plus size={14} /> Ajouter</>}
          </button>
        </div>

        {showForm && (
          <div className="evd-form-card">
            <div className="evd-form-title">
              <Package size={16} color={pkg?.color} />
              Nouvel equipement - Pack {pkg?.label}
            </div>
            <form onSubmit={handleAdd}>
              <div className="evd-form-grid">
                <div className="evd-form-group">
                  <label>Nom du produit</label>
                  <input placeholder="Ex: Carrelage gres cerame 60x60" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="evd-form-group">
                  <label>Categorie</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="evd-form-group">
                  <label>Pack (niveau qualite)</label>
                  <select value={form.qualityLevel} onChange={(e) => setForm({ ...form, qualityLevel: e.target.value })}>
                    {PACKAGES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                  </select>
                </div>
                <div className="evd-form-group">
                  <label>Unite</label>
                  <input placeholder="m2, piece, litre..." value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
                <div className="evd-form-group">
                  <label>Prix (DT)</label>
                  <input type="number" min="0" step="0.01" placeholder="Ex: 120" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="evd-form-group">
                  <label>Image (URL)</label>
                  <input placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
                <div className="evd-form-group full">
                  <label>Description</label>
                  <textarea placeholder="Decrivez le produit..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="evd-form-group full" style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, marginTop: 4 }}>
                  <label style={{ fontSize: 13, color: "#3b82f6", marginBottom: 10, display: "block" }}>Informations boutique</label>
                </div>
                <div className="evd-form-group">
                  <label>Nom de la boutique</label>
                  <input placeholder="Ex: Maison Du Batiment" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
                </div>
                <div className="evd-form-group">
                  <label>Email de la boutique</label>
                  <input type="email" placeholder="contact@boutique.tn" value={form.shopEmail} onChange={(e) => setForm({ ...form, shopEmail: e.target.value })} />
                </div>
                <div className="evd-form-group">
                  <label>Adresse de la boutique</label>
                  <input placeholder="Rue, ville, governement" value={form.shopAddress} onChange={(e) => setForm({ ...form, shopAddress: e.target.value })} />
                </div>
                <div className="evd-form-group">
                  <label>Telephone de la boutique</label>
                  <input placeholder="XX XXX XXX" value={form.shopPhone} onChange={(e) => setForm({ ...form, shopPhone: e.target.value })} />
                </div>
              </div>
              <div className="evd-form-actions">
                <button type="submit" className="evd-btn-submit"><Plus size={12} /> Ajouter au pack</button>
                <button type="button" className="evd-btn-cancel" onClick={() => setShowForm(false)}><X size={12} /> Annuler</button>
              </div>
            </form>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="evd-empty">
            <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>Aucun equipement dans le pack {pkg?.label}.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Ajoutez vos premiers equipements.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => {
            const catTotal = catItems.reduce((s, i) => s + (i.price || 0), 0);
            const catImg = catItems[0]?.image;
            return (
              <div key={cat} className="evd-cat-block">
                <div className="evd-cat-header">
                  <div className="evd-cat-title">
                    <div className="evd-cat-icon">
                      {catImg ? <img src={catImg} alt="" /> : <span>{CATEGORIES.find((c) => c.value === cat)?.label?.[0] || "?"}</span>}
                    </div>
                    <div>
                      <div className="evd-cat-name">{CATEGORIES.find((c) => c.value === cat)?.label || cat}</div>
                      <div className="evd-cat-count">{catItems.length} equipement(s)</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="evd-cat-price">{catTotal.toLocaleString()} DT</span>
                    <span className="evd-badge" style={{ background: pkg?.color + "20", color: pkg?.color }}>{pkg?.badge}</span>
                  </div>
                </div>
                <div className="evd-items-grid">
                  {catItems.map((eq) => {
                    if (editingId === eq._id) {
                      return (
                        <div key={eq._id} className="evd-edit-section">
                          <div className="evd-edit-bar">
                            <span className="evd-edit-label">Modifier equipement</span>
                            <div className="evd-edit-actions">
                              <button className="evd-btn-save" onClick={() => saveEdit(eq._id)} title="Enregistrer"><Check size={12} /></button>
                              <button className="evd-btn-x" onClick={() => setEditingId(null)} title="Annuler"><X size={12} /></button>
                            </div>
                          </div>
                          <div className="evd-edit-row">
                            <input className="evd-edit-input" style={{ width: "100%" }} value={editForm.name} placeholder="Nom" onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                          </div>
                          <div className="evd-edit-row">
                            <select className="evd-edit-select" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                            <select className="evd-edit-select" value={editForm.qualityLevel} onChange={(e) => setEditForm({ ...editForm, qualityLevel: e.target.value })}>
                              {PACKAGES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                            </select>
                            <input className="evd-edit-input" type="number" min="0" step="0.01" value={editForm.price} placeholder="Prix" onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                          </div>
                          <div className="evd-edit-row">
                            <textarea style={{ width: "100%", padding: "6px 8px", border: `1px solid ${pkg?.color}`, borderRadius: 6, fontSize: 11, fontFamily: "inherit", resize: "vertical", minHeight: 50 }} value={editForm.description} placeholder="Description" onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={eq._id} className="evd-eq-card">
                        {eq.image ? (
                          <img className="evd-card-img" src={eq.image} alt={eq.name} />
                        ) : (
                          <div className="evd-card-img-placeholder"><Image size={28} color="#d1d5db" /></div>
                        )}
                        <div className="evd-card-body">
                          <div className="evd-card-name">{eq.name}</div>
                          <div className="evd-card-desc">{eq.description}</div>
                          <div className="evd-card-footer">
                            <div>
                              <div className="evd-card-price">{eq.price?.toLocaleString()} DT</div>
                              <div className="evd-card-unit">/{eq.unit}</div>
                            </div>
                            <div className="evd-card-actions">
                              <button className="evd-btn-edit" onClick={() => startEdit(eq)} title="Modifier"><Edit3 size={12} /></button>
                              <button className="evd-btn-delete" onClick={() => handleDelete(eq._id)} title="Supprimer"><Trash2 size={12} /></button>
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
  );
}