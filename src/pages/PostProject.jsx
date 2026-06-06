import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Send } from "lucide-react";
import "./PostProject.css";

export default function PostProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    region: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.region) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      await createProject(form);
      toast.success("Projet publie avec succes !");
      setPublished(true);
    } catch (error) {
      toast.error("Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: "800px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pp-back { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 24px; transition: all 0.2s; }
        .pp-back:hover { background: #3b82f6; color: white; }
        .pp-header { margin-bottom: 32px; }
        .pp-header h1 { font-size: 28px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
        .pp-header p { font-size: 15px; color: #64748b; }
        .pp-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; }
        .pp-form-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; }
        .pp-success-card { background: white; border: 2px solid #10b981; border-radius: 20px; padding: 48px 32px; text-align: center; }
        .pp-success-icon { width: 72px; height: 72px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; }
        .pp-success-card h2 { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
        .pp-success-card p { color: #64748b; margin-bottom: 24px; font-size: 15px; }
        .pp-form-group { margin-bottom: 20px; }
        .pp-form-group label { display: block; font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .pp-form-group input, .pp-form-group textarea, .pp-form-group select { width: 100%; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #1e293b; outline: none; transition: all 0.2s; font-family: inherit; }
        .pp-form-group input:focus, .pp-form-group textarea:focus, .pp-form-group select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .pp-form-group textarea { resize: vertical; min-height: 120px; }
        .pp-actions { display: flex; gap: 12px; margin-top: 24px; }
        .pp-btn-submit { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .pp-btn-submit:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); }
        .pp-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .pp-btn-cancel { padding: 14px 20px; background: white; color: #64748b; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .pp-btn-cancel:hover { background: #f8fafc; }
        .pp-img-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; }
        .pp-img-card img { width: 100%; border-radius: 14px; }
        .pp-img-label { font-size: 13px; font-weight: 600; color: #64748b; margin-top: 10px; text-align: center; }
        @media (max-width: 900px) { .pp-layout { grid-template-columns: 1fr; } }
      `}</style>

      <button className="pp-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="pp-header">
        <h1>Publier mon projet</h1>
        <p>Decrivez votre projet pour attirer les meilleurs ingenieurs</p>
      </div>

      <div className="pp-layout">
        <div>
          {published ? (
            <div className="pp-success-card">
              <div className="pp-success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2>Projet publie avec succes !</h2>
              <p>Les ingenieurs partenaires peuvent desormais voir et repondre a votre projet.</p>
              <div className="pp-actions">
                <button className="pp-btn-submit" onClick={() => navigate("/quote")}>
                  <Send size={16} /> Generer le devis
                </button>
                <button className="pp-btn-cancel" onClick={() => { setPublished(false); setForm({ title: "", description: "", region: "" }); }}>
                  Publier un autre
                </button>
              </div>
            </div>
          ) : (
            <div className="pp-form-card">
              <form onSubmit={handleSubmit}>
                <div className="pp-form-group">
                  <label>Titre du projet *</label>
                  <input type="text" name="title" placeholder="Ex: Construction maison a Tunis" value={form.title} onChange={handleChange} required />
                </div>

                <div className="pp-form-group">
                  <label>Description *</label>
                  <textarea name="description" placeholder="Decrivez votre projet..." value={form.description} onChange={handleChange} required />
                </div>

                <div className="pp-form-group">
                  <label>Region *</label>
                  <select name="region" value={form.region} onChange={handleChange} required>
                    <option value="">Selectionner une region</option>
                    {["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabes", "Ariana", "Gafsa", "Monastir", "Nabeul", "Medenine", "Kasserine", "Beja", "Jendouba", "Ben Arous"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="pp-actions">
                  <button type="submit" className="pp-btn-submit" disabled={loading}>
                    <Send size={16} /> {loading ? "Publication..." : "Publier mon projet"}
                  </button>
                  <button type="button" className="pp-btn-cancel" onClick={() => navigate(-1)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div>
          <div className="pp-img-card">
            <img src="/images/Paid idea-rafiki.svg" alt="Projet" />
            <div className="pp-img-label">Votre partenaire de construction</div>
          </div>
        </div>
      </div>
    </div>
  );
}