import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../services/api";
import toast from "react-hot-toast";
import { Edit3, Trash2, Plus, X, Check, Image, Package, TrendingUp, Layers } from "lucide-react";

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
  { key: "economique", label: "Economique", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)", icon: "Eco", badge: "Economique" },
  { key: "standard", label: "Standard", color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)", icon: "Std", badge: "Standard" },
  { key: "haut de gamme", label: "Haut de gamme", color: "#7c3aed", gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)", icon: "HG", badge: "Haut de gamme" },
];

export default function SellerDashboard() {
  const { user } = useAuth();
  const [activePackage, setActivePackage] = useState("economique");
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    name: "", category: "carrelage", qualityLevel: "economique", unit: "piece", price: "", description: "", image: "",
  });

  useEffect(() => {
    axios.get("/equipment/vendor").then((r) => setEquipments(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredItems = equipments.filter((e) => e.qualityLevel === activePackage);
  const pkg = PACKAGES.find((p) => p.key === activePackage);
  const totalValue = filteredItems.reduce((s, e) => s + (e.price || 0), 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/equipment", form);
      setEquipments([res.data, ...equipments]);
      setShowForm(false);
      setForm({ name: "", category: "carrelage", qualityLevel: activePackage, unit: "piece", price: "", description: "", image: "" });
      toast.success("Equipement ajoute !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous supprimer cet equipement ?")) return;
    try {
      await axios.delete(`/equipment/${id}`);
      setEquipments(equipments.filter((e) => e._id !== id));
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
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`/equipment/${id}`, editForm);
      setEquipments(equipments.map((e) => (e._id === id ? res.data : e)));
      setEditingId(null);
      toast.success("Equipement modifie !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const groupedByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) return <div style={{ padding: 60, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>Chargement...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sd-header { background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 28px 24px; color: white; }
        .sd-header h1 { font-size: 22px; font-weight: 800; }
        .sd-header p { font-size: 13px; opacity: 0.8; margin-top: 4px; }
        .sd-container { max-width: 1100px; margin: 0 auto; padding: 20px 16px 120px; }
        .sd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .sd-stat-card { background: white; border-radius: 14px; padding: 16px; border: 1px solid #e5e7eb; text-align: center; }
        .sd-stat-icon { width: 40px; height: 40px; border-radius: 10px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
        .sd-stat-value { font-size: 22px; font-weight: 800; color: #1f2937; }
        .sd-stat-label { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .sd-pkg-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        .sd-pkg-tab { flex: 1; min-width: 140px; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; transition: all 0.2s; text-align: center; font-family: inherit; }
        .sd-pkg-tab:hover { border-color: #94a3b8; }
        .sd-pkg-tab.active { border-color: transparent; color: white; }
        .sd-pkg-tab-label { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
        .sd-pkg-tab-count { font-size: 11px; opacity: 0.8; }
        .sd-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .sd-bar h2 { font-size: 18px; font-weight: 700; color: #1e293b; }
        .sd-bar-meta { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .sd-add-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: ${pkg?.color || "#3b82f6"}; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .sd-add-btn:hover { filter: brightness(1.1); }
        .sd-form-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        .sd-form-title { font-size: 15px; font-weight: 700; color: #1f293b; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .sd-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .sd-form-group { display: flex; flex-direction: column; }
        .sd-form-group label { font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 4px; }
        .sd-form-group input, .sd-form-group select, .sd-form-group textarea { padding: 9px 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #1f2937; font-family: inherit; outline: none; transition: border-color 0.2s; width: 100%; }
        .sd-form-group input:focus, .sd-form-group select:focus, .sd-form-group textarea:focus { border-color: ${pkg?.color || "#3b82f6"}; }
        .sd-form-group textarea { resize: vertical; min-height: 60px; }
        .sd-form-group.full { grid-column: 1 / -1; }
        .sd-form-actions { display: flex; gap: 8px; margin-top: 14px; }
        .sd-btn-submit { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: ${pkg?.color || "#3b82f6"}; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .sd-btn-cancel { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: white; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .sd-cat-block { background: white; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
        .sd-cat-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #f9fafb; border-bottom: 1px solid #f3f4f6; }
        .sd-cat-title { display: flex; align-items: center; gap: 8px; }
        .sd-cat-icon { width: 32px; height: 32px; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .sd-cat-icon img { width: 100%; height: 100%; object-fit: cover; }
        .sd-cat-icon span { font-size: 12px; font-weight: 800; }
        .sd-cat-name { font-size: 14px; font-weight: 700; color: #1f2937; }
        .sd-cat-count { font-size: 11px; color: #9ca3af; margin-top: 1px; }
        .sd-cat-total { font-size: 15px; font-weight: 800; color: ${pkg?.color || "#3b82f6"}; }
        .sd-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; padding: 14px 18px; }
        .sd-eq-card { border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: all 0.2s; background: white; }
        .sd-eq-card:hover { border-color: ${pkg?.color || "#3b82f6"}; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .sd-card-img { width: 100%; height: 130px; object-fit: cover; background: #f3f4f6; }
        .sd-card-img-placeholder { width: 100%; height: 130px; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); display: flex; align-items: center; justify-content: center; }
        .sd-card-body { padding: 12px; }
        .sd-card-name { font-size: 12px; font-weight: 700; color: #1f2937; line-height: 1.3; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .sd-card-desc { font-size: 10px; color: #9ca3af; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .sd-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .sd-card-price { font-size: 14px; font-weight: 800; color: ${pkg?.color || "#3b82f6"}; }
        .sd-card-unit { font-size: 10px; color: #9ca3af; }
        .sd-card-actions { display: flex; gap: 4px; }
        .sd-btn-edit { width: 28px; height: 28px; border-radius: 6px; background: #f3f4f6; color: #64748b; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .sd-btn-edit:hover { background: ${pkg?.color || "#3b82f6"}; color: white; }
        .sd-btn-delete { width: 28px; height: 28px; border-radius: 6px; background: #fef2f2; color: #dc2626; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .sd-btn-delete:hover { background: #dc2626; color: white; }
        .sd-edit-bar { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: ${pkg?.color || "#3b82f6"}10; border-bottom: 1px solid #e5e7eb; gap: 8px; flex-wrap: wrap; }
        .sd-edit-input { padding: 6px 8px; border: 1px solid ${pkg?.color || "#3b82f6"}; border-radius: 6px; font-size: 12px; font-family: inherit; outline: none; width: 120px; }
        .sd-edit-select { padding: 6px 8px; border: 1px solid ${pkg?.color || "#3b82f6"}; border-radius: 6px; font-size: 12px; font-family: inherit; outline: none; }
        .sd-edit-actions { display: flex; gap: 4px; }
        .sd-btn-save { width: 28px; height: 28px; border-radius: 6px; background: ${pkg?.color || "#3b82f6"}; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .sd-btn-x { width: 28px; height: 28px; border-radius: 6px; background: #e5e7eb; color: #64748b; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .sd-empty { text-align: center; padding: 48px 20px; color: #9ca3af; }
        .sd-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; }
        @media (max-width: 768px) { .sd-form-grid { grid-template-columns: 1fr 1fr; } .sd-form-group.full { grid-column: 1 / -1; } .sd-stats { grid-template-columns: 1fr 1fr; } .sd-items-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .sd-stats { grid-template-columns: 1fr; } .sd-items-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="sd-header">
        <h1>Vendeur d'Equipements</h1>
        <p>Gerez les equipements des packs Economique, Standard et Haut de gamme</p>
      </div>

      <div className="sd-container">
        <div className="sd-stats">
          {PACKAGES.map((p) => {
            const count = equipments.filter((e) => e.qualityLevel === p.key).length;
            const total = equipments.filter((e) => e.qualityLevel === p.key).reduce((s, e) => s + (e.price || 0), 0);
            return (
              <div key={p.key} className="sd-stat-card" style={{ cursor: "pointer" }} onClick={() => setActivePackage(p.key)}>
                <div className="sd-stat-icon" style={{ background: p.gradient, color: "white" }}>{p.icon}</div>
                <div className="sd-stat-value">{count}</div>
                <div className="sd-stat-label">{p.label}</div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: 4 }}>{total.toLocaleString()} DT total</div>
              </div>
            );
          })}
        </div>

        <div className="sd-pkg-tabs">
          {PACKAGES.map((p) => {
            const count = equipments.filter((e) => e.qualityLevel === p.key).length;
            return (
              <button
                key={p.key}
                className={`sd-pkg-tab ${activePackage === p.key ? "active" : ""}`}
                style={activePackage === p.key ? { background: p.gradient } : {}}
                onClick={() => setActivePackage(p.key)}
              >
                <div className="sd-pkg-tab-label" style={activePackage === p.key ? {} : { color: p.color }}>{p.label}</div>
                <div className="sd-pkg-tab-count">{count} equipements</div>
              </button>
            );
          })}
        </div>

        <div className="sd-bar">
          <div>
            <h2>{pkg?.label} - Catalogue</h2>
            <div className="sd-bar-meta">{filteredItems.length} equipements | {totalValue.toLocaleString()} DT</div>
          </div>
          <button className="sd-add-btn" onClick={() => { setForm({ ...form, qualityLevel: activePackage }); setShowForm(!showForm); }}>
            {showForm ? <><X size={14} /> Fermer</> : <><Plus size={14} /> Ajouter</>}
          </button>
        </div>

        {showForm && (
          <div className="sd-form-card">
            <div className="sd-form-title">
              <Package size={16} color={pkg?.color} />
              Nouvel equipement - {pkg?.label}
            </div>
            <form onSubmit={handleAdd}>
              <div className="sd-form-grid">
                <div className="sd-form-group">
                  <label>Nom du produit</label>
                  <input placeholder="Ex: Carrelage gres cerame" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="sd-form-group">
                  <label>Categorie</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="sd-form-group">
                  <label>Niveau de qualite</label>
                  <select value={form.qualityLevel} onChange={(e) => setForm({ ...form, qualityLevel: e.target.value })}>
                    {PACKAGES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                  </select>
                </div>
                <div className="sd-form-group">
                  <label>Unite</label>
                  <input placeholder="m2, piece, litre..." value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
                <div className="sd-form-group">
                  <label>Prix (DT)</label>
                  <input type="number" placeholder="Ex: 120" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="sd-form-group">
                  <label>Image (URL)</label>
                  <input placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
                <div className="sd-form-group full">
                  <label>Description</label>
                  <textarea placeholder="Decrivez le produit..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="sd-form-actions">
                <button type="submit" className="sd-btn-submit"><Plus size={12} /> Ajouter</button>
                <button type="button" className="sd-btn-cancel" onClick={() => setShowForm(false)}><X size={12} /> Annuler</button>
              </div>
            </form>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="sd-empty" style={{ background: "white", borderRadius: 14, border: "2px dashed #e5e7eb" }}>
            <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>Aucun equipement dans ce pack.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Ajoutez vos premiers equipements pour le pack {pkg?.label}.</p>
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([cat, catItems]) => {
            const catTotal = catItems.reduce((s, i) => s + (i.price || 0), 0);
            const catImg = catItems[0]?.image;
            return (
              <div key={cat} className="sd-cat-block">
                <div className="sd-cat-header">
                  <div className="sd-cat-title">
                    <div className="sd-cat-icon" style={{ background: pkg?.color + "20" }}>
                      {catImg ? <img src={catImg} alt="" /> : <span style={{ color: pkg?.color }}>{CATEGORIES.find((c) => c.value === cat)?.label?.[0] || "?"}</span>}
                    </div>
                    <div>
                      <div className="sd-cat-name">{CATEGORIES.find((c) => c.value === cat)?.label || cat}</div>
                      <div className="sd-cat-count">{catItems.length} equipement(s)</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="sd-cat-total">{catTotal.toLocaleString()} DT</span>
                    <span className="sd-badge" style={{ background: pkg?.color + "20", color: pkg?.color }}>{pkg?.badge}</span>
                  </div>
                </div>
                <div className="sd-items-grid">
                  {catItems.map((eq) => {
                    if (editingId === eq._id) {
                      return (
                        <div key={eq._id} style={{ border: `2px solid ${pkg?.color}`, borderRadius: 12, overflow: "hidden" }}>
                          <div className="sd-edit-bar">
                            <span style={{ fontSize: 11, fontWeight: 700, color: pkg?.color }}>Modifier</span>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              <input className="sd-edit-input" value={editForm.price} type="number" placeholder="Prix" onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                              <select className="sd-edit-select" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                              </select>
                              <div className="sd-edit-actions">
                                <button className="sd-btn-save" onClick={() => saveEdit(eq._id)} title="Enregistrer"><Check size={12} /></button>
                                <button className="sd-btn-x" onClick={cancelEdit} title="Annuler"><X size={12} /></button>
                              </div>
                            </div>
                          </div>
                          <input className="sd-edit-input" style={{ width: "calc(100% - 16px)", margin: "10px 8px 0" }} value={editForm.name} placeholder="Nom" onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                          <textarea className="sd-form-group" style={{ width: "calc(100% - 16px)", margin: "8px 8px 10px", padding: "6px 8px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 11, fontFamily: "inherit", resize: "vertical", minHeight: 50 }} value={editForm.description} placeholder="Description" onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                        </div>
                      );
                    }
                    return (
                      <div key={eq._id} className="sd-eq-card">
                        {eq.image ? (
                          <img className="sd-card-img" src={eq.image} alt={eq.name} />
                        ) : (
                          <div className="sd-card-img-placeholder"><Image size={28} color="#d1d5db" /></div>
                        )}
                        <div className="sd-card-body">
                          <div className="sd-card-name">{eq.name}</div>
                          <div className="sd-card-desc">{eq.description}</div>
                          <div className="sd-card-footer">
                            <div>
                              <div className="sd-card-price">{eq.price?.toLocaleString()} DT</div>
                              <div className="sd-card-unit">/{eq.unit}</div>
                            </div>
                            <div className="sd-card-actions">
                              <button className="sd-btn-edit" onClick={() => startEdit(eq)} title="Modifier"><Edit3 size={12} /></button>
                              <button className="sd-btn-delete" onClick={() => handleDelete(eq._id)} title="Supprimer"><Trash2 size={12} /></button>
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