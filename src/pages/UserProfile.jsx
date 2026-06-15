import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getHistory, getMyProjects } from "../services/api";
import toast from "react-hot-toast";
import { User, Mail, Shield, LogOut, MapPin, Calendar, DollarSign, ArrowRight, MessageSquare, Send, FileText, CheckCircle, ArrowLeft } from "lucide-react";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import axios from "../services/api";
import "./UserProfile.css";

export default function UserProfile() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("history");
  const [selectedConv, setSelectedConv] = useState(null);
  const [convMessages, setConvMessages] = useState([]);
  const [msgContent, setMsgContent] = useState("");

  useEffect(() => {
    Promise.all([
      getHistory().catch(() => []),
      getMyProjects().catch(() => []),
    ]).then(([h, p]) => {
      setHistory(h.data || []);
      setProjects(p.data || []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedConv) {
      const otherId = selectedConv.from?._id === user?._id
        ? selectedConv.to?._id
        : selectedConv.from?._id;
      if (otherId) {
        axios.get(`/messages/${otherId}`)
          .then((res) => setConvMessages(res.data || []))
          .catch(() => setConvMessages([]));
      }
    }
  }, [selectedConv]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Déconnecté !");
    navigate("/");
  };

  const fetchConversations = () => {
    axios.get("/messages/conversations")
      .then((res) => setConversations(res.data || []))
      .catch(() => setConversations([]));
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedConv(null);
    if (section === "messages") fetchConversations();
  };

  const handleSelectConv = (conv) => {
    setSelectedConv(conv);
    const otherId = conv.from?._id === user?._id ? conv.to?._id : conv.from?._id;
    if (otherId) {
      axios.get(`/messages/${otherId}`)
        .then((res) => setConvMessages(res.data || []))
        .catch(() => setConvMessages([]));
    }
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!msgContent.trim() || !selectedConv) return;
    const otherId = selectedConv.from?._id === user?._id ? selectedConv.to?._id : selectedConv.from?._id;
    try {
      const res = await axios.post("/messages", { to: otherId, content: msgContent });
      setConvMessages([...convMessages, res.data]);
      setMsgContent("");
      fetchConversations();
    } catch {
      toast.error("Erreur envoi message");
    }
  };

  const roleConfig = {
    user: { label: "Particulier", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    admin: { label: "Administrateur", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    engineer: { label: "Ingénieur", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    terrain_seller: { label: "Vendeur Terrain", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    equipment_seller: { label: "Vendeur Équipement", color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
  };

  const role = roleConfig[user?.role] || roleConfig.user;

  return (
    <div className="profile-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .profile-page { min-height: 100vh; background: #f8fafc; padding: 40px 20px; font-family: 'Inter', sans-serif; }
        .profile-container { max-width: 1100px; margin: 0 auto; }
        .profile-header-card { display: flex; flex-direction: column; align-items: center; padding: 40px; background: white; border-radius: 20px; margin-bottom: 24px; text-align: center; }
        .profile-avatar-large { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; margin-bottom: 16px; }
        .profile-name { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
        .profile-email { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #64748b; margin-bottom: 12px; }
        .profile-role-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 600; }
        .profile-section-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
        .profile-tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: white; color: #64748b; border: 1px solid #e2e8f0; }
        .profile-tab-btn:hover { border-color: #3b82f6; color: #3b82f6; }
        .profile-tab-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
        .profile-back-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 24px; transition: all 0.2s; font-family: inherit; }
        .profile-back-btn:hover { background: #3b82f6; color: white; }
        .profile-section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
        .profile-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 16px; }
        .profile-info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .profile-info-row:last-child { border-bottom: none; }
        .profile-info-label { color: #64748b; }
        .profile-info-value { font-weight: 600; color: #1e293b; }
        .profile-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; margin-top: 16px; }
        .profile-btn:hover { background: #2563eb; }
        .profile-btn-outline { background: white; color: #3b82f6; border: 2px solid #3b82f6; }
        .profile-btn-outline:hover { background: #3b82f6; color: white; }
        .profile-msg-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; min-height: 500px; }
        .profile-conv-list { background: white; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .profile-conv-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: 700; color: #1e293b; }
        .profile-conv-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.18s; }
        .profile-conv-item:hover { background: #f8fafc; }
        .profile-conv-item.active { background: #eff6ff; }
        .profile-conv-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .profile-conv-name { font-size: 14px; font-weight: 600; color: #1e293b; }
        .profile-conv-preview { font-size: 12px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-msg-area { background: white; border: 1px solid #e2e8f0; border-radius: 16px; display: flex; flex-direction: column; }
        .profile-msg-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
        .profile-msg-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
        .profile-msg-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; min-height: 300px; }
        .profile-msg-bubble { max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 14px; }
        .profile-msg-bubble.mine { align-self: flex-end; background: #3b82f6; color: white; border-bottom-right-radius: 4px; }
        .profile-msg-bubble.theirs { align-self: flex-start; background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; }
        .profile-msg-time { font-size: 10px; opacity: 0.6; margin-top: 4px; }
        .profile-msg-input { padding: 16px 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 10px; }
        .profile-msg-input input { flex: 1; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; }
        .profile-msg-input input:focus { border-color: #3b82f6; }
        .profile-msg-send { padding: 12px 20px; background: #3b82f6; color: white; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .profile-msg-send:hover { background: #2563eb; }
        .profile-msg-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 14px; }
        .history-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 12px; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-history-card { text-align: center; padding: 40px; }
        .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.3; }
        .history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .history-card { padding: 20px; cursor: pointer; }
        .history-card-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .history-date { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }
        .history-card-body { margin-bottom: 12px; }
        .history-region { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #64748b; }
        .history-total { display: flex; align-items: center; gap: 6px; font-size: 18px; font-weight: 700; color: #3b82f6; margin-top: 8px; }
        .history-card-footer { padding-top: 12px; border-top: 1px solid #f1f5f9; }
        .view-details-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .view-details-btn:hover { background: #2563eb; }
        .profile-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .profile-project-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; }
        .profile-project-title { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .profile-project-desc { font-size: 13px; color: #64748b; margin-bottom: 12px; line-height: 1.6; }
        .profile-project-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .profile-project-chip { font-size: 11px; font-weight: 600; padding: 4px 10px; background: #f1f5f9; color: #475569; border-radius: 20px; }
        .profile-project-status { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; }
        .profile-project-status.ouvert { background: #d1fae5; color: #10b981; }
        .profile-project-status.en_cours { background: #fef3c7; color: #f59e0b; }
        .profile-project-date { font-size: 12px; color: #94a3b8; }
        @media (max-width: 768px) { .profile-msg-layout { grid-template-columns: 1fr; } }
      `}</style>

      <div className="profile-container">
        <button className="profile-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Retour
        </button>
        <ScrollReveal direction="down">
          <AnimatedCard className="profile-header-card" whileHover={{ scale: 1.01 }}>
            <div className="profile-avatar-large">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email"><Mail size={16} /> {user?.email}</p>
            <span className="profile-role-badge" style={{ color: role.color, background: role.bg }}>
              <Shield size={14} /> {role.label}
            </span>
          </AnimatedCard>
        </ScrollReveal>

        <div className="profile-section-tabs">
          <button className={`profile-tab-btn ${activeSection === "history" ? "active" : ""}`} onClick={() => handleSectionChange("history")}>
            <FileText size={16} /> Mes estimations ({history.length})
          </button>
          <button className={`profile-tab-btn ${activeSection === "projects" ? "active" : ""}`} onClick={() => handleSectionChange("projects")}>
            <CheckCircle size={16} /> Mes projets ({projects.length})
          </button>
          <button className={`profile-tab-btn ${activeSection === "messages" ? "active" : ""}`} onClick={() => handleSectionChange("messages")}>
            <MessageSquare size={16} /> Messages ({conversations.length})
          </button>
          <button className="profile-tab-btn" onClick={handleLogout} style={{ marginLeft: "auto" }}>
            <LogOut size={16} /> Deconnexion
          </button>
        </div>

        {activeSection === "history" && (
          <ScrollReveal direction="up">
            {loading ? (
              <div className="history-loading">
                <div className="loading-spinner"></div>
                <p>Chargement de l'historique...</p>
              </div>
            ) : history.length === 0 ? (
              <AnimatedCard className="empty-history-card" whileHover={{ scale: 1.01 }}>
                <div className="empty-icon">-</div>
                <h3>Aucune estimation</h3>
                <p>Commencez votre premiere estimation.</p>
                <AnimatedButton className="profile-btn" style={{ marginTop: "16px", maxWidth: "300px" }} onClick={() => navigate("/terrain/localisation")}>
                  Commencer une estimation
                </AnimatedButton>
              </AnimatedCard>
            ) : (
              <div className="history-grid">
                {history.map((est, i) => (
                  <ScrollReveal key={est._id} direction="up" delay={i * 0.05}>
                    <AnimatedCard className="history-card" whileHover={{ scale: 1.02 }}>
                      <div className="history-card-header">
                        <span className="history-date"><Calendar size={14} /> {new Date(est.createdAt).toLocaleDateString("fr-TN")}</span>
                      </div>
                      <div className="history-card-body">
                        <div className="history-region"><MapPin size={16} /> {est.terrain?.region || "Non specifie"}</div>
                        <div className="history-total"><DollarSign size={18} /> {est.totalCost?.toLocaleString()} DT</div>
                      </div>
                      <div className="history-card-footer">
                        <button className="view-details-btn" onClick={() => navigate("/devis")}>Voir le detail <ArrowRight size={14} /></button>
                      </div>
                    </AnimatedCard>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </ScrollReveal>
        )}

        {activeSection === "projects" && (
          <ScrollReveal direction="up">
            {projects.length === 0 ? (
              <AnimatedCard className="empty-history-card" whileHover={{ scale: 1.01 }}>
                <div className="empty-icon">-</div>
                <h3>Aucun projet depose</h3>
                <p>Generez un devis et deposez votre projet.</p>
                <AnimatedButton className="profile-btn" style={{ marginTop: "16px", maxWidth: "300px" }} onClick={() => navigate("/devis-wizard")}>
                  Commencer une estimation
                </AnimatedButton>
              </AnimatedCard>
            ) : (
              <div className="profile-projects-grid">
                {projects.map((project, i) => (
                  <ScrollReveal key={project._id} direction="up" delay={i * 0.05}>
                    <div className="profile-project-card">
                      <div className="profile-project-title">{project.title}</div>
                      <div className="profile-project-desc">{project.description}</div>
                      <div className="profile-project-meta">
                        {project.region && <span className="profile-project-chip"><MapPin size={11} /> {project.region}</span>}
                        {project.surface && <span className="profile-project-chip">{project.surface} m2</span>}
                        {project.floors && <span className="profile-project-chip">{project.floors} etage(s)</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span className={`profile-project-status ${project.status}`}>{project.status}</span>
                        <span className="profile-project-date">{new Date(project.createdAt).toLocaleDateString("fr-TN")}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </ScrollReveal>
        )}

        {activeSection === "messages" && (
          <ScrollReveal direction="up">
            <div className="profile-msg-layout">
              <div className="profile-conv-list">
                <div className="profile-conv-header">Conversations</div>
                {conversations.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>Aucune conversation</div>
                ) : conversations.map((conv) => {
                  const other = conv.from?._id === user?._id ? conv.to : conv.from;
                  return (
                    <div key={conv._id} className={`profile-conv-item ${selectedConv?._id === conv._id ? "active" : ""}`} onClick={() => handleSelectConv(conv)}>
                      <div className="profile-conv-avatar">{other?.name?.charAt(0).toUpperCase() || "?"}</div>
                      <div>
                        <div className="profile-conv-name">{other?.name || "Utilisateur"}</div>
                        <div className="profile-conv-preview">{conv.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="profile-msg-area">
                <div className="profile-msg-header">
                  <div className="profile-conv-avatar" style={{ width: "36px", height: "36px", fontSize: "13px" }}>
                    {selectedConv ? (selectedConv.from?._id === user?._id ? selectedConv.to?.name?.charAt(0) : selectedConv.from?.name?.charAt(0)) || "?" : "?"}
                  </div>
                  <h3>
                    {selectedConv ? (selectedConv.from?._id === user?._id ? selectedConv.to?.name : selectedConv.from?.name) || "Utilisateur" : "Selectionnez une conversation"}
                  </h3>
                </div>
                {!selectedConv ? (
                  <div className="profile-msg-empty">Selectionnez une conversation</div>
                ) : (
                  <>
                    <div className="profile-msg-body">
                      {convMessages.map((msg, idx) => {
                        const isMine = msg.from === user?._id || msg.from?._id === user?._id;
                        return (
                          <div key={idx} className={`profile-msg-bubble ${isMine ? "mine" : "theirs"}`}>
                            <div>{msg.content}</div>
                            <div className="profile-msg-time">{new Date(msg.createdAt).toLocaleTimeString("fr-TN", { hour: "2-digit", minute: "2-digit" })}</div>
                          </div>
                        );
                      })}
                    </div>
                    <form className="profile-msg-input" onSubmit={handleSendMsg}>
                      <input type="text" placeholder="Ecrire un message..." value={msgContent} onChange={(e) => setMsgContent(e.target.value)} />
                      <button type="submit" className="profile-msg-send"><Send size={16} /> Envoyer</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}