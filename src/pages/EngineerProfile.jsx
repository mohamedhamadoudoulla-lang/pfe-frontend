import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEngineer } from "../services/api";
import { ArrowLeft, FileText, Download, CheckCircle, MapPin, Clock, Star } from "lucide-react";
import { AnimatedButton, AnimatedCard } from "@/components/animate";
import "./EngineerProfile.css";

export default function EngineerProfile() {
  const { id } = useParams();
  const [engineer, setEngineer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEngineer(id)
      .then((res) => setEngineer(res.data))
      .catch(() => navigate("/ingenieurs"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
      <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!engineer) return null;

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ep-back { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 24px; transition: all 0.2s; }
        .ep-back:hover { background: #3b82f6; color: white; }
        .ep-layout { display: grid; grid-template-columns: 1fr 400px; gap: 32px; align-items: start; }
        .ep-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; }
        .ep-hero { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }
        .ep-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; }
        .ep-name { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
        .ep-spec { font-size: 14px; color: #64748b; margin-bottom: 8px; }
        .ep-verified { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #d1fae5; color: #10b981; border-radius: 100px; font-size: 13px; font-weight: 600; }
        .ep-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
        .ep-stat { background: #f8fafc; padding: 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; }
        .ep-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #3b82f6; }
        .ep-stat-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .ep-stat-val { font-size: 18px; font-weight: 800; color: #1e293b; }
        .ep-section { margin-bottom: 20px; }
        .ep-section h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
        .ep-section p { font-size: 14px; color: #64748b; line-height: 1.7; }
        .ep-cv-section { margin-top: 24px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
        .ep-cv-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .ep-cv-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px 24px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .ep-cv-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(16,185,129,0.3); }
        .ep-img-col { display: flex; flex-direction: column; gap: 24px; }
        .ep-img-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; }
        .ep-img-card img { width: 100%; border-radius: 12px; }
        .ep-img-label { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 12px; }
        @media (max-width: 900px) { .ep-layout { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .ep-stats { grid-template-columns: 1fr; } }
      `}</style>

      <button className="ep-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="ep-layout">
        <div className="ep-card">
          <div className="ep-hero">
            <div className="ep-avatar">{engineer.user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="ep-name">{engineer.user?.name}</div>
              <div className="ep-spec">{engineer.speciality}</div>
              {engineer.isVerified && (
                <div className="ep-verified">
                  <CheckCircle size={14} /> Compte verifie
                </div>
              )}
            </div>
          </div>

          <div className="ep-stats">
            <div className="ep-stat">
              <div className="ep-stat-icon"><MapPin size={20} /></div>
              <div>
                <div className="ep-stat-lbl">Region</div>
                <div className="ep-stat-val">{engineer.region}</div>
              </div>
            </div>
            <div className="ep-stat">
              <div className="ep-stat-icon"><Clock size={20} /></div>
              <div>
                <div className="ep-stat-lbl">Experience</div>
                <div className="ep-stat-val">{engineer.experience} ans</div>
              </div>
            </div>
            <div className="ep-stat">
              <div className="ep-stat-icon"><Star size={20} /></div>
              <div>
                <div className="ep-stat-lbl">Note</div>
                <div className="ep-stat-val">{engineer.rating}/5</div>
              </div>
            </div>
            <div className="ep-stat">
              <div className="ep-stat-icon" style={{ background: "#fff7ed", color: "#f59e0b" }}>
                <FileText size={20} />
              </div>
              <div>
                <div className="ep-stat-lbl">Tarif</div>
                <div className="ep-stat-val">{engineer.pricePerM2} DT/m2</div>
              </div>
            </div>
          </div>

          {engineer.description && (
            <div className="ep-section">
              <h3>A propos</h3>
              <p>{engineer.description}</p>
            </div>
          )}

          <div className="ep-section">
            <h3>Contact</h3>
            <p>{engineer.user?.email}</p>
            {engineer.user?.phone && <p style={{ marginTop: "4px" }}>{engineer.user.phone}</p>}
          </div>

          {engineer.cv && (
            <div className="ep-cv-section">
              <div className="ep-cv-title">
                <FileText size={18} /> Curriculum Vitae
              </div>
              <a href={engineer.cv} target="_blank" rel="noopener noreferrer" className="ep-cv-btn">
                <Download size={18} /> Telecharger le CV
              </a>
            </div>
          )}
        </div>

        <div className="ep-img-col">
          <div className="ep-img-card">
            <img src="/images/Construction costs-pana.svg" alt="Ingenieur" />
            <div className="ep-img-label">Votre partenaire de construction</div>
          </div>
        </div>
      </div>
    </div>
  );
}