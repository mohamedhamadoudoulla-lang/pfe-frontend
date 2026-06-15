import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";
import { Upload, FileText } from "lucide-react";
import "./TerrainVendor.css";

const REGIONS = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte",
  "Gabès", "Ariana", "Gafsa", "Monastir", "Ben Arous",
  "Nabeul", "Médenine", "Kasserine", "Béja", "Jendouba"
];

export default function TerrainVendor() {
  const { user } = useAuth();
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planFile, setPlanFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    region: "",
    city: "",
    surface: "",
    pricePerM2: "",
    description: "",
    phone: "",
    email: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    loadTerrains();
  }, []);

  const loadTerrains = async () => {
    try {
      const res = await API.get("/terrains/vendor");
      setTerrains(res.data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanFile = (e) => {
    const file = e.target.files[0];
    if (file) setPlanFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.region || !form.surface || !form.pricePerM2) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (planFile) formData.append("plan", planFile);

      const res = await API.post("/terrains", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTerrains([...terrains, res.data]);
      setForm({
        title: "", region: "", city: "", surface: "",
        pricePerM2: "", description: "", phone: "", email: "",
        lat: "", lng: "",
      });
      setPlanFile(null);
      toast.success("✅ Terrain ajouté avec succès!");
    } catch (error) {
      toast.error("❌ Erreur lors de l'ajout du terrain");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/terrains/${id}`);
      setTerrains(terrains.filter(t => t._id !== id));
      toast.success("✅ Terrain supprimé!");
    } catch (error) {
      toast.error("❌ Erreur lors de la suppression");
    }
  };

  return (
    <div className="terrain-vendor-page">
      <div className="vendor-header">
        <h1>🏞️ Gestion des terrains</h1>
        <p>Vendeur: {user?.name}</p>
        <div className="vendor-stats">
          <span>📊 {terrains.length} terrain(s) en vente</span>
          <span>👁️ {terrains.filter(t => t.views > 0).length} terrain(s) consulté(s)</span>
          <span>✅ {terrains.filter(t => t.isSold).length} vendu(s)</span>
        </div>
      </div>

      <div className="vendor-container">
        <section className="vendor-section">
          <h2>📋 Mes terrains en vente</h2>
          {terrains.length === 0 ? (
            <div className="empty-state">
              <p>Aucun terrain en vente. Ajoutez-en un!</p>
            </div>
          ) : (
            <AnimatedStagger className="terrains-list" staggerDelay={0.1}>
              {terrains.map((terrain) => (
                <AnimatedStaggerItem key={terrain._id}>
                  <AnimatedCard className="terrain-item" whileHover={{ scale: 1.02 }}>
                    <div className="terrain-title">
                      <h4>{terrain.title}</h4>
                      <p className="region">📍 {terrain.region}</p>
                    </div>
                    <div className="terrain-info">
                      <span>📐 {terrain.surface} m²</span>
                      <span>💰 {terrain.pricePerM2} DT/m²</span>
                      <span>💵 Total: {terrain.totalPrice?.toLocaleString()} DT</span>
                    </div>
                    <div className="terrain-status">
                      <span className={`terrain-badge ${terrain.isSold ? "sold" : "available"}`}>
                        {terrain.isSold ? "Vendu" : "Disponible"}
                      </span>
                      <span className="terrain-views">👁️ {terrain.views || 0} consultation(s)</span>
                    </div>
                    {terrain.plan && (
                      <a href={terrain.plan} target="_blank" rel="noopener noreferrer" className="terrain-plan-link">
                        📄 Voir le plan
                      </a>
                    )}
                    {terrain.phone && <p className="terrain-contact">📞 {terrain.phone}</p>}
                    {terrain.email && <p className="terrain-contact">✉️ {terrain.email}</p>}
                    <AnimatedButton
                      className="delete-btn"
                      variant="destructive"
                      onClick={() => handleDelete(terrain._id)}
                    >
                      ✕ Supprimer
                    </AnimatedButton>
                  </AnimatedCard>
                </AnimatedStaggerItem>
              ))}
            </AnimatedStagger>
          )}
        </section>

        <section className="vendor-section">
          <h2>➕ Ajouter un terrain</h2>
          <form onSubmit={handleSubmit} className="add-terrain-form">
            <div className="form-group">
              <label>Titre *</label>
              <input type="text" name="title" placeholder="Ex: Terrain résidentiel Sfax" value={form.title} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Région *</label>
                <select name="region" value={form.region} onChange={handleChange} required>
                  <option value="">-- Sélectionnez --</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Ville</label>
                <input type="text" name="city" placeholder="Ville" value={form.city} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Surface (m²) *</label>
                <input type="number" name="surface" min="0" placeholder="500" value={form.surface} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Prix par m² (DT) *</label>
                <input type="number" name="pricePerM2" min="0" placeholder="500" value={form.pricePerM2} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" name="phone" placeholder="55 123 456" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="email@exemple.com" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" name="lat" step="any" placeholder="34.0" value={form.lat} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" name="lng" step="any" placeholder="9.5" value={form.lng} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" placeholder="Décrivez le terrain..." rows="3" value={form.description} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Plan du terrain (image/PDF)</label>
              <div style={{ border: "2px dashed #e2e8f0", borderRadius: "10px", padding: "20px", textAlign: "center", cursor: "pointer" }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handlePlanFile} id="plan-input" style={{ display: "none" }} />
                <label htmlFor="plan-input" style={{ cursor: "pointer", display: "block" }}>
                  <Upload size={28} style={{ color: "#94a3b8", marginBottom: "8px" }} />
                  <div style={{ fontSize: "14px", color: planFile ? "#10b981" : "#475569", fontWeight: planFile ? 600 : 400 }}>
                    {planFile ? <><FileText size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />{planFile.name}</> : "Cliquez pour ajouter un plan"}
                  </div>
                </label>
              </div>
            </div>

            <AnimatedButton type="submit" className="submit-btn" variant="primary" disabled={loading}>
              {loading ? "Ajout en cours..." : "📤 Ajouter le terrain"}
            </AnimatedButton>
          </form>
        </section>
      </div>
    </div>
  );
}
