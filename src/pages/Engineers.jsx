import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";

export default function EngineerDashboard() {
  const { user }                      = useAuth();
  const navigate                      = useNavigate();
  const [projects, setProjects]       = useState([]);
  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState("projects");
  const [applyForm, setApplyForm]     = useState({ projectId: null, message: "", price: "" });
  const [sending, setSending]         = useState(false);
  const [profileForm, setProfileForm] = useState({
    speciality: "", region: "", experience: "", pricePerM2: "", description: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const REGIONS = [
    "Tunis","Sfax","Sousse","Kairouan","Bizerte",
    "Gabès","Ariana","Monastir","Nabeul","Médenine",
  ];

  useEffect(() => {
    Promise.all([
      API.get("/projects"),
      API.get("/engineers"),
    ])
      .then(([proj, eng]) => {
        setProjects(proj.data);
        const mine = eng.data.find((e) => e.user?._id === user?._id);
        setProfile(mine || null);
        if (mine) {
          setProfileForm({
            speciality:  mine.speciality  || "",
            region:      mine.region      || "",
            experience:  mine.experience  || "",
            pricePerM2:  mine.pricePerM2  || "",
            description: mine.description || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (projectId) => {
    if (!applyForm.message.trim()) {
      toast.error("Rédigez un message de candidature");
      return;
    }
    setSending(true);
    try {
      await API.post("/applications", {
        projectId,
        message: applyForm.message,
        price:   applyForm.price,
      });
      toast.success("✅ Candidature envoyée !");
      setApplyForm({ projectId: null, message: "", price: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur envoi");
    } finally {
      setSending(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await API.post("/engineers", profileForm);
      toast.success("Profil enregistré !");
      const res = await API.get("/engineers");
      const mine = res.data.find((e) => e.user?._id === user?._id);
      setProfile(mine || null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) return (
    <div className="ed-loading">
      <div className="ed-spinner"></div>
      <p>Chargement du tableau de bord...</p>
    </div>
  );

  return (
    <> 
    <style>
      {`
/* Variables Couleurs */
:root {
  --primary: #2563eb;
  --primary-light: #eff6ff;
  --primary-dark: #1e40af;
  --bg-page: #f8fafc;
  --bg-sidebar: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --header-footer-bg: #ffffff;      /* blanc */
  --header-footer-text: #1e293b;    /* texte foncé */
}

.ed-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 16px;
  color: var(--text-muted);
}

.ed-spinner {
  width: 42px;
  height: 42px;
  border: 3px solid #e0e0e0;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Layout global */
.ed-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);
  font-family: 'Inter', system-ui, sans-serif;
}

/* Header */
.ed-header {
  background: var(--header-footer-bg);
  color: var(--header-footer-text);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

/* Contenu central (sidebar + main) */
.ed-layout {
  display: flex;
  flex: 1;
}

/* Sidebar Moderne */
.ed-sidebar {
  width: 280px;
  background: var(--bg-sidebar);
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  border-right: 1px solid var(--border);
  flex-shrink: 0;
}

.ed-user-block {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.ed-avatar {
  font-size: 40px;
  width: 70px;
  height: 70px;
  background: var(--primary-light);
  border: 2px solid var(--primary-light);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: var(--shadow);
}

.ed-user-block h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.ed-user-block p {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.ed-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ed-pill.verified { background: #dcfce7; color: #166534; }
.ed-pill.pending  { background: #fef9c3; color: #854d0e; }

/* Navigation */
.ed-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ed-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  text-align: left;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.ed-nav-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.ed-nav-btn.active {
  background: var(--primary);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

/* Alerte */
.ed-alert {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 14px;
  padding: 16px;
  margin-top: auto;
}

.ed-alert p {
  font-size: 12px;
  color: #9a3412;
  margin-bottom: 12px;
  line-height: 1.4;
}

.ed-alert button {
  background: #ea580c;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

/* Stats Rapides */
.ed-quick-stats {
  display: flex;
  background: var(--primary-light);
  border-radius: 14px;
  padding: 16px 8px;
}

.ed-qs {
  flex: 1;
  text-align: center;
}

.ed-qs strong { font-size: 20px; color: var(--primary); display: block; }
.ed-qs span   { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }

/* Main Content */
.ed-main {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.ed-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  border-bottom: 2px solid var(--border);
  padding-bottom: 20px;
}

.ed-section-header h2 {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 4px;
}

.ed-section-header p {
  color: var(--text-muted);
  font-size: 14px;
}

.ed-count-badge {
  background: white;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.ed-count-badge.green { color: #166534; border-color: #bbf7d0; }

/* Projet Cards */
.ed-projects-list {
  display: grid;
  gap: 24px;
}

.ed-project-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: transform 0.2s, box-shadow 0.2s;
}

.ed-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.05);
}

.ed-proj-icon {
  width: 50px;
  height: 50px;
  background: var(--primary-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.ed-proj-left h3 {
  font-size: 18px;
  color: var(--text-main);
  font-weight: 700;
}

.ed-open-badge {
  background: #dcfce7;
  color: #166534;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
}

.ed-proj-desc {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  color: var(--text-muted);
  margin: 16px 0;
  font-size: 14px;
}

.ed-proj-tags span {
  background: white;
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 8px;
  font-weight: 600;
}

.ed-client-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed var(--border);
}

.ed-btn-apply {
  background: var(--primary);
  color: white;
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
}

.ed-btn-apply:hover { background: var(--primary-dark); }

/* Profil & Formulaires */
.ed-profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.ed-ps-card {
  background: white;
  border: 1px solid var(--border);
  padding: 20px;
  border-radius: 16px;
  text-align: center;
}

.ed-profile-form {
  background: white;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.ed-field input, .ed-field select, .ed-field textarea {
  border: 1px solid var(--border);
  background: #fcfcfc;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
}

.ed-field input:focus {
  border-color: var(--primary);
  outline: none;
  background: white;
}

.ed-btn-save {
  background: var(--primary);
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  margin-top: 20px;
}

/* Stats */
.ed-stat-card {
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(0,0,0,0.05);
}

.ed-stat-card.blue { background: #eff6ff; color: #1e40af; }
.ed-stat-card.green { background: #f0fdf4; color: #166534; }
.ed-stat-card.orange { background: #fff7ed; color: #9a3412; }
.ed-stat-card.purple { background: #faf5ff; color: #6b21a8; }

.ed-stat-card strong { font-size: 32px; display: block; margin-top: 10px; }

/* Footer */
.ed-footer {
  background: var(--header-footer-bg);
  color: var(--header-footer-text);
  padding: 10px 24px;
  text-align: center;
  font-size: 13px;
  border-top: 1px solid var(--border);
}

/* Responsive */
@media (max-width: 900px) {
  .ed-layout { flex-direction: column; }
  .ed-sidebar { width: 100%; height: auto; position: relative; border-right: none; border-bottom: 1px solid var(--border); }
  .ed-main { padding: 20px; }
}
      `}
    </style>

    <div className="ed-page">
      {/* Header blanc */}
      <header className="ed-header">
        <div>Tableau de bord ingénieur</div>
        <div>{user?.name}</div>
      </header>

      {/* Contenu principal (sidebar + main) */}
      <div className="ed-layout">
        {/* ── Sidebar ── */}
        <aside className="ed-sidebar">
          <div className="ed-user-block">
            <div className="ed-avatar">👷</div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className={profile?.isVerified ? "ed-pill verified" : "ed-pill pending"}>
              {profile?.isVerified ? "✓ Vérifié" : "⏳ En attente"}
            </span>
          </div>

          <nav className="ed-nav">
            {[
              { id: "projects", icon: "📋", label: "Projets clients"   },
              { id: "profile",  icon: "👤", label: "Mon profil"        },
              { id: "stats",    icon: "📊", label: "Statistiques"      },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`ed-nav-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {!profile && (
            <div className="ed-alert">
              <p>Complétez votre profil pour être visible par les clients.</p>
              <button onClick={() => setActiveTab("profile")}>
                Créer mon profil →
              </button>
            </div>
          )}

          <div className="ed-quick-stats">
            <div className="ed-qs">
              <strong>{projects.length}</strong>
              <span>Projets</span>
            </div>
            <div className="ed-qs">
              <strong>{profile?.rating || 0}</strong>
              <span>Note /5</span>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ed-main">
          {activeTab === "projects" && (
            <div className="ed-section">
              <div className="ed-section-header">
                <div className="ed-sh">
                  <h2>Projets des clients</h2>
                  <p>Opportunités disponibles dans votre région</p>
                </div>
                <span className="ed-count-badge">{projects.length} projet(s) actif(s)</span>
              </div>

              {projects.length === 0 ? (
                <div className="ed-empty">
                  <span>📭</span>
                  <h3>Aucun projet disponible</h3>
                  <p>Revenez plus tard pour voir les nouvelles demandes.</p>
                </div>
              ) : (
                <AnimatedStagger className="ed-projects-list" staggerDelay={0.1}>
                  {projects.map((project) => (
                    <AnimatedStaggerItem key={project._id}>
                      <AnimatedCard className="ed-project-card" whileHover={{ scale: 1.02 }}>
                      <div className="ed-proj-head">
                        <div className="ed-proj-left" style={{display:'flex', gap:'15px'}}>
                          <div className="ed-proj-icon">🏗️</div>
                          <div>
                            <h3>{project.title}</h3>
                            <p style={{fontSize:'13px', color:'#64748b'}}>
                              <span>📍 {project.region}</span>
                              <span className="ed-separator" style={{margin:'0 8px'}}>•</span>
                              <span>👤 {project.user?.name}</span>
                            </p>
                          </div>
                        </div>
                        <span className="ed-open-badge">Ouvert</span>
                      </div>

                      {project.description && (
                        <p className="ed-proj-desc">{project.description}</p>
                      )}

                      <div className="ed-proj-tags" style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                        {project.surface       && <span>📐 {project.surface} m²</span>}
                        {project.floors        && <span>🏢 {project.floors} étage(s)</span>}
                        {project.finitionLevel && <span>✨ {project.finitionLevel}</span>}
                        {project.budget        && <span>💰 {Number(project.budget).toLocaleString()} DT</span>}
                      </div>

                      <div className="ed-client-info" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>👤</div>
                        <div>
                          <strong style={{fontSize:'14px'}}>{project.user?.name}</strong>
                          <div style={{fontSize:'12px', color:'#64748b'}}>{project.user?.email}</div>
                        </div>
                      </div>

                      <p style={{fontSize:'11px', color:'#94a3b8', marginTop:'15px'}}>
                        Publié le {new Date(project.createdAt).toLocaleDateString("fr-TN")}
                      </p>

                      {applyForm.projectId === project._id ? (
                        <div className="ed-apply-box" style={{marginTop:'20px', background:'#f1f5f9', padding:'20px', borderRadius:'15px'}}>
                          <h4 style={{marginBottom:'10px'}}>📩 Votre candidature</h4>
                          <textarea
                            style={{width:'100%', border:'1px solid #cbd5e1', borderRadius:'10px', padding:'10px', marginBottom:'10px'}}
                            placeholder="Décrivez votre expérience..."
                            value={applyForm.message}
                            onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                            rows={4}
                          />
                          <div style={{display:'flex', gap:'10px'}}>
                            <input
                              style={{flex:1, border:'1px solid #cbd5e1', borderRadius:'10px', padding:'10px'}}
                              type="number"
                              placeholder="Tarif (DT)"
                              value={applyForm.price}
                              onChange={(e) => setApplyForm({ ...applyForm, price: e.target.value })}
                            />
                            <AnimatedButton
                            className="ed-btn-send"
                            variant="primary"
                            style={{background:'#22c55e', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer'}}
                            onClick={() => handleApply(project._id)}
                            disabled={sending}
                          >
                            {sending ? "..." : "Envoyer"}
                          </AnimatedButton>
                          <AnimatedButton
                            style={{background:'white', border:'1px solid #cbd5e1', padding:'10px', borderRadius:'10px', cursor:'pointer'}}
                            onClick={() => setApplyForm({ projectId: null, message: "", price: "" })}
                          >
                            Annuler
                          </AnimatedButton>
                          </div>
                        </div>
                      ) : (
                        <AnimatedButton
                          className="ed-btn-apply"
                          variant="primary"
                          style={{width:'100%'}}
                          onClick={() => setApplyForm({ projectId: project._id, message: "", price: "" })}
                        >
                          📩 Postuler sur ce projet
                        </AnimatedButton>
                      )}
                      </AnimatedCard>
                    </AnimatedStaggerItem>
                  ))}
                </AnimatedStagger>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="ed-section">
              <div className="ed-section-header">
                <div>
                  <h2>Mon profil professionnel</h2>
                  <p>Gérez votre visibilité et vos informations</p>
                </div>
                {profile?.isVerified && <span className="ed-count-badge green">✓ Profil vérifié</span>}
              </div>

              {profile && (
                <AnimatedStagger className="ed-profile-stats" staggerDelay={0.1}>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-ps-card" whileHover={{ scale: 1.02 }}><span>🏗️</span><strong>{profile.speciality}</strong><p>Spécialité</p></AnimatedCard>
                  </AnimatedStaggerItem>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-ps-card" whileHover={{ scale: 1.02 }}><span>📍</span><strong>{profile.region}</strong><p>Région</p></AnimatedCard>
                  </AnimatedStaggerItem>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-ps-card" whileHover={{ scale: 1.02 }}><span>⭐</span><strong>{profile.rating}/5</strong><p>Note</p></AnimatedCard>
                  </AnimatedStaggerItem>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-ps-card" whileHover={{ scale: 1.02 }}><span>🕐</span><strong>{profile.experience} ans</strong><p>Expérience</p></AnimatedCard>
                  </AnimatedStaggerItem>
                </AnimatedStagger>
              )}

              <form className="ed-profile-form" onSubmit={handleSaveProfile}>
                <h3>Informations du profil</h3>
                <div className="ed-form-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'20px'}}>
                  <div className="ed-field" style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                    <label>Spécialité</label>
                    <input
                      value={profileForm.speciality}
                      onChange={(e) => setProfileForm({ ...profileForm, speciality: e.target.value })}
                      required
                    />
                  </div>
                  <div className="ed-field" style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                    <label>Région</label>
                    <select
                      value={profileForm.region}
                      onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                      required
                    >
                      <option value="">Sélectionner</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="ed-field" style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                    <label>Expérience (ans)</label>
                    <input
                      type="number"
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    />
                  </div>
                  <div className="ed-field" style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                    <label>Tarif (DT/m²)</label>
                    <input
                      type="number"
                      value={profileForm.pricePerM2}
                      onChange={(e) => setProfileForm({ ...profileForm, pricePerM2: e.target.value })}
                    />
                  </div>
                  <div className="ed-field full" style={{gridColumn:'1 / -1', display:'flex', flexDirection:'column', gap:'5px'}}>
                    <label>Description</label>
                    <textarea
                      rows={4}
                      value={profileForm.description}
                      onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                    />
                  </div>
                </div>
<AnimatedButton type="submit" className="ed-btn-save" variant="primary" disabled={savingProfile}>
                    {savingProfile ? "Enregistrement..." : "💾 Enregistrer le profil"}
                  </AnimatedButton>
              </form>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="ed-section">
              <div className="ed-section-header">
                <h2>Mes statistiques</h2>
              </div>
              <AnimatedStagger className="ed-stats-cards" staggerDelay={0.1} style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-stat-card blue" whileHover={{ scale: 1.02 }}><span>📋</span><strong>{projects.length}</strong><p>Projets disponibles</p></AnimatedCard>
                  </AnimatedStaggerItem>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-stat-card green" whileHover={{ scale: 1.02 }}><span>⭐</span><strong>{profile?.rating || 0}/5</strong><p>Note client</p></AnimatedCard>
                  </AnimatedStaggerItem>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-stat-card orange" whileHover={{ scale: 1.02 }}><span>✅</span><strong>{profile?.isVerified ? "Vérifié" : "Non"}</strong><p>Statut</p></AnimatedCard>
                  </AnimatedStaggerItem>
                  <AnimatedStaggerItem>
                    <AnimatedCard className="ed-stat-card purple" whileHover={{ scale: 1.02 }}><span>💵</span><strong>{profile?.pricePerM2 || 0} DT</strong><p>Tarif m²</p></AnimatedCard>
                  </AnimatedStaggerItem>
                </AnimatedStagger>
            </div>
          )}
        </main>
      </div>

      {/* Footer blanc */}
      <footer className="ed-footer">
        © {new Date().getFullYear()} Ingenieur Dashboard
      </footer>
    </div>
    </>
  );
}