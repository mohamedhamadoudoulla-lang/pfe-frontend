import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyProjects, getApplications } from "../services/api";
import API from "../services/api";
import toast from "react-hot-toast";
import { FileText, CheckCircle, Clock, Plus, MessageCircle, User, Star, MapPin, DollarSign, ArrowLeft } from "lucide-react";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import "./MyProjects.css";

export default function MyProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    try {
      const res = await getMyProjects();
      setProjects(res.data || []);
    } catch { toast.error("Erreur chargement"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAccept = async (appId) => {
    try {
      await API.put(`/applications/${appId}`, { status: "acceptée" });
      toast.success("Candidature acceptée !");
      load();
    } catch { toast.error("Erreur"); }
  };

  const handleReject = async (appId) => {
    try {
      await API.put(`/applications/${appId}`, { status: "refusée" });
      toast.success("Candidature refusée");
      load();
    } catch { toast.error("Erreur"); }
  };

  const allAccepted = projects.flatMap((p) =>
    (p.applications || []).filter((a) => a.status === "acceptée")
      .map((a) => ({ ...a, projectTitle: p.title, projectRegion: p.region, projectId: p._id }))
  );

  const totalPending = projects.reduce(
    (acc, p) => acc + (p.applications || []).filter(a => a.status === "en_attente").length, 0
  );

  if (loading) return (
    <div className="mp-loading">
      <div className="mp-spinner"></div>
      <p>Chargement de vos projets...</p>
    </div>
  );

  return (
    <div className="mp-page">
      {/* Header Section */}
      <section className="mp-header-section">
        <div className="mp-header-container">
          <div className="mp-header-content">
            <h1 className="mp-title">📁 Mes projets</h1>
            <p className="mp-subtitle">
              {projects.length} projet(s) · {totalPending} candidature(s) en attente · {allAccepted.length} acceptée(s)
            </p>
            <AnimatedButton className="mp-btn-new-project" variant="primary" onClick={() => navigate("/devis-wizard")}>
              <Plus size={18} />
              Nouveau projet
            </AnimatedButton>
          </div>
          <ScrollReveal direction="left">
            <div className="mp-header-visual">
              <img src="/images/Paid idea-rafiki.svg" alt="Mes projets" className="mp-header-image" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tabs */}
      <div className="mp-tabs-container">
        <div className="mp-tabs">
          <button className={`mp-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
            <FileText size={18} />
            Tous ({projects.length})
          </button>
          <button className={`mp-tab ${tab === "accepted" ? "active" : ""}`} onClick={() => setTab("accepted")}>
            <CheckCircle size={18} />
            Acceptées ({allAccepted.length})
          </button>
          <button className={`mp-tab ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
            <Clock size={18} />
            En attente ({totalPending})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mp-content-wrapper">

        {/* Accepted Tab */}
        {tab === "accepted" && (
          <div className="mp-content">
            {allAccepted.length === 0 ? (
              <AnimatedCard className="mp-empty-state" whileHover={{ scale: 1.01 }}>
                <div className="empty-icon">⏳</div>
                <h3>Pas encore de candidature acceptée</h3>
                <p>Les ingénieurs qui postulent à vos projets apparaîtront ici.</p>
              </AnimatedCard>
            ) : (
              <div className="mp-grid">
                {allAccepted.map((app) => (
                  <ScrollReveal key={app._id} direction="up" delay={0.1}>
                    <AnimatedCard className="mp-card-accepted" whileHover={{ scale: 1.02 }}>
                      <div className="mp-card-badge accepted">
                        <CheckCircle size={14} />
                        Acceptée
                      </div>
                      <div className="mp-engineer-info">
                        <div className="mp-eng-avatar">👷</div>
                        <div>
                          <h3>{app.engineer?.user?.name || "Ingénieur"}</h3>
                          <p className="mp-eng-spec">{app.engineer?.speciality} · {app.engineer?.region}</p>
                        </div>
                      </div>
                      <div className="mp-project-ref">
                        <FileText size={14} />
                        <span>{app.projectTitle}</span>
                      </div>
                      {app.message && <p className="mp-message">💬 {app.message}</p>}
                      <div className="mp-eng-meta">
                        <span><Star size={14} /> {app.engineer?.rating || 0}/5</span>
                        <span><MapPin size={14} /> {app.engineer?.region || "Tunisie"}</span>
                        {app.price && <span><DollarSign size={14} /> {Number(app.price).toLocaleString()} DT</span>}
                      </div>
                      <div className="mp-card-actions">
                        <AnimatedButton className="btn-contact" variant="primary" onClick={() => navigate(`/messages/${app.engineer?.user?._id}`)}>
                          <MessageCircle size={16} />
                          Contacter
                        </AnimatedButton>
                        <AnimatedButton className="btn-profile" onClick={() => navigate(`/ingenieur/${app.engineer?._id}`)}>
                          <User size={16} />
                          Voir profil
                        </AnimatedButton>
                      </div>
                    </AnimatedCard>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Tab */}
        {tab === "pending" && (
          <div className="mp-content">
            {totalPending === 0 ? (
              <AnimatedCard className="mp-empty-state" whileHover={{ scale: 1.01 }}>
                <div className="empty-icon">📭</div>
                <h3>Aucune candidature en attente</h3>
                <p>Les ingénieurs intéressés par vos projets postuleront ici.</p>
              </AnimatedCard>
            ) : (
              projects.map((project) => {
                const pending = (project.applications || []).filter(a => a.status === "en_attente");
                if (pending.length === 0) return null;
                return (
                  <ScrollReveal key={project._id} direction="up">
                    <AnimatedCard className="mp-project-card" whileHover={{ scale: 1.02 }}>
                      <div className="mp-project-header">
                        <div className="mp-project-icon">🏗️</div>
                        <div className="mp-project-info">
                          <h3>{project.title}</h3>
                          <p>📍 {project.region} {project.surface && `· ${project.surface} m²`}</p>
                        </div>
                      </div>
                      <div className="mp-pending-list">
                        {pending.map((app) => (
                          <div key={app._id} className="mp-pending-item">
                            <div className="mp-app-header">
                              <div className="mp-app-avatar">👷</div>
                              <div className="mp-app-details">
                                <strong>{app.engineer?.user?.name || "Ingénieur"}</strong>
                                <p>{app.engineer?.speciality} — {app.engineer?.region}</p>
                              </div>
                              <span className="mp-status-badge pending">⏳ En attente</span>
                            </div>
                            {app.message && <p className="mp-app-message">💬 {app.message}</p>}
                            {app.price && <p className="mp-app-price">💵 {Number(app.price).toLocaleString()} DT</p>}
                            <div className="mp-app-actions">
                              <button className="btn-accept" onClick={() => handleAccept(app._id)}>✅ Accepter</button>
                              <button className="btn-reject" onClick={() => handleReject(app._id)}>❌ Refuser</button>
                              <button className="btn-msg" onClick={() => navigate(`/messages/${app.engineer?.user?._id}`)}>💬 Contacter</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AnimatedCard>
                  </ScrollReveal>
                );
              })
            )}
          </div>
        )}

        {/* All Projects Tab */}
        {tab === "all" && (
          <div className="mp-content">
            {projects.length === 0 ? (
              <AnimatedCard className="mp-empty-state" whileHover={{ scale: 1.01 }}>
                <div className="empty-icon">🏗️</div>
                <h3>Aucun projet pour le moment</h3>
                <p>Terminez votre estimation et déposez votre premier projet.</p>
                <AnimatedButton className="btn-start" variant="primary" onClick={() => navigate("/devis-wizard")}>
                  Commencer une estimation
                </AnimatedButton>
              </AnimatedCard>
            ) : (
              <div className="mp-grid">
                {projects.map((project, i) => {
                  const pending = (project.applications || []).filter(a => a.status === "en_attente").length;
                  const accepted = (project.applications || []).filter(a => a.status === "acceptée").length;
                  const isOpen = openId === project._id;

                  return (
                    <ScrollReveal key={project._id} direction="up" delay={i * 0.1}>
                      <AnimatedCard className="mp-card" whileHover={{ scale: 1.02 }}>
                        <div className="mp-card-top">
                          <div className="mp-card-icon">🏗️</div>
                          <div className="mp-card-info">
                            <h3>{project.title}</h3>
                            <p>📍 {project.region} {project.surface && `· ${project.surface} m²`} {project.budget && `· ${Number(project.budget).toLocaleString()} DT`}</p>
                          </div>
                        </div>
                        {project.description && <p className="mp-card-desc">{project.description}</p>}
                        <div className="mp-card-badges">
                          {accepted > 0 && <span className="badge accepted">✅ {accepted} acceptée(s)</span>}
                          {pending > 0 && <span className="badge pending">⏳ {pending} en attente</span>}
                          {accepted === 0 && pending === 0 && <span className="badge none">📭 Pas encore de candidature</span>}
                        </div>
                        <div className="mp-card-footer">
                          <span className="mp-card-date">Déposé le {new Date(project.createdAt).toLocaleDateString("fr-TN")}</span>
                          <AnimatedButton className="btn-toggle" onClick={() => setOpenId(isOpen ? null : project._id)}>
                            👷 {(project.applications || []).length} candidature(s) {isOpen ? "▲" : "▼"}
                          </AnimatedButton>
                        </div>
                        {isOpen && (
                          <div className="mp-apps-section">
                            {!project.applications?.length ? (
                              <p className="mp-no-apps">Aucune candidature pour ce projet.</p>
                            ) : (
                              project.applications.map((app) => (
                                <AnimatedCard key={app._id} className={`mp-app-card ${app.status}`} whileHover={{ scale: 1.01 }}>
                                  <div className="mp-app-header">
                                    <div className="mp-app-avatar">👷</div>
                                    <div className="mp-app-details">
                                      <strong>{app.engineer?.user?.name || "Ingénieur"}</strong>
                                      <p>{app.engineer?.speciality} — {app.engineer?.region}</p>
                                    </div>
                                    <span className={`mp-status-badge ${app.status}`}>
                                      {app.status === "en_attente" && "⏳ En attente"}
                                      {app.status === "acceptée" && "✅ Acceptée"}
                                      {app.status === "refusée" && "❌ Refusée"}
                                    </span>
                                  </div>
                                  {app.message && <p className="mp-app-message">💬 {app.message}</p>}
                                  {app.price && <p className="mp-app-price">💵 {Number(app.price).toLocaleString()} DT</p>}
                                  <div className="mp-app-actions">
                                    {app.status === "en_attente" && (
                                      <>
                                        <AnimatedButton className="btn-accept" onClick={() => handleAccept(app._id)}>✅ Accepter</AnimatedButton>
                                        <AnimatedButton className="btn-reject" variant="destructive" onClick={() => handleReject(app._id)}>❌ Refuser</AnimatedButton>
                                      </>
                                    )}
                                    {app.status !== "refusée" && (
                                      <AnimatedButton className="btn-msg" onClick={() => navigate(`/messages/${app.engineer?.user?._id}`)}>
                                        <MessageCircle size={16} /> Contacter
                                      </AnimatedButton>
                                    )}
                                  </div>
                                </AnimatedCard>
                              ))
                            )}
                          </div>
                        )}
                      </AnimatedCard>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}