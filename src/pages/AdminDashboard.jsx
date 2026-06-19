import { useState, useEffect } from "react";
import { Users, HardHat, FileText, Mountain, Sofa, Settings, Check, Trash2, Calculator, Layers, Plus, Edit2, X } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [prices, setPrices]       = useState([]);
  const [estimations, setEstimations] = useState([]);
  const [materialRules, setMaterialRules] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [priceForm, setPriceForm] = useState({ region: "", pricePerM2: "" });
  const [ruleForm, setRuleForm] = useState({ type: "", nom: "", scenario: "standard", ratioParM2: "", unite: "" });
  const [editingRule, setEditingRule] = useState(null);

  const REGIONS = ["Tunis","Sfax","Sousse","Kairouan","Bizerte","Gabes","Ariana","Monastir","Nabeul","Medenine","Kasserine","Beja","Jendouba","Gafsa"];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, u, e, p, est, mr] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/users"),
          API.get("/engineers"),
          API.get("/region-prices"),
          API.get("/admin/estimations"),
          API.get("/admin/material-rules"),
        ]);
        setStats(s.data);
        setUsers(u.data);
        setEngineers(e.data);
        setPrices(p.data);
        setEstimations(est.data);
        setMaterialRules(mr.data);
      } catch (err) {
        toast.error("Erreur lors du chargement du dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleVerifyEngineer = async (id) => {
    try {
      await API.post(`/engineers/${id}/verify`);
      setEngineers(engineers.map(e => e._id === id ? {...e, isVerified: true} : e));
      toast.success("Ingenieur valide !");
    } catch {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success("Utilisateur supprime");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSavePrice = async (e) => {
    e.preventDefault();
    if (Number(priceForm.pricePerM2) <= 0) {
      toast.error("Le prix doit etre superieur a 0 DT/m2");
      return;
    }
    try {
      const res = await API.post("/region-prices", priceForm);
      setPrices(prev => {
        const exists = prev.find(p => p.region === res.data.region);
        return exists
          ? prev.map(p => p.region === res.data.region ? res.data : p)
          : [...prev, res.data];
      });
      setPriceForm({ region: "", pricePerM2: "" });
      toast.success("Prix mis a jour !");
    } catch {
      toast.error("Erreur lors de la mise a jour du prix");
    }
  };

  const roleLabel = {
    user: "Utilisateur", admin: "Admin", engineer: "Ingenieur",
    terrain_seller: "Vendeur terrain", equipment_seller: "Vendeur equipement",
  };

  const handleDeleteEstimation = async (id) => {
    if (!confirm("Supprimer cette estimation ?")) return;
    try {
      await API.delete(`/admin/estimations/${id}`);
      setEstimations(estimations.filter(e => e._id !== id));
      toast.success("Estimation supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    if (!ruleForm.type || !ruleForm.nom || !ruleForm.scenario || !ruleForm.ratioParM2 || !ruleForm.unite) {
      toast.error("Tous les champs sont requis");
      return;
    }
    try {
      if (editingRule) {
        const res = await API.put(`/admin/material-rules/${editingRule._id}`, ruleForm);
        setMaterialRules(materialRules.map(r => r._id === editingRule._id ? res.data : r));
        setEditingRule(null);
        toast.success("Règle mise à jour");
      } else {
        const res = await API.post("/admin/material-rules", ruleForm);
        setMaterialRules([...materialRules, res.data]);
        toast.success("Règle ajoutée");
      }
      setRuleForm({ type: "", nom: "", scenario: "standard", ratioParM2: "", unite: "" });
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteRule = async (id) => {
    if (!confirm("Supprimer cette règle ?")) return;
    try {
      await API.delete(`/admin/material-rules/${id}`);
      setMaterialRules(materialRules.filter(r => r._id !== id));
      toast.success("Règle supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const MATERIAUX_TYPES = [
    { value: "ciment", label: "Ciment" },
    { value: "sable_epure", label: "Sable épuré" },
    { value: "gravier", label: "Gravier" },
    { value: "parpaing", label: "Parpaing" },
    { value: "fer_ouvrage", label: "Fer ouvrage" },
    { value: "brique", label: "Brique" },
    { value: "enduit", label: "Enduit" },
    { value: "carrelage", label: "Carrelage" },
    { value: "isolation", label: "Isolation" },
    { value: "fer_rond_10", label: "Fer rond Ø10" },
    { value: "fer_rond_6", label: "Fer rond Ø6" },
    { value: "tube_pvc_125", label: "Tube PVC Ø125" },
    { value: "tube_pvc_75", label: "Tube PVC Ø75" },
    { value: "beton_dose", label: "Béton dosé" },
  ];

  if (loading) return <div className="loading">Chargement du dashboard...</div>;

  const statCards = [
    { icon: Users, label: "Utilisateurs",  value: stats?.users      || 0, color: "#ede9fe", accent: "#534AB7" },
    { icon: HardHat, label: "Ingenieurs",    value: stats?.engineers  || 0, color: "#dcfce7", accent: "#16a34a" },
    { icon: FileText, label: "Estimations",  value: stats?.estimations|| 0, color: "#fff7ed", accent: "#ea580c" },
    { icon: Mountain, label: "Terrains",     value: stats?.terrains   || 0, color: "#fef2f2", accent: "#dc2626" },
    { icon: Sofa, label: "Meubles",          value: stats?.furniture  || 0, color: "#f5f3ff", accent: "#7c3aed" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-brand">
          <Settings size={24} />
          <h2>Administration</h2>
        </div>
        <nav className="admin-nav">
          {[
            { id: "stats",     label: "Dashboard",      icon: FileText },
            { id: "users",     label: "Utilisateurs",   icon: Users },
            { id: "engineers", label: "Ingenieurs",     icon: HardHat },
            { id: "estimations", label: "Estimations",  icon: Calculator },
            { id: "materials", label: "Materiaux",      icon: Layers },
            { id: "prices",    label: "Prix regions",   icon: Mountain },
          ].map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-main">
        {activeTab === "stats" && (
          <>
            <div className="admin-section-header">
              <h2>Tableau de bord</h2>
              <p>Vue d'ensemble de la plateforme SmartBuild</p>
            </div>
            <div className="stats-grid">
              {statCards.map((s, i) => (
                <ScrollReveal key={i} delay={i * 0.1} direction="up">
                  <AnimatedCard className="stat-card" whileHover={{ scale: 1.02 }}>
                    <div className="stat-icon-wrap" style={{ background: s.color }}>
                      <s.icon size={28} style={{ color: s.accent }} />
                    </div>
                    <div className="stat-content">
                      <p className="stat-value">{s.value}</p>
                      <p className="stat-label">{s.label}</p>
                    </div>
                  </AnimatedCard>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div className="admin-section-header">
              <h2>Gestion des utilisateurs</h2>
              <p>{users.length} compte(s) enregistre(s)</p>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom</th><th>Email</th><th>Role</th><th>Inscrit le</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge role-${u.role}`}>{roleLabel[u.role]}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString("fr-TN")}</td>
                      <td>
                        {u.role !== "admin" && (
                          <AnimatedButton className="btn-table-delete" variant="destructive" onClick={() => handleDeleteUser(u._id)}>
                            <Trash2 size={16} />
                            Supprimer
                          </AnimatedButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "engineers" && (
          <>
            <div className="admin-section-header">
              <h2>Validation des ingenieurs</h2>
              <p>{engineers.filter(e => !e.isVerified).length} en attente de validation</p>
            </div>
            <div className="engineers-admin-list">
              {engineers.length === 0 ? (
                <div className="empty-state-admin">Aucun ingenieur enregistre.</div>
              ) : engineers.map((eng, i) => (
                <ScrollReveal key={eng._id} delay={i * 0.1} direction="up">
                  <AnimatedCard className="engineer-admin-card" whileHover={{ scale: 1.02 }}>
                    <div className="engineer-admin-info">
                      <div className="eng-admin-avatar">
                        <HardHat size={24} />
                      </div>
                      <div>
                        <h4>{eng.user?.name}</h4>
                        <p>{eng.speciality} - {eng.region}</p>
                        <p className="eng-admin-email">{eng.user?.email}</p>
                      </div>
                    </div>
                    <div className="engineer-admin-right">
                      {eng.isVerified ? (
                        <span className="verified-admin-badge">
                          <Check size={16} /> Verifie
                        </span>
                      ) : (
                        <AnimatedButton className="btn-verify" variant="primary" onClick={() => handleVerifyEngineer(eng._id)}>
                          <Check size={16} /> Valider
                        </AnimatedButton>
                      )}
                    </div>
                  </AnimatedCard>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}

        {activeTab === "estimations" && (
          <>
            <div className="admin-section-header">
              <h2>Gestion des estimations</h2>
              <p>{estimations.length} estimation(s) au total</p>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th><th>Surface</th><th>Scenario</th><th>Coût total</th><th>Statut</th><th>Date</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {estimations.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state-admin">Aucune estimation</td></tr>
                  ) : estimations.map(est => (
                    <tr key={est._id}>
                      <td><strong>{est.user?.name || "N/A"}</strong><br/><small>{est.user?.email}</small></td>
                      <td>{est.caracteristiques?.surface || est.construction?.surface || "-"} m²</td>
                      <td><span className={`role-badge role-${est.caracteristiques?.scenario || "standard"}`}>{est.caracteristiques?.scenario || "-"}</span></td>
                      <td>{est.totalCost ? est.totalCost.toLocaleString() + " DT" : "-"}</td>
                      <td>{est.status || "-"}</td>
                      <td>{new Date(est.createdAt).toLocaleDateString("fr-TN")}</td>
                      <td>
                        <AnimatedButton className="btn-table-delete" variant="destructive" onClick={() => handleDeleteEstimation(est._id)}>
                          <Trash2 size={16} /> Supprimer
                        </AnimatedButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "materials" && (
          <>
            <div className="admin-section-header">
              <h2>Règles de calcul des matériaux</h2>
              <p>{materialRules.length} règle(s) définie(s)</p>
            </div>

            <form className="price-form" onSubmit={handleSaveRule}>
              <div className="price-form-row" style={{ flexWrap: "wrap" }}>
                <select value={ruleForm.type} onChange={e => setRuleForm({...ruleForm, type: e.target.value})} required>
                  <option value="">-- Type --</option>
                  {MATERIAUX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input placeholder="Nom affiché" value={ruleForm.nom} onChange={e => setRuleForm({...ruleForm, nom: e.target.value})} required />
                <select value={ruleForm.scenario} onChange={e => setRuleForm({...ruleForm, scenario: e.target.value})} required>
                  <option value="eco">Eco</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
                <input type="number" placeholder="Ratio par m²" value={ruleForm.ratioParM2} min="0" step="0.01" onChange={e => setRuleForm({...ruleForm, ratioParM2: e.target.value})} required />
                <input placeholder="Unité" value={ruleForm.unite} onChange={e => setRuleForm({...ruleForm, unite: e.target.value})} required style={{ width: 100 }} />
                <button type="submit" className="btn-save-price">
                  {editingRule ? <><Edit2 size={14}/> Modifier</> : <><Plus size={14}/> Ajouter</>}
                </button>
                {editingRule && (
                  <button type="button" className="btn-save-price" style={{ background: "#6b7280" }} onClick={() => { setEditingRule(null); setRuleForm({ type: "", nom: "", scenario: "standard", ratioParM2: "", unite: "" }); }}>
                    <X size={14}/> Annuler
                  </button>
                )}
              </div>
            </form>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Type</th><th>Nom</th><th>Scenario</th><th>Ratio/m²</th><th>Unité</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materialRules.map(r => (
                    <tr key={r._id}>
                      <td>{r.type}</td>
                      <td><strong>{r.nom}</strong></td>
                      <td><span className={`role-badge role-${r.scenario}`}>{r.scenario}</span></td>
                      <td>{r.ratioParM2}</td>
                      <td>{r.unite}</td>
                      <td style={{ display: "flex", gap: 6 }}>
                        <AnimatedButton className="btn-table-delete" variant="outline" onClick={() => { setEditingRule(r); setRuleForm({ type: r.type, nom: r.nom, scenario: r.scenario, ratioParM2: r.ratioParM2, unite: r.unite }); }}>
                          <Edit2 size={14} />
                        </AnimatedButton>
                        <AnimatedButton className="btn-table-delete" variant="destructive" onClick={() => handleDeleteRule(r._id)}>
                          <Trash2 size={14} />
                        </AnimatedButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "prices" && (
          <>
            <div className="admin-section-header">
              <h2>Prix par region</h2>
              <p>Definissez le prix moyen du m2 de terrain par region</p>
            </div>

            <form className="price-form" onSubmit={handleSavePrice}>
              <div className="price-form-row">
                <select
                  value={priceForm.region}
                  onChange={e => setPriceForm({...priceForm, region: e.target.value})}
                  required
                >
                  <option value="">-- Choisir une region --</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Prix moyen DT/m2"
                  value={priceForm.pricePerM2}
                  min="1"
                  step="1"
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || Number(val) > 0) {
                      setPriceForm({...priceForm, pricePerM2: val});
                    }
                  }}
                  required
                />
                <button type="submit" className="btn-save-price">Enregistrer</button>
              </div>
            </form>

            <div className="prices-grid">
              {prices.map((p, i) => (
                <ScrollReveal key={i} delay={i * 0.05} direction="up">
                  <AnimatedCard className="price-card" whileHover={{ scale: 1.02 }}>
                    <Mountain size={20} className="price-icon" />
                    <span className="price-region">{p.region}</span>
                    <span className="price-value">{p.pricePerM2?.toLocaleString()} DT/m2</span>
                  </AnimatedCard>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}