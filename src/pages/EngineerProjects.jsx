import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApplications } from "../services/api";
import API from "../services/api";
import toast from "react-hot-toast";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";

export default function EngineerProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [applyForm, setApplyForm] = useState({ projectId: null, message: "" });
  const [cvFile, setCvFile] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getApplications()
      .then((res) => {
        setProjects(res.data);
        toast.success(`${res.data.length} projet(s) disponible(s)`);
      })
      .catch(() => toast.error("Erreur chargement des projets"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? projects
    : projects.filter((p) => p.status === filter);

  const handleApply = async (projectId) => {
    if (!applyForm.message.trim()) {
      toast.error("Écrivez un message de candidature");
      return;
    }
    setSending(true);
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("message", applyForm.message);
    if (cvFile) formData.append("cv", cvFile);
    try {
      await API.post("/applications", formData);
      toast.success("✅ Candidature envoyée !");
      setApplyForm({ projectId: null, message: "" });
      setCvFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur envoi");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="loading">Chargement des projets...</div>;

  return (
    <>
      <style>
        {`
/* ================================================================
   EngineerProjects — Modern Blue & White Theme
   ========================================================== */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --primary: #0ea5e9;
  --primary-dark: #0284c7;
  --success: #10b981;
  --warning: #f59e0b;
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-secondary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --border: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
}

/* ── Page ─────────────────────────────────────────────────── */
.eng-projects-page {
  min-height: 100vh;
  padding: 32px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── Header ───────────────────────────────────────────────── */
.eng-projects-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
}

.eng-projects-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}

.eng-projects-header p {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.eng-projects-header strong {
  color: var(--primary);
}

.projects-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
}

/* ── Filter bar ───────────────────────────────────────────── */
.eng-filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.eng-filter-btn {
  padding: 10px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.eng-filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: #e0f2fe;
}

.eng-filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

/* ── Empty state ──────────────────────────────────────────── */
.eng-empty {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
}

.eng-empty span {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
  opacity: 0.3;
}

.eng-empty p {
  font-size: 1rem;
  color: var(--text-secondary);
}

/* ── Projects grid ────────────────────────────────────────── */
.eng-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

/* ── Project card ─────────────────────────────────────────── */
.eng-project-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.eng-project-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
  border-color: var(--primary);
}

/* ── Card top ─────────────────────────────────────────────── */
.eng-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.eng-card-top h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  flex: 1;
}

.eng-card-region {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

.eng-status-badge {
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.eng-status-badge.status-ouvert {
  background: #d1fae5;
  color: var(--success);
  border: 1px solid var(--success);
}

.eng-status-badge.status-en_cours {
  background: #fef3c7;
  color: var(--warning);
  border: 1px solid var(--warning);
}

.eng-status-badge.status-terminé {
  background: var(--bg-secondary);
  color: var(--text-tertiary);
  border: 1px solid var(--border);
}

/* ── Card description ─────────────────────────────────────── */
.eng-card-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ── Toggle / Expanded ───────────────────────────────────── */
.eng-toggle-btn {
  width: 100%; padding: 8px; background: transparent; border: 1px solid var(--border);
  border-radius: var(--radius-sm); font-family: inherit; font-size: 0.8rem;
  font-weight: 600; color: var(--text-tertiary); cursor: pointer;
  transition: all 0.2s;
}
.eng-toggle-btn:hover { border-color: var(--primary); color: var(--primary); }

.eng-expanded {
  display: flex; flex-direction: column; gap: 8px;
  padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm);
}
.eng-exp-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; }
.eng-exp-row span { color: var(--text-tertiary); }
.eng-exp-row strong { color: var(--text-primary); }
.eng-exp-desc span { font-size: 0.8rem; font-weight: 600; color: var(--text-tertiary); display: block; margin-bottom: 4px; }
.eng-exp-desc p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

/* ── Card details ─────────────────────────────────────────── */
.eng-card-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.eng-detail {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.eng-detail span {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.eng-detail strong {
  font-size: 0.95rem;
  color: var(--text-primary);
}

/* ── Card client ──────────────────────────────────────────── */
.eng-card-client {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #e0f2fe;
  border-left: 3px solid var(--primary);
  border-radius: var(--radius-sm);
}

.eng-card-client > span {
  font-size: 1.5rem;
}

.eng-card-client p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 2px 0;
}

.eng-card-client strong {
  color: var(--text-primary);
}

/* ── Card date ────────────────────────────────────────────── */
.eng-card-date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

/* ── Apply form ───────────────────────────────────────────── */
.eng-apply-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.eng-apply-form textarea {
  width: 100%;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
  resize: vertical;
  transition: all 0.2s;
}

.eng-apply-form textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}

.eng-apply-row {
  display: flex;
  gap: 8px;
}

.eng-apply-row input {
  flex: 1;
  padding: 10px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s;
}

.eng-apply-row input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}

.btn-send-apply,
.btn-cancel-apply {
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-send-apply {
  background: linear-gradient(135deg, var(--success), #059669);
  color: white;
}

.btn-send-apply:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16,185,129,0.3);
}

.btn-send-apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel-apply {
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-cancel-apply:hover {
  background: var(--bg-secondary);
  border-color: var(--text-secondary);
}

/* ── Button postuler ──────────────────────────────────────── */
.btn-postuler {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-postuler:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14,165,233,0.3);
}

.btn-postuler:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--bg-secondary);
  color: var(--text-tertiary);
}

/* ── Loading ──────────────────────────────────────────────── */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1rem;
  color: var(--text-secondary);
}

/* ── CV Input ────────────────────────────────────────────── */
.eng-cv-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}
.eng-cv-input label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.eng-cv-input input[type="file"] {
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.eng-cv-name {
  font-size: 0.8rem;
  color: var(--primary);
  font-weight: 500;
}

.eng-applied-badge {
  display: block;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--success);
  background: #ecfdf5;
  padding: 10px;
  border-radius: var(--radius-sm);
  margin-top: 12px;
}

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 768px) {
  .eng-projects-page {
    padding: 20px 12px;
  }

  .eng-projects-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .eng-projects-header h1 {
    font-size: 1.5rem;
  }

  .eng-projects-grid {
    grid-template-columns: 1fr;
  }

  .eng-card-details {
    grid-template-columns: 1fr;
  }

  .eng-apply-row {
    flex-direction: column;
  }
}
        `}
      </style>

      <div className="eng-projects-page">
        {/* Header */}
        <div className="eng-projects-header">
          <div>
            <h1>📋 Projets disponibles</h1>
            <p>
              Bonjour <strong>{user?.name}</strong> — trouvez des projets à réaliser
            </p>
          </div>
          <span className="projects-count-badge">{projects.length} projet(s)</span>
        </div>

        {/* Filtres */}
        {projects.length > 0 && (
          <div className="eng-filter-bar">
            {[
              { key: "all", label: `Tous (${projects.length})` },
              {
                key: "ouvert",
                label: `Ouverts (${projects.filter((p) => p.status === "ouvert").length})`,
              },
              {
                key: "en_cours",
                label: `En cours (${projects.filter((p) => p.status === "en_cours").length})`,
              },
            ].map((f) => (
              <AnimatedButton
                key={f.key}
                className={`eng-filter-btn ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </AnimatedButton>
            ))}
          </div>
        )}

        {/* Liste */}
        {filtered.length === 0 ? (
          <div className="eng-empty">
            <span>📭</span>
            <p>Aucun projet disponible pour le moment.</p>
          </div>
        ) : (
          <AnimatedStagger className="eng-projects-grid" staggerDelay={0.1}>
            {filtered.map((project) => (
              <AnimatedStaggerItem key={project._id}>
                <AnimatedCard className="eng-project-card" whileHover={{ scale: 1.02 }}>
                  {/* Top */}
                  <div className="eng-card-top">
                    <div>
                      <h3>{project.title}</h3>
                      <p className="eng-card-region">📍 {project.region}</p>
                    </div>
                    <span className={`eng-status-badge status-${project.status}`}>
                      {project.status === "ouvert" && "Ouvert"}
                      {project.status === "en_cours" && "En cours"}
                      {project.status === "terminé" && "Terminé"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="eng-card-desc">{project.description}</p>

                  {/* Détails */}
                  <div className="eng-card-details">
                    {project.surface && (
                      <div className="eng-detail">
                        <span>📐 Surface</span>
                        <strong>{project.surface} m²</strong>
                      </div>
                    )}
                    {project.floors && (
                      <div className="eng-detail">
                        <span>🏢 Étages</span>
                        <strong>{project.floors}</strong>
                      </div>
                    )}
                    {project.finitionLevel && (
                      <div className="eng-detail">
                        <span>✨ Finition</span>
                        <strong>{project.finitionLevel}</strong>
                      </div>
                    )}
                    {project.budget && (
                      <div className="eng-detail">
                        <span>💰 Budget</span>
                        <strong>{Number(project.budget).toLocaleString()} DT</strong>
                      </div>
                    )}
                    {project.constructionType && (
                      <div className="eng-detail">
                        <span>🏗️ Type</span>
                        <strong>{project.constructionType}</strong>
                      </div>
                    )}
                    {project.status === "ouvert" && project.deadline && (
                      <div className="eng-detail">
                        <span>📅 Date limite</span>
                        <strong>{new Date(project.deadline).toLocaleDateString("fr-TN")}</strong>
                      </div>
                    )}
                  </div>

                  {/* Voir plus */}
                  <button
                    className="eng-toggle-btn"
                    onClick={() => setExpandedId(expandedId === project._id ? null : project._id)}
                  >
                    {expandedId === project._id ? "▲ Moins de détails" : "▼ Voir plus de détails"}
                  </button>

                  {expandedId === project._id && (
                    <div className="eng-expanded">
                      {project.region && (
                        <div className="eng-exp-row">
                          <span>📍 Région</span>
                          <strong>{project.region}</strong>
                        </div>
                      )}
                      {project.terrainSurface && (
                        <div className="eng-exp-row">
                          <span>📐 Surface terrain</span>
                          <strong>{project.terrainSurface} m²</strong>
                        </div>
                      )}
                      {project.nature && (
                        <div className="eng-exp-row">
                          <span>🏗️ Nature</span>
                          <strong>{project.nature}</strong>
                        </div>
                      )}
                      {project.prestation && (
                        <div className="eng-exp-row">
                          <span>🔧 Prestation</span>
                          <strong>{project.prestation}</strong>
                        </div>
                      )}
                      {project.administratif && (
                        <div className="eng-exp-row">
                          <span>📋 Administratif</span>
                          <strong>{project.administratif}</strong>
                        </div>
                      )}
                      {project.description && (
                        <div className="eng-exp-desc">
                          <span>📝 Description complète</span>
                          <p>{project.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Client */}
                  <div className="eng-card-client">
                    <span>👤</span>
                    <div>
                      <p>
                        <strong>{project.user?.name}</strong>
                      </p>
                      <p>{project.user?.email}</p>
                      {project.user?.phone && <p>📞 {project.user.phone}</p>}
                    </div>
                  </div>

                  {/* Date */}
                  <p className="eng-card-date">
                    Publié le {new Date(project.createdAt).toLocaleDateString("fr-TN")}
                  </p>

                  {/* Formulaire de candidature */}
                  {applyForm.projectId === project._id ? (
                    <div className="eng-apply-form">
                      <textarea
                        placeholder="Décrivez votre expérience et votre approche pour ce projet..."
                        value={applyForm.message}
                        onChange={(e) =>
                          setApplyForm({ ...applyForm, message: e.target.value })
                        }
                        rows={4}
                      />
                      <div className="eng-cv-input">
                        <label>📎 Joindre mon CV (PDF)</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setCvFile(e.target.files[0] || null)}
                        />
                        {cvFile && <span className="eng-cv-name">{cvFile.name}</span>}
                      </div>
                      <div className="eng-apply-row">
                        <AnimatedButton
                          className="btn-send-apply"
                          variant="primary"
                          onClick={() => handleApply(project._id)}
                          disabled={sending}
                        >
                          {sending ? "Envoi..." : "✅ Envoyer"}
                        </AnimatedButton>
                        <AnimatedButton
                          className="btn-cancel-apply"
                          onClick={() => {
                            setApplyForm({ projectId: null, message: "" });
                            setCvFile(null);
                          }}
                        >
                          Annuler
                        </AnimatedButton>
                      </div>
                    </div>
                  ) : project.hasApplied ? (
                    <span className="eng-applied-badge">✅ Déjà postulé</span>
                  ) : (
                    <AnimatedButton
                      className="btn-postuler"
                      variant="primary"
                      onClick={() =>
                        setApplyForm({ projectId: project._id, message: "" })
                      }
                      disabled={project.status !== "ouvert"}
                    >
                      {project.status === "ouvert" ? "📩 Postuler" : "🔒 Fermé"}
                    </AnimatedButton>
                  )}
                </AnimatedCard>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </div>
    </>
  );
}