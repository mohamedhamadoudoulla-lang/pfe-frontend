import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import { ArrowLeft, FileText, MessageCircle, Eye } from "lucide-react";

export default function ChooseEngineer() {
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    region: state?.region || "",
    speciality: "",
  });

  useEffect(() => {
    if (user?.role !== "user") {
      navigate("/");
      return;
    }

    API.get("/engineers")
      .then((res) => {
        const verified = res.data.filter((e) => e.isVerified);
        setEngineers(verified);
      })
      .catch(() => toast.error("Erreur chargement ingenieurs"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const filtered = engineers.filter((e) => {
    const matchRegion = !filter.region || e.region === filter.region;
    const matchSpec = !filter.speciality || e.speciality.toLowerCase().includes(filter.speciality.toLowerCase());
    return matchRegion && matchSpec;
  });

  const handleContact = (engineerId) => {
    navigate(`/messages/${engineerId}`);
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
      <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
      <p>Chargement des ingenieurs...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ce-back { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 24px; transition: all 0.2s; }
        .ce-back:hover { background: #3b82f6; color: white; }
        .ce-header { text-align: center; margin-bottom: 32px; }
        .ce-header h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
        .ce-header p { color: #64748b; }
        .ce-hero-img { width: 100%; max-width: 400px; margin: 0 auto 32px; display: block; }
        .ce-filters { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px; display: flex; gap: 16px; flex-wrap: wrap; }
        .ce-filter { flex: 1; min-width: 200px; }
        .ce-filter label { display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em; }
        .ce-filter input, .ce-filter select { width: 100%; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; transition: all 0.2s; }
        .ce-filter input:focus, .ce-filter select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .ce-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .ce-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; transition: all 0.3s; display: flex; flex-direction: column; gap: 16px; }
        .ce-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.1); transform: translateY(-4px); border-color: #3b82f6; }
        .ce-card-head { display: flex; align-items: center; gap: 16px; }
        .ce-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; flex-shrink: 0; }
        .ce-name { font-size: 18px; font-weight: 700; color: #1e293b; }
        .ce-speciality { font-size: 13px; color: #94a3b8; }
        .ce-verified { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #d1fae5; color: #10b981; border-radius: 100px; font-size: 12px; font-weight: 600; margin-top: 4px; }
        .ce-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .ce-detail { background: #f8fafc; padding: 12px; border-radius: 10px; }
        .ce-detail-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        .ce-detail-val { font-size: 15px; font-weight: 700; color: #1e293b; }
        .ce-cv-link { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 16px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 10px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .ce-cv-link:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(16,185,129,0.3); }
        .ce-actions { display: flex; gap: 12px; margin-top: auto; }
        .ce-btn { flex: 1; padding: 12px 16px; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ce-btn-pri { background: #3b82f6; color: white; }
        .ce-btn-pri:hover { background: #2563eb; transform: translateY(-2px); }
        .ce-btn-sec { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
        .ce-btn-sec:hover { background: white; border-color: #3b82f6; color: #3b82f6; }
        .ce-empty { text-align: center; padding: 80px 20px; background: white; border: 2px dashed #e2e8f0; border-radius: 16px; }
        .ce-empty h3 { font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 8px; }
        .ce-empty p { color: #64748b; }
        @media (max-width: 768px) { .ce-filters { flex-direction: column; } .ce-grid { grid-template-columns: 1fr; } .ce-details { grid-template-columns: 1fr; } .ce-actions { flex-direction: column; } }
      `}</style>

      <button className="ce-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="ce-header">
        <h1>Choisissez votre ingenieur</h1>
        <p>Trouvez le professionnel ideal pour votre projet</p>
      </div>

      <img src="/images/Construction costs-pana.svg" alt="Construction" className="ce-hero-img" />

      <div className="ce-filters">
        <div className="ce-filter">
          <label>Region</label>
          <input type="text" placeholder="Ex: Tunis, Sfax..." value={filter.region} onChange={(e) => setFilter({ ...filter, region: e.target.value })} />
        </div>
        <div className="ce-filter">
          <label>Specialite</label>
          <input type="text" placeholder="Ex: Genie civil..." value={filter.speciality} onChange={(e) => setFilter({ ...filter, speciality: e.target.value })} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="ce-empty">
          <h3>Aucun ingenieur trouve</h3>
          <p>Essayez de modifier vos filtres de recherche</p>
        </div>
      ) : (
        <div className="ce-grid">
          {filtered.map((eng, i) => (
            <ScrollReveal key={eng._id} delay={i * 0.1} direction="up">
              <AnimatedCard className="ce-card" whileHover={{ scale: 1.02 }}>
                <div className="ce-card-head">
                  <div className="ce-avatar">{eng.user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="ce-name">{eng.user?.name}</div>
                    <div className="ce-speciality">{eng.speciality}</div>
                    {eng.isVerified && <span className="ce-verified">✓ Verifie</span>}
                  </div>
                </div>

                <div className="ce-details">
                  <div className="ce-detail">
                    <div className="ce-detail-lbl">Region</div>
                    <div className="ce-detail-val">{eng.region}</div>
                  </div>
                  <div className="ce-detail">
                    <div className="ce-detail-lbl">Experience</div>
                    <div className="ce-detail-val">{eng.experience} ans</div>
                  </div>
                  <div className="ce-detail">
                    <div className="ce-detail-lbl">Note</div>
                    <div className="ce-detail-val">{eng.rating}/5</div>
                  </div>
                  <div className="ce-detail">
                    <div className="ce-detail-lbl">Tarif</div>
                    <div className="ce-detail-val">{eng.pricePerM2} DT/m2</div>
                  </div>
                </div>

                {eng.cv && (
                  <a href={eng.cv} target="_blank" rel="noopener noreferrer" className="ce-cv-link">
                    <FileText size={16} /> Voir / Telecharger CV
                  </a>
                )}

                <div className="ce-actions">
                  <AnimatedButton className="ce-btn ce-btn-pri" variant="primary" onClick={() => handleContact(eng.user?._id)}>
                    <MessageCircle size={16} /> Contacter
                  </AnimatedButton>
                  <AnimatedButton className="ce-btn ce-btn-sec" onClick={() => navigate(`/ingenieur/${eng._id}`)}>
                    <Eye size={16} /> Voir profil
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}