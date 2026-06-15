import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Upload, FileText } from "lucide-react";
import RainbowLines from "../components/RainbowLines";

const REGIONS = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte",
  "Gabès", "Ariana", "Gafsa", "Monastir", "Ben Arous",
  "Nabeul", "Médenine", "Kasserine", "Béja", "Jendouba",
];

export default function EngineerProfileCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [form, setForm] = useState({
    speciality: "",
    region: "",
    description: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCvFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      toast.error("Veuillez sélectionner un fichier PDF");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.speciality || !form.region) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (cvFile) formData.append("cv", cvFile);

      const res = await API.post("/engineers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profil créé avec succès !");
      navigate("/ingenieur/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la création du profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: "700px", margin: "0 auto", fontFamily: "'Inter', sans-serif", position: "relative", zIndex: 1 }}>
      <RainbowLines variant="postproject" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .epc-back { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 24px; transition: all 0.2s; }
        .epc-back:hover { background: #3b82f6; color: white; }
        .epc-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 40px; }
        .epc-header { margin-bottom: 32px; }
        .epc-header h1 { font-size: 26px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
        .epc-header p { font-size: 14px; color: #64748b; }
        .epc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .epc-group { margin-bottom: 18px; }
        .epc-group.full { grid-column: 1 / -1; }
        .epc-group label { display: block; font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .epc-group label span { color: #ef4444; }
        .epc-group input, .epc-group select, .epc-group textarea { width: 100%; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #1e293b; outline: none; transition: all 0.2s; font-family: inherit; }
        .epc-group input:focus, .epc-group select:focus, .epc-group textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .epc-group textarea { resize: vertical; min-height: 100px; }
        .epc-cv-zone { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 18px; }
        .epc-cv-zone:hover { border-color: #3b82f6; background: #eff6ff; }
        .epc-cv-zone.has-file { border-color: #10b981; background: #f0fdf4; }
        .epc-cv-icon { color: #94a3b8; margin-bottom: 8px; }
        .epc-cv-text { font-size: 14px; color: #475569; }
        .epc-cv-hint { font-size: 12px; color: #94a3b8; margin-top: 4px; }
        .epc-cv-name { font-size: 14px; font-weight: 600; color: #10b981; display: flex; align-items: center; gap: 6px; justify-content: center; }
        .epc-submit { width: 100%; padding: 16px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; margin-top: 8px; }
        .epc-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(59,130,246,0.3); }
        .epc-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 600px) { .epc-grid { grid-template-columns: 1fr; } .epc-card { padding: 24px; } }
      `}</style>

      <button className="epc-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="epc-card">
        <div className="epc-header">
          <h1>Créer mon profil ingénieur</h1>
          <p>Remplissez vos informations pour être visible par les clients</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="epc-grid">
            <div className="epc-group">
              <label>Spécialité <span>*</span></label>
              <input type="text" name="speciality" placeholder="Ex: Génie civil" value={form.speciality} onChange={handleChange} required />
            </div>
            <div className="epc-group">
              <label>Région <span>*</span></label>
              <select name="region" value={form.region} onChange={handleChange} required>
                <option value="">-- Sélectionnez --</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="epc-group full">
              <label>Téléphone</label>
              <input type="tel" name="phone" placeholder="Ex: 55 123 456" value={form.phone} onChange={handleChange} />
            </div>
            <div className="epc-group full">
              <label>Description</label>
              <textarea name="description" placeholder="Parlez de votre expérience, vos réalisations..." value={form.description} onChange={handleChange} />
            </div>
          </div>

          <div className="epc-group full">
            <label>Curriculum Vitae (PDF)</label>
            <div className={`epc-cv-zone ${cvFile ? "has-file" : ""}`}>
              <input type="file" accept=".pdf" onChange={handleCvFile} id="epc-cv-input" style={{ display: "none" }} />
              <label htmlFor="epc-cv-input" style={{ cursor: "pointer", display: "block" }}>
                {cvFile ? (
                  <div className="epc-cv-name">
                    <FileText size={20} /> {cvFile.name}
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="epc-cv-icon" />
                    <div className="epc-cv-text">Cliquez pour déposer votre CV</div>
                    <div className="epc-cv-hint">Format PDF uniquement</div>
                  </>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="epc-submit" disabled={saving}>
            <Save size={20} /> {saving ? "Enregistrement..." : "Créer mon profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
