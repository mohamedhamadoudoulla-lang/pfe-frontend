import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { Edit3, Trash2, Plus, X, Check, Package, Hammer, Wrench, User, Mail, Phone, MapPin } from "lucide-react";
import "./VendorProducts.css";

const CATEGORIES_CONSTRUCTION = [
  { value: "gravier", label: "Gravier" },
  { value: "sable_epure", label: "Sable epure" },
  { value: "ciment", label: "Ciment" },
  { value: "fer_ouvrage", label: "Fer ouvrage" },
  { value: "beton_dose", label: "Beton dose" },
  { value: "brique", label: "Brique" },
  { value: "fer_rond_10", label: "Fer rond 10" },
  { value: "fer_rond_6", label: "Fer rond 6" },
  { value: "tube_pvc_125", label: "Tube PVC 125" },
  { value: "tube_pvc_75", label: "Tube PVC 75" },
];

const CATEGORIES_EQUIPMENT = [
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

const SCENARIOS = [
  { value: "eco", label: "Eco", color: "#10b981" },
  { value: "standard", label: "Standard", color: "#3b82f6" },
  { value: "premium", label: "Premium", color: "#7c3aed" },
];

export default function VendorProducts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("materiaux");
  const [products, setProducts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    nom: "", categorie: "", type: "", scenario: [], prixUnitaire: "", unite: "", stock: 0, image: "", description: "",
    shopName: "", shopEmail: "", shopAddress: "", shopPhone: "",
  });

  const [eqForm, setEqForm] = useState({
    name: "", category: "carrelage", qualityLevel: "standard", unit: "piece", price: "", description: "", image: "",
    shopName: "", shopEmail: "", shopAddress: "", shopPhone: "",
  });

  useEffect(() => {
    Promise.all([
      API.get("/products/vendor").then((res) => setProducts(res.data)).catch(() => setProducts([])),
      API.get("/equipment/vendor").then((res) => setEquipment(res.data)).catch(() => setEquipment([])),
    ]).finally(() => setLoading(false));
  }, []);

  const categories = activeTab === "materiaux" ? CATEGORIES_CONSTRUCTION : CATEGORIES_EQUIPMENT;
  const filteredProducts = activeTab === "materiaux"
    ? products.filter((p) => p.categorie === "materiaux").filter((p) => !searchTerm || p.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    : equipment.filter((p) => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleScenario = (val, isEdit = false) => {
    const setter = isEdit ? setEditForm : setForm;
    const state = isEdit ? editForm : form;
    const arr = state.scenario || [];
    setter({ ...state, scenario: arr.includes(val) ? arr.filter((s) => s !== val) : [...arr, val] });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (form.prixUnitaire < 0) return toast.error("Le prix ne peut pas etre negatif");
    try {
      const res = await API.post("/products", { ...form, categorie: "materiaux" });
      setProducts([res.data, ...products]);
      setShowForm(false);
      setForm({ nom: "", categorie: "", type: "", scenario: [], prixUnitaire: "", unite: "", stock: 0, image: "", description: "", shopName: "", shopEmail: "", shopAddress: "", shopPhone: "" });
      toast.success("Produit ajoute !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    if (eqForm.price < 0) return toast.error("Le prix ne peut pas etre negatif");
    try {
      const res = await API.post("/equipment", eqForm);
      setEquipment([res.data, ...equipment]);
      setShowForm(false);
      setEqForm({ name: "", category: "carrelage", qualityLevel: "standard", unit: "piece", price: "", description: "", image: "", shopName: "", shopEmail: "", shopAddress: "", shopPhone: "" });
      toast.success("Equipement ajoute !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Produit supprime");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!confirm("Supprimer cet equipement ?")) return;
    try {
      await API.delete(`/equipment/${id}`);
      setEquipment(equipment.filter((e) => e._id !== id));
      toast.success("Equipement supprime");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const startEditProduct = (p) => {
    setEditingId(p._id);
    setEditForm({ nom: p.nom, categorie: p.categorie, type: p.type, scenario: p.scenario || [], prixUnitaire: p.prixUnitaire, unite: p.unite, stock: p.stock || 0, image: p.image || "", description: p.description || "" });
  };

  const startEditEquipment = (eq) => {
    setEditingId(eq._id);
    setEditForm({ name: eq.name, category: eq.category, qualityLevel: eq.qualityLevel, unit: eq.unit, price: eq.price, description: eq.description || "", image: eq.image || "", shopName: eq.shopName || "", shopEmail: eq.shopEmail || "", shopAddress: eq.shopAddress || "", shopPhone: eq.shopPhone || "" });
  };

  const saveEditProduct = async (id) => {
    if (editForm.prixUnitaire < 0) return toast.error("Le prix ne peut pas etre negatif");
    try {
      const res = await API.put(`/products/${id}`, editForm);
      setProducts(products.map((p) => (p._id === id ? res.data : p)));
      setEditingId(null);
      toast.success("Produit modifie !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const saveEditEquipment = async (id) => {
    if (editForm.price < 0) return toast.error("Le prix ne peut pas etre negatif");
    try {
      const res = await API.put(`/equipment/${id}`, editForm);
      setEquipment(equipment.map((e) => (e._id === id ? res.data : e)));
      setEditingId(null);
      toast.success("Equipement modifie !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const totalStock = activeTab === "materiaux" ? filteredProducts.reduce((s, p) => s + (p.stock || 0), 0) : 0;
  const totalValue = activeTab === "materiaux" ? filteredProducts.reduce((s, p) => s + (p.prixUnitaire * (p.stock || 0)), 0) : filteredProducts.reduce((s, e) => s + (e.price || 0), 0);

  if (loading) return <div className="vp-loading">Chargement...</div>;

  return (
    <div className="vp-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .vp-page { min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; }
        .vp-header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 28px 24px; color: white; }
        .vp-header h1 { font-size: 22px; font-weight: 800; }
        .vp-header p { font-size: 13px; opacity: 0.8; margin-top: 4px; }
        .vp-container { max-width: 1100px; margin: 0 auto; padding: 20px 16px 120px; }
        .vp-profile-card { background: white; border-radius: 14px; padding: 20px; border: 1px solid #e5e7eb; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; }
        .vp-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: 800; flex-shrink: 0; }
        .vp-profile-info { flex: 1; }
        .vp-profile-name { font-size: 17px; font-weight: 700; color: #1f2937; }
        .vp-profile-role { font-size: 11px; color: #3b82f6; font-weight: 600; background: #eff6ff; padding: 2px 10px; border-radius: 12px; display: inline-block; margin-top: 4px; }
        .vp-profile-details { display: flex; gap: 16px; margin-top: 8px; flex-wrap: wrap; }
        .vp-profile-detail { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #6b7280; }
        .vp-tabs { display: flex; gap: 0; margin-bottom: 20px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; }
        .vp-tab { flex: 1; padding: 16px; border: none; background: white; cursor: pointer; text-align: center; font-family: inherit; font-size: 14px; font-weight: 700; color: #9ca3af; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .vp-tab.active { color: #3b82f6; background: #eff6ff; border-bottom: 3px solid #3b82f6; }
        .vp-tab:hover:not(.active) { background: #f9fafb; color: #64748b; }
        .vp-tab-count { font-size: 11px; background: #e5e7eb; padding: 2px 8px; border-radius: 10px; }
        .vp-tab.active .vp-tab-count { background: #3b82f6; color: white; }
        .vp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .vp-stat { background: white; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb; text-align: center; }
        .vp-stat-value { font-size: 22px; font-weight: 800; color: #1f2937; }
        .vp-stat-label { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .vp-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .vp-bar h2 { font-size: 18px; font-weight: 700; color: #1e293b; }
        .vp-bar-meta { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .vp-search { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; font-family: inherit; outline: none; width: 200px; }
        .vp-search:focus { border-color: #3b82f6; }
        .vp-add-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; background: #3b82f6; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .vp-add-btn:hover { background: #2563eb; }
        .vp-form-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        .vp-form-title { font-size: 15px; font-weight: 700; color: #1f293b; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .vp-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .vp-form-group { display: flex; flex-direction: column; }
        .vp-form-group label { font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 4px; }
        .vp-form-group input, .vp-form-group select, .vp-form-group textarea { padding: 9px 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #1f2937; font-family: inherit; outline: none; width: 100%; }
        .vp-form-group input:focus, .vp-form-group select:focus, .vp-form-group textarea:focus { border-color: #3b82f6; }
        .vp-form-group textarea { resize: vertical; min-height: 60px; }
        .vp-form-group.full { grid-column: 1 / -1; }
        .vp-form-actions { display: flex; gap: 8px; margin-top: 14px; }
        .vp-btn-submit { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .vp-btn-cancel { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: white; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .vp-scenario-btns { display: flex; gap: 6px; margin-top: 4px; }
        .vp-scenario-btn { padding: 5px 12px; border-radius: 6px; border: 1.5px solid #e5e7eb; background: white; font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .vp-scenario-btn.selected { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; }
        .vp-product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
        .vp-product-card { background: white; border: 2px solid #e5e7eb; border-radius: 14px; overflow: hidden; transition: all 0.2s; }
        .vp-product-card:hover { border-color: #3b82f6; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .vp-product-card.editing { border-color: #3b82f6; background: #f8fafc; }
        .vp-card-header { padding: 14px 16px 0; display: flex; justify-content: space-between; align-items: flex-start; }
        .vp-card-type { font-size: 10px; font-weight: 700; color: #3b82f6; background: #eff6ff; padding: 2px 8px; border-radius: 8px; }
        .vp-card-actions { display: flex; gap: 4px; }
        .vp-btn-edit { width: 28px; height: 28px; border-radius: 6px; background: #f3f4f6; color: #64748b; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .vp-btn-edit:hover { background: #3b82f6; color: white; }
        .vp-btn-delete { width: 28px; height: 28px; border-radius: 6px; background: #fef2f2; color: #dc2626; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .vp-btn-delete:hover { background: #dc2626; color: white; }
        .vp-card-body { padding: 10px 16px 16px; }
        .vp-card-name { font-size: 14px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
        .vp-card-desc { font-size: 11px; color: #9ca3af; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .vp-card-meta { display: flex; justify-content: space-between; align-items: center; }
        .vp-card-price { font-size: 18px; font-weight: 800; color: #3b82f6; }
        .vp-card-unit { font-size: 11px; color: #9ca3af; }
        .vp-card-stock { font-size: 11px; color: #6b7280; }
        .vp-card-scenarios { display: flex; gap: 4px; margin-top: 8px; }
        .vp-card-scenario { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .vp-edit-section { padding: 14px 16px; background: #f8fafc; }
        .vp-edit-row { display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
        .vp-edit-input { padding: 7px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; font-family: inherit; outline: none; flex: 1; min-width: 100px; }
        .vp-edit-input:focus { border-color: #3b82f6; }
        .vp-edit-actions { display: flex; gap: 4px; justify-content: flex-end; margin-top: 8px; }
        .vp-btn-save { padding: 6px 14px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .vp-btn-x { padding: 6px 10px; background: #e5e7eb; color: #64748b; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .vp-empty { text-align: center; padding: 48px 20px; background: white; border-radius: 14px; border: 2px dashed #e5e7eb; color: #9ca3af; }
        .vp-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-size: 16px; color: #64748b; font-family: 'Inter', sans-serif; }
        @media (max-width: 768px) { .vp-form-grid { grid-template-columns: 1fr 1fr; } .vp-stats { grid-template-columns: 1fr 1fr; } .vp-product-grid { grid-template-columns: 1fr; } .vp-profile-card { flex-direction: column; text-align: center; } .vp-profile-details { justify-content: center; } }
        @media (max-width: 480px) { .vp-stats { grid-template-columns: 1fr; } .vp-bar { flex-direction: column; gap: 10px; align-items: flex-start; } }
      `}</style>

        <div className="vp-header">
          <h1>Mes Produits</h1>
          <p>Gerez vos produits de construction et d'equipements</p>
        </div>

        <div className="vp-container">
          <div className="vp-profile-card">
            <div className="vp-avatar">{user?.name?.[0]?.toUpperCase() || "V"}</div>
            <div className="vp-profile-info">
              <div className="vp-profile-name">{user?.name || "Vendeur"}</div>
              <div className="vp-profile-role">Vendeur d'equipements</div>
              <div className="vp-profile-details">
                {user?.email && <div className="vp-profile-detail"><Mail size={12} /> {user.email}</div>}
                {user?.phone && <div className="vp-profile-detail"><Phone size={12} /> {user.phone}</div>}
                {user?.address && <div className="vp-profile-detail"><MapPin size={12} /> {user.address}</div>}
              </div>
            </div>
          </div>

          <div className="vp-tabs">
            <button className={`vp-tab ${activeTab === "materiaux" ? "active" : ""}`} onClick={() => { setActiveTab("materiaux"); setShowForm(false); setEditingId(null); }}>
              <Hammer size={16} /> Produits de construction
              <span className="vp-tab-count">{products.filter((p) => p.categorie === "materiaux").length}</span>
            </button>
            <button className={`vp-tab ${activeTab === "equipement" ? "active" : ""}`} onClick={() => { setActiveTab("equipement"); setShowForm(false); setEditingId(null); }}>
              <Wrench size={16} /> Equipements
              <span className="vp-tab-count">{equipment.length}</span>
            </button>
          </div>

          <div className="vp-stats">
            <div className="vp-stat">
              <div className="vp-stat-value">{filteredProducts.length}</div>
              <div className="vp-stat-label">{activeTab === "materiaux" ? "Produits" : "Equipements"}</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-value">{totalStock}</div>
              <div className="vp-stat-label">Stock total</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-value">{totalValue.toLocaleString()} DT</div>
              <div className="vp-stat-label">{activeTab === "materiaux" ? "Valeur du stock" : "Valeur totale"}</div>
            </div>
          </div>

          <div className="vp-bar">
            <div>
              <h2>{activeTab === "materiaux" ? "Produits de construction" : "Equipements"}</h2>
              <div className="vp-bar-meta">{filteredProducts.length} element(s)</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input className="vp-search" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className="vp-add-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                {showForm ? <><X size={14} /> Fermer</> : <><Plus size={14} /> Ajouter</>}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="vp-form-card">
              <div className="vp-form-title">
                <Package size={16} color="#3b82f6" />
                {activeTab === "materiaux" ? "Nouveau produit de construction" : "Nouvel equipement"}
              </div>
              <form onSubmit={activeTab === "materiaux" ? handleAddProduct : handleAddEquipment}>
                <div className="vp-form-grid">
                  {activeTab === "materiaux" ? (
                    <>
                      <div className="vp-form-group">
                        <label>Nom du produit</label>
                        <input placeholder="Ex: Ciment Portland 42.5" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
                      </div>
                      <div className="vp-form-group">
                        <label>Categorie</label>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                          <option value="">-- Choisir --</option>
                          {CATEGORIES_CONSTRUCTION.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="vp-form-group">
                        <label>Prix unitaire (DT)</label>
                        <input type="number" min="0" step="0.01" placeholder="Ex: 45" value={form.prixUnitaire} onChange={(e) => setForm({ ...form, prixUnitaire: e.target.value })} required />
                      </div>
                      <div className="vp-form-group">
                        <label>Unite</label>
                        <input placeholder="kg, m2, piece, lot..." value={form.unite} onChange={(e) => setForm({ ...form, unite: e.target.value })} required />
                      </div>
                      <div className="vp-form-group">
                        <label>Stock</label>
                        <input type="number" min="0" placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                      </div>
                      <div className="vp-form-group">
                        <label>Image (URL)</label>
                        <input placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                      </div>
                      <div className="vp-form-group full">
                        <label>Scenarios</label>
                        <div className="vp-scenario-btns">
                          {SCENARIOS.map((s) => (
                            <button key={s.value} type="button" className={`vp-scenario-btn ${form.scenario.includes(s.value) ? "selected" : ""}`} style={form.scenario.includes(s.value) ? { borderColor: s.color, background: s.color + "10", color: s.color } : {}} onClick={() => toggleScenario(s.value)}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="vp-form-group">
                        <label>Nom</label>
                        <input placeholder="Ex: Carrelage ceramique 60x60" value={eqForm.name} onChange={(e) => setEqForm({ ...eqForm, name: e.target.value })} required />
                      </div>
                      <div className="vp-form-group">
                        <label>Categorie</label>
                        <select value={eqForm.category} onChange={(e) => setEqForm({ ...eqForm, category: e.target.value })} required>
                          {CATEGORIES_EQUIPMENT.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="vp-form-group">
                        <label>Qualite</label>
                        <select value={eqForm.qualityLevel} onChange={(e) => setEqForm({ ...eqForm, qualityLevel: e.target.value })} required>
                          <option value="budget">Budget</option>
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                          <option value="luxe">Luxe</option>
                        </select>
                      </div>
                      <div className="vp-form-group">
                        <label>Prix (DT)</label>
                        <input type="number" min="0" step="0.01" placeholder="Ex: 120" value={eqForm.price} onChange={(e) => setEqForm({ ...eqForm, price: e.target.value })} required />
                      </div>
                      <div className="vp-form-group">
                        <label>Unite</label>
                        <input placeholder="piece, m2, lot..." value={eqForm.unit} onChange={(e) => setEqForm({ ...eqForm, unit: e.target.value })} required />
                      </div>
                      <div className="vp-form-group">
                        <label>Image (URL)</label>
                        <input placeholder="https://..." value={eqForm.image} onChange={(e) => setEqForm({ ...eqForm, image: e.target.value })} />
                      </div>
                    </>
                  )}
                  <div className="vp-form-group full">
                    <label>Description</label>
                    <textarea placeholder="Decrivez le produit..." value={activeTab === "materiaux" ? form.description : eqForm.description} onChange={(e) => activeTab === "materiaux" ? setForm({ ...form, description: e.target.value }) : setEqForm({ ...eqForm, description: e.target.value })} />
                  </div>
                  <div className="vp-form-group full" style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, marginTop: 4 }}>
                    <label style={{ fontSize: 13, color: "#3b82f6", marginBottom: 10, display: "block" }}>Informations boutique</label>
                  </div>
                  <div className="vp-form-group">
                    <label>Nom de la boutique</label>
                    <input placeholder="Ex: Maison Du Batiment" value={activeTab === "materiaux" ? form.shopName : eqForm.shopName} onChange={(e) => activeTab === "materiaux" ? setForm({ ...form, shopName: e.target.value }) : setEqForm({ ...eqForm, shopName: e.target.value })} required />
                  </div>
                  <div className="vp-form-group">
                    <label>Email de la boutique</label>
                    <input type="email" placeholder="contact@boutique.tn" value={activeTab === "materiaux" ? form.shopEmail : eqForm.shopEmail} onChange={(e) => activeTab === "materiaux" ? setForm({ ...form, shopEmail: e.target.value }) : setEqForm({ ...eqForm, shopEmail: e.target.value })} required />
                  </div>
                  <div className="vp-form-group">
                    <label>Adresse de la boutique</label>
                    <input placeholder="Rue, ville, governement" value={activeTab === "materiaux" ? form.shopAddress : eqForm.shopAddress} onChange={(e) => activeTab === "materiaux" ? setForm({ ...form, shopAddress: e.target.value }) : setEqForm({ ...eqForm, shopAddress: e.target.value })} required />
                  </div>
                  <div className="vp-form-group">
                    <label>Telephone de la boutique</label>
                    <input placeholder="XX XXX XXX" value={activeTab === "materiaux" ? form.shopPhone : eqForm.shopPhone} onChange={(e) => activeTab === "materiaux" ? setForm({ ...form, shopPhone: e.target.value }) : setEqForm({ ...eqForm, shopPhone: e.target.value })} required />
                  </div>
                </div>
                <div className="vp-form-actions">
                  <button type="submit" className="vp-btn-submit"><Plus size={12} /> Ajouter</button>
                  <button type="button" className="vp-btn-cancel" onClick={() => setShowForm(false)}><X size={12} /> Annuler</button>
                </div>
              </form>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="vp-empty">
              <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p>Aucun {activeTab === "materiaux" ? "produit de construction" : "equipement"}.</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Ajoutez vos premiers elements.</p>
            </div>
          ) : (
            <div className="vp-product-grid">
              {filteredProducts.map((p) => {
                const isEquipment = activeTab === "equipement";
                const itemId = isEquipment ? p._id : p._id;
                const isEditing = editingId === itemId;

                if (isEditing) {
                  return (
                    <div key={itemId} className="vp-product-card editing">
                      <div className="vp-edit-section">
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", marginBottom: 8 }}>Modifier {isEquipment ? "l'equipement" : "le produit"}</div>
                        <div className="vp-edit-row">
                          <input className="vp-edit-input" value={editForm.nom || editForm.name || ""} placeholder="Nom" onChange={(e) => isEquipment ? setEditForm({ ...editForm, name: e.target.value }) : setEditForm({ ...editForm, nom: e.target.value })} />
                        </div>
                        <div className="vp-edit-row">
                          <select className="vp-edit-input" value={editForm.type || editForm.category || ""} onChange={(e) => isEquipment ? setEditForm({ ...editForm, category: e.target.value }) : setEditForm({ ...editForm, type: e.target.value })}>
                            <option value="">Type</option>
                            {(isEquipment ? CATEGORIES_EQUIPMENT : CATEGORIES_CONSTRUCTION).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                          <input className="vp-edit-input" type="number" min="0" step="0.01" value={editForm.prixUnitaire || editForm.price || ""} placeholder="Prix" onChange={(e) => isEquipment ? setEditForm({ ...editForm, price: e.target.value }) : setEditForm({ ...editForm, prixUnitaire: e.target.value })} />
                        </div>
                        <div className="vp-edit-row">
                          <input className="vp-edit-input" value={editForm.unite || editForm.unit || ""} placeholder="Unite" onChange={(e) => isEquipment ? setEditForm({ ...editForm, unit: e.target.value }) : setEditForm({ ...editForm, unite: e.target.value })} />
                          {!isEquipment && <input className="vp-edit-input" type="number" min="0" value={editForm.stock || ""} placeholder="Stock" onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />}
                          {isEquipment && (
                            <select className="vp-edit-input" value={editForm.qualityLevel || "standard"} onChange={(e) => setEditForm({ ...editForm, qualityLevel: e.target.value })}>
                              <option value="budget">Budget</option>
                              <option value="standard">Standard</option>
                              <option value="premium">Premium</option>
                              <option value="luxe">Luxe</option>
                            </select>
                          )}
                        </div>
                        {!isEquipment && (
                          <div className="vp-edit-row">
                            <div className="vp-scenario-btns">
                              {SCENARIOS.map((s) => (
                                <button key={s.value} type="button" className={`vp-scenario-btn ${(editForm.scenario || []).includes(s.value) ? "selected" : ""}`} style={(editForm.scenario || []).includes(s.value) ? { borderColor: s.color, background: s.color + "10", color: s.color } : {}} onClick={() => toggleScenario(s.value, true)}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="vp-edit-row">
                          <textarea className="vp-edit-input" style={{ minHeight: 50, resize: "vertical" }} value={editForm.description || ""} placeholder="Description" onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                        </div>
                        <div className="vp-edit-actions">
                          <button className="vp-btn-save" onClick={() => isEquipment ? saveEditEquipment(itemId) : saveEditProduct(itemId)}><Check size={12} /> Enregistrer</button>
                          <button className="vp-btn-x" onClick={() => setEditingId(null)}><X size={12} /> Annuler</button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={itemId} className="vp-product-card">
                    <div className="vp-card-header">
                      <span className="vp-card-type">{(isEquipment ? CATEGORIES_EQUIPMENT : CATEGORIES_CONSTRUCTION).find((c) => c.value === (p.category || p.type))?.label || p.category || p.type}</span>
                      <div className="vp-card-actions">
                        <button className="vp-btn-edit" onClick={() => isEquipment ? startEditEquipment(p) : startEditProduct(p)} title="Modifier"><Edit3 size={12} /></button>
                        <button className="vp-btn-delete" onClick={() => isEquipment ? handleDeleteEquipment(itemId) : handleDeleteProduct(itemId)} title="Supprimer"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="vp-card-body">
                      <div className="vp-card-name">{p.nom || p.name}</div>
                      <div className="vp-card-desc">{p.description}</div>
                      <div className="vp-card-meta">
                        <div className="vp-card-price">{(p.prixUnitaire || p.price || 0).toLocaleString()} DT <span className="vp-card-unit">/{p.unite || p.unit}</span></div>
                        {!isEquipment && <div className="vp-card-stock">Stock: {p.stock || 0}</div>}
                        {isEquipment && <div className="vp-card-stock">{p.qualityLevel || "standard"}</div>}
                      </div>
                      {!isEquipment && p.scenario?.length > 0 && (
                        <div className="vp-card-scenarios">
                          {p.scenario.map((s) => {
                            const sc = SCENARIOS.find((x) => x.value === s);
                            return <span key={s} className="vp-card-scenario" style={{ background: sc?.color + "15", color: sc?.color }}>{sc?.label || s}</span>;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
