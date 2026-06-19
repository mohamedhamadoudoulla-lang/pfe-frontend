import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApplications, getEngineers } from "../services/api";
import axios from "../services/api";
import toast from "react-hot-toast";
import {
  CheckCircle, Clock, Briefcase, User, MessageSquare,
  LogOut, ChevronRight, Send, X, DollarSign,
  MapPin, Layers, Star, AlertCircle, Upload,
  FileText, CheckCircle2,
} from "lucide-react";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import "./EngineerDashboard.css";

export default function EngineerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [applyForm, setApplyForm] = useState({ projectId: null, message: "" });
  const [selectedConv, setSelectedConv] = useState(null);
  const [msgContent, setMsgContent] = useState("");
  const [convMessages, setConvMessages] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, eng, conv] = await Promise.all([
          getApplications(),
          getEngineers(),
          axios.get("/messages/conversations"),
        ]);
        setProjects(proj.data);
        setConversations(conv.data || []);
        const myProfile = eng.data.find((e) => e.user?._id === user?._id);
        setProfile(myProfile || null);
      } catch {
        toast.error("Erreur chargement donnees");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const fetchMessages = async (otherUserId) => {
    try {
      const res = await axios.get(`/messages/${otherUserId}`);
      setConvMessages(res.data);
    } catch {
      toast.error("Erreur chargement messages");
    }
  };

  const handleSelectConv = (conv) => {
    const otherId = conv.from?._id === user?._id ? conv.to?._id : conv.from?._id;
    setSelectedConv({ ...conv, otherUserId: otherId });
    fetchMessages(otherId);
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!msgContent.trim() || !selectedConv) return;
    try {
      const res = await axios.post("/messages", { to: selectedConv.otherUserId, content: msgContent });
      setConvMessages([...convMessages, res.data]);
      setMsgContent("");
    } catch {
      toast.error("Erreur envoi message");
    }
  };

  const handleApply = async (projectId) => {
    if (!applyForm.message) { toast.error("Veuillez rediger un message"); return; }
    try {
      await axios.post("/applications", { projectId, message: applyForm.message });
      toast.success("Candidature envoyee !");
      setApplyForm({ projectId: null, message: "" });
      const res = await getApplications();
      setProjects(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      toast.error("Veuillez selectionner un fichier PDF");
    }
  };

  const handleSubmitCv = async () => {
    if (!cvFile || !profile?._id) return;
    setUploadingCv(true);
    const formData = new FormData();
    formData.append("cv", cvFile);
    try {
      await axios.put(`/engineers/${profile._id}`, { cv: `/uploads/cv-${user._id}.pdf` });
      setCvUploaded(true);
      setCvFile(null);
      toast.success("CV depose avec succes !");
    } catch {
      toast.error("Erreur upload CV");
    } finally {
      setUploadingCv(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
      <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const initial = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ed-sidebar { width: 260px; background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 28px 0; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; }
        .ed-brand { display: flex; align-items: center; gap: 10px; padding: 0 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.15); margin-bottom: 16px; }
        .ed-brand svg { color: white; }
        .ed-brand span { font-size: 18px; font-weight: 800; color: white; }
        .ed-user-card { margin: 0 16px 20px; background: rgba(255,255,255,0.1); border-radius: 14px; padding: 16px; text-align: center; }
        .ed-user-avatar { width: 56px; height: 56px; background: white; color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; margin: 0 auto 10px; }
        .ed-user-name { font-size: 14px; font-weight: 700; color: white; margin-bottom: 2px; }
        .ed-user-email { font-size: 11px; color: rgba(255,255,255,0.7); }
        .ed-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; margin-top: 8px; }
        .ed-badge.verified { background: rgba(255,255,255,0.2); color: white; }
        .ed-badge.pending { background: rgba(245,158,11,0.3); color: #fef3c7; }
        .ed-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; flex: 1; }
        .ed-nav-btn { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: transparent; border: none; color: rgba(255,255,255,0.7); font-size: 13.5px; font-weight: 500; border-radius: 10px; cursor: pointer; transition: all 0.18s; text-align: left; }
        .ed-nav-btn:hover { background: rgba(255,255,255,0.15); color: white; }
        .ed-nav-btn.active { background: rgba(255,255,255,0.2); color: white; font-weight: 600; }
        .ed-nav-btn svg { flex-shrink: 0; }
        .ed-alert-box { margin: 0 16px 16px; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); border-radius: 10px; padding: 12px; text-align: center; }
        .ed-alert-box p { font-size: 11px; color: #fef3c7; margin-bottom: 8px; }
        .ed-alert-btn { width: 100%; padding: 8px; background: #f59e0b; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .ed-logout { margin: 0 16px; display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(239,68,68,0.2); color: #fecaca; border: none; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; }
        .ed-logout:hover { background: rgba(239,68,68,0.3); }
        .ed-main { margin-left: 260px; flex: 1; padding: 32px 36px; background: #f8fafc; min-height: 100vh; }
        .ed-page-header { margin-bottom: 28px; }
        .ed-page-header h1 { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
        .ed-page-header p { font-size: 14px; color: #64748b; }
        .ed-count-pill { display: inline-block; background: #3b82f6; color: white; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-left: 10px; }
        .ed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .ed-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .ed-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
        .ed-card-top { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
        .ed-card-title { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .ed-card-location { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
        .ed-card-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 14px; }
        .ed-card-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .ed-card-chip { font-size: 11px; font-weight: 600; padding: 4px 10px; background: #f1f5f9; color: #475569; border-radius: 20px; display: flex; align-items: center; gap: 4px; }
        .ed-card-btn { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .ed-card-btn:hover { background: #2563eb; }
        .ed-empty { text-align: center; padding: 60px 20px; background: white; border: 2px dashed #e2e8f0; border-radius: 16px; }
        .ed-empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.3; }
        .ed-empty h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .ed-empty p { color: #64748b; }
        .ed-profile-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; max-width: 500px; }
        .ed-profile-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; margin-bottom: 16px; }
        .ed-profile-name { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
        .ed-profile-email { font-size: 14px; color: #64748b; margin-bottom: 20px; }
        .ed-profile-detail { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .ed-profile-detail:last-of-type { border-bottom: none; }
        .ed-detail-lbl { font-size: 13px; color: #64748b; }
        .ed-detail-val { font-size: 14px; font-weight: 600; color: #1e293b; }
        .ed-cv-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; max-width: 600px; }
        .ed-cv-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .ed-cv-sub { font-size: 13px; color: #64748b; margin-bottom: 24px; }
        .ed-cv-drop { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 16px; }
        .ed-cv-drop:hover { border-color: #3b82f6; background: #eff6ff; }
        .ed-cv-drop-icon { color: #94a3b8; margin-bottom: 8px; }
        .ed-cv-drop-text { font-size: 14px; color: #475569; }
        .ed-cv-drop-hint { font-size: 11px; color: #94a3b8; margin-top: 4px; }
        .ed-cv-submit { width: 100%; padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
        .ed-cv-submit:hover:not(:disabled) { background: #2563eb; }
        .ed-cv-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .ed-cv-success { text-align: center; padding: 40px; }
        .ed-cv-success-icon { color: #10b981; margin-bottom: 12px; }
        .ed-cv-success h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .ed-cv-success p { color: #64748b; }
        .ed-msg-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; height: calc(100vh - 150px); }
        .ed-conv-list { background: white; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .ed-conv-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: 700; color: #1e293b; }
        .ed-conv-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.18s; }
        .ed-conv-item:hover { background: #f8fafc; }
        .ed-conv-item.active { background: #eff6ff; }
        .ed-conv-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .ed-conv-name { font-size: 14px; font-weight: 600; color: #1e293b; }
        .ed-conv-preview { font-size: 12px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ed-msg-area { background: white; border: 1px solid #e2e8f0; border-radius: 16px; display: flex; flex-direction: column; }
        .ed-msg-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
        .ed-msg-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; }
        .ed-msg-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .ed-msg-bubble { max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 14px; }
        .ed-msg-bubble.mine { align-self: flex-end; background: #3b82f6; color: white; border-bottom-right-radius: 4px; }
        .ed-msg-bubble.theirs { align-self: flex-start; background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; }
        .ed-msg-time { font-size: 10px; opacity: 0.6; margin-top: 4px; }
        .ed-msg-input { padding: 16px 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 10px; }
        .ed-msg-input input { flex: 1; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; }
        .ed-msg-input input:focus { border-color: #3b82f6; }
        .ed-msg-send { padding: 12px 20px; background: #3b82f6; color: white; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .ed-msg-send:hover { background: #2563eb; }
        .ed-msg-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 14px; }
        .ed-apply-form { background: #f8fafc; border-radius: 10px; padding: 16px; margin-top: 12px; }
        .ed-apply-form textarea { width: 100%; padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; resize: none; margin-bottom: 8px; outline: none; }
        .ed-apply-form input { width: 100%; padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; margin-bottom: 8px; outline: none; }
        .ed-apply-btns { display: flex; gap: 8px; }
        .ed-apply-send { flex: 1; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .ed-apply-cancel { padding: 10px 16px; background: white; color: #64748b; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; cursor: pointer; }
        .ed-devis { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
        .ed-devis h4 { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .ed-devis-section { margin-bottom: 12px; }
        .ed-devis-section-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
        .ed-devis-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
        .ed-devis-row span:first-child { color: #64748b; }
        .ed-devis-row span:last-child { font-weight: 600; color: #1e293b; }
        .ed-devis-row.total { border-top: 2px solid #e2e8f0; margin-top: 6px; padding-top: 8px; }
        .ed-devis-row.total span { font-size: 14px; font-weight: 700; color: #2563eb; }
        .ed-devis-materials { max-height: 150px; overflow-y: auto; }
        @media (max-width: 900px) { .ed-sidebar { width: 220px; } .ed-main { margin-left: 220px; } .ed-msg-layout { grid-template-columns: 1fr; } }
      `}</style>

      <aside className="ed-sidebar">
        <div className="ed-brand">
          <Briefcase size={24} />
          <span>SmartBuild</span>
        </div>

        <div className="ed-user-card">
          <div className="ed-user-avatar">{initial}</div>
          <div className="ed-user-name">{user?.name}</div>
          <div className="ed-user-email">{user?.email}</div>
          {profile?.isVerified && (
            <div className="ed-badge verified"><CheckCircle size={12} /> Profil actif</div>
          )}
        </div>

        <nav className="ed-nav">
          <button className={`ed-nav-btn ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>
            <Briefcase size={18} /> Projets clients
          </button>
          <button className={`ed-nav-btn ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>
            <MessageSquare size={18} /> Messages
            {conversations.length > 0 && <span className="ed-count-pill">{conversations.length}</span>}
          </button>
          <button className={`ed-nav-btn ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            <User size={18} /> Mon profil
          </button>
          <button className={`ed-nav-btn ${activeTab === "cv" ? "active" : ""}`} onClick={() => setActiveTab("cv")}>
            <FileText size={18} /> Deposser mon CV
          </button>
        </nav>

        {!profile && (
          <div className="ed-alert-box">
            <p>Profil ingenieur incomplet</p>
            <button className="ed-alert-btn" onClick={() => navigate("/ingenieur/profil-creation")}>
              Creer mon profil
            </button>
          </div>
        )}

        <button className="ed-logout" onClick={handleLogout}>
          <LogOut size={16} /> Deconnexion
        </button>
      </aside>

      <main className="ed-main">
        {activeTab === "projects" && (
          <>
            <div className="ed-page-header">
              <h1>Projets disponibles <span className="ed-count-pill">{projects.length}</span></h1>
              <p>Consultez et postulez aux projets de vos clients</p>
            </div>

            {projects.length === 0 ? (
              <div className="ed-empty">
                <div className="ed-empty-icon">-</div>
                <h3>Aucun projet disponible</h3>
                <p>Les nouveaux projets clients apparaitront ici.</p>
              </div>
            ) : (
              <div className="ed-grid">
                {projects.map((project, i) => (
                  <ScrollReveal key={project._id} delay={i * 0.1} direction="up">
                    <AnimatedCard className="ed-card" whileHover={{ scale: 1.02 }}>
                      <div className="ed-card-top">
                        <div>
                          <div className="ed-card-title">{project.title}</div>
                          {project.user?.name && <div className="ed-card-location"><User size={12} /> {project.user.name}</div>}
                          {project.region && <div className="ed-card-location"><MapPin size={12} /> {project.region}</div>}
                        </div>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", display: "block", marginTop: "4px" }}></span>
                      </div>
                      <div className="ed-card-desc">{project.description}</div>
                      <div className="ed-card-chips">
                        {project.surface && <span className="ed-card-chip"><Layers size={11} /> {project.surface} m2</span>}
                        {project.budget && <span className="ed-card-chip"><DollarSign size={11} /> {Number(project.budget).toLocaleString()} DT</span>}
                        {project.finitionLevel && <span className="ed-card-chip"><Star size={11} /> {project.finitionLevel}</span>}
                      </div>

                      {(project.devis && project.devis.totalCost > 0) && (
                        <div className="ed-devis">
                          <h4><FileText size={14} /> Devis du client</h4>

                          {project.devis.terrain && project.devis.terrain.totalTerrainCost > 0 && (
                            <div className="ed-devis-section">
                              <div className="ed-devis-section-title">Terrain</div>
                              {project.devis.terrain.region && <div className="ed-devis-row"><span>Region</span><span>{project.devis.terrain.region}</span></div>}
                              {project.devis.terrain.surface > 0 && <div className="ed-devis-row"><span>Surface</span><span>{project.devis.terrain.surface} m2</span></div>}
                              {project.devis.terrain.pricePerM2 > 0 && <div className="ed-devis-row"><span>Prix/m2</span><span>{project.devis.terrain.pricePerM2.toLocaleString()} DT</span></div>}
                              {project.devis.terrain.totalTerrainCost > 0 && <div className="ed-devis-row total"><span>Sous-total</span><span>{project.devis.terrain.totalTerrainCost.toLocaleString()} DT</span></div>}
                            </div>
                          )}

                          {project.devis.construction && project.devis.construction.totalConstructionCost > 0 && (
                            <div className="ed-devis-section">
                              <div className="ed-devis-section-title">Construction</div>
                              {project.devis.construction.surface > 0 && <div className="ed-devis-row"><span>Surface</span><span>{project.devis.construction.surface} m2</span></div>}
                              {project.devis.construction.floors > 1 && <div className="ed-devis-row"><span>Etages</span><span>{project.devis.construction.floors}</span></div>}
                              {project.devis.construction.constructionType && <div className="ed-devis-row"><span>Type</span><span>{project.devis.construction.constructionType}</span></div>}
                              {project.devis.construction.finitionLevel && <div className="ed-devis-row"><span>Finition</span><span>{project.devis.construction.finitionLevel}</span></div>}
                              {project.devis.construction.totalConstructionCost > 0 && <div className="ed-devis-row total"><span>Sous-total</span><span>{project.devis.construction.totalConstructionCost.toLocaleString()} DT</span></div>}
                            </div>
                          )}

                          {project.devis.furnishing?.rooms?.length > 0 && (
                            <div className="ed-devis-section">
                              <div className="ed-devis-section-title">Ameublement</div>
                              {project.devis.furnishing.rooms.map((r, i) => (
                                <div key={i} className="ed-devis-row"><span>{r.roomType} ({r.qualityLevel})</span><span>{r.cost?.toLocaleString()} DT</span></div>
                              ))}
                              {project.devis.furnishing.totalFurnishingCost > 0 && <div className="ed-devis-row total"><span>Sous-total</span><span>{project.devis.furnishing.totalFurnishingCost.toLocaleString()} DT</span></div>}
                            </div>
                          )}

                          {project.devis.materiauxConstruction?.length > 0 && (
                            <div className="ed-devis-section">
                              <div className="ed-devis-section-title">Materiaux construction</div>
                              <div className="ed-devis-materials">
                                {project.devis.materiauxConstruction.map((m, i) => (
                                  <div key={i} className="ed-devis-row"><span>{m.type} ({m.quantite} {m.unite})</span><span>{m.sousTotal?.toLocaleString()} DT</span></div>
                                ))}
                              </div>
                              {project.devis.totalMateriaux > 0 && <div className="ed-devis-row total"><span>Sous-total</span><span>{project.devis.totalMateriaux.toLocaleString()} DT</span></div>}
                            </div>
                          )}

                          {project.devis.totalCost > 0 && (
                            <div className="ed-devis-section" style={{ borderTop: "2px solid #2563eb", paddingTop: 10, marginTop: 6 }}>
                              <div className="ed-devis-row total"><span>Total general estime</span><span>{project.devis.totalCost.toLocaleString()} DT</span></div>
                            </div>
                          )}
                        </div>
                      )}

                      {applyForm.projectId === project._id ? (
                        <div className="ed-apply-form">
                          <textarea placeholder="Redigez votre message de candidature..." rows={3} value={applyForm.message} onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })} />
                          <div className="ed-apply-btns">
                            <button className="ed-apply-send" onClick={() => handleApply(project._id)}>Envoyer</button>
                            <button className="ed-apply-cancel" onClick={() => setApplyForm({ projectId: null, message: "" })}>Annuler</button>
                          </div>
                        </div>
                      ) : (
                        <button className="ed-card-btn" onClick={() => setApplyForm({ projectId: project._id, message: "" })}>
                          Postuler a ce projet
                        </button>
                      )}
                    </AnimatedCard>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "messages" && (
          <>
            <div className="ed-page-header">
              <h1>Messages</h1>
              <p>Conversations avec vos clients</p>
            </div>

            <div className="ed-msg-layout">
              <div className="ed-conv-list">
                <div className="ed-conv-header">Conversations</div>
                {conversations.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>Aucune conversation</div>
                ) : conversations.map((conv) => {
                  const other = conv.from?._id === user?._id ? conv.to : conv.from;
                  return (
                    <div key={conv._id} className={`ed-conv-item ${selectedConv?._id === conv._id ? "active" : ""}`} onClick={() => handleSelectConv(conv)}>
                      <div className="ed-conv-avatar">{other?.name?.charAt(0).toUpperCase() || "?"}</div>
                      <div>
                        <div className="ed-conv-name">{other?.name || "Client"}</div>
                        <div className="ed-conv-preview">{conv.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ed-msg-area">
                <div className="ed-msg-header">
                  <div className="ed-conv-avatar" style={{ width: "36px", height: "36px", fontSize: "13px" }}>
                    {selectedConv ? (selectedConv.from?._id === user?._id ? selectedConv.to?.name?.charAt(0) : selectedConv.from?.name?.charAt(0)) || "?" : "?"}
                  </div>
                  <h3>{selectedConv ? (selectedConv.from?._id === user?._id ? selectedConv.to?.name : selectedConv.from?.name) || "Client" : "Selectionnez une conversation"}</h3>
                </div>

                {!selectedConv ? (
                  <div className="ed-msg-empty">Selectionnez une conversation pour voir les messages</div>
                ) : (
                  <>
                    <div className="ed-msg-body">
                      {convMessages.map((msg, i) => {
                        const isMine = msg.from === user?._id || msg.from?._id === user?._id;
                        return (
                          <div key={i} className={`ed-msg-bubble ${isMine ? "mine" : "theirs"}`}>
                            <div>{msg.content}</div>
                            <div className="ed-msg-time">{new Date(msg.createdAt).toLocaleTimeString("fr-TN", { hour: "2-digit", minute: "2-digit" })}</div>
                          </div>
                        );
                      })}
                    </div>
                    <form className="ed-msg-input" onSubmit={handleSendMsg}>
                      <input type="text" placeholder="Ecrire un message..." value={msgContent} onChange={(e) => setMsgContent(e.target.value)} />
                      <button type="submit" className="ed-msg-send"><Send size={16} /> Envoyer</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "profile" && (
          <>
            <div className="ed-page-header">
              <h1>Mon profil ingenieur</h1>
              <p>Informations visibles par les clients</p>
            </div>
            {profile ? (
              <AnimatedCard className="ed-profile-card" whileHover={{ scale: 1.01 }}>
                <div className="ed-profile-avatar">{initial}</div>
                <div className="ed-profile-name">{user?.name}</div>
                <div className="ed-profile-email">{user?.email}</div>
                {profile.speciality && <div className="ed-profile-detail"><span className="ed-detail-lbl">Specialite</span><span className="ed-detail-val">{profile.speciality}</span></div>}
                {profile.experience && <div className="ed-profile-detail"><span className="ed-detail-lbl">Experience</span><span className="ed-detail-val">{profile.experience} ans</span></div>}
                {profile.region && <div className="ed-profile-detail"><span className="ed-detail-lbl">Localisation</span><span className="ed-detail-val">{profile.region}</span></div>}
                {profile.pricePerM2 && <div className="ed-profile-detail"><span className="ed-detail-lbl">Tarif</span><span className="ed-detail-val">{profile.pricePerM2} DT/m2</span></div>}
                <button className="ed-card-btn" style={{ marginTop: "20px" }} onClick={() => navigate("/ingenieur/profil-creation")}>Modifier mon profil</button>
              </AnimatedCard>
            ) : (
              <div className="ed-empty">
                <div className="ed-empty-icon">-</div>
                <h3>Profil non cree</h3>
                <p>Creez votre profil pour etre visible par les clients.</p>
                <button className="ed-card-btn" style={{ marginTop: "16px", maxWidth: "300px" }} onClick={() => navigate("/ingenieur/profil-creation")}>Creer mon profil ingenieur</button>
              </div>
            )}
          </>
        )}

        {activeTab === "cv" && (
          <>
            <div className="ed-page-header">
              <h1>Deposser mon CV</h1>
              <p>Ajoutez votre CV pour postuler aux projets</p>
            </div>
            <AnimatedCard className="ed-cv-card" whileHover={{ scale: 1.01 }}>
              {cvUploaded ? (
                <div className="ed-cv-success">
                  <CheckCircle2 size={48} className="ed-cv-success-icon" />
                  <h3>CV uploade avec succes !</h3>
                  <p>Votre CV est maintenant visible sur votre profil.</p>
                </div>
              ) : (
                <>
                  <div className="ed-cv-title">Upload de votre CV</div>
                  <div className="ed-cv-sub">Deposez votre CV au format PDF</div>
                  <div className="ed-cv-drop">
                    <input type="file" accept=".pdf" onChange={handleCvUpload} id="cv-input" style={{ display: "none" }} />
                    <label htmlFor="cv-input" style={{ cursor: "pointer" }}>
                      <Upload size={36} className="ed-cv-drop-icon" />
                      <div className="ed-cv-drop-text">{cvFile ? cvFile.name : "Cliquez ou glissez votre CV ici"}</div>
                      <div className="ed-cv-drop-hint">Format PDF uniquement, max 5MB</div>
                    </label>
                  </div>
                  <button className="ed-cv-submit" onClick={handleSubmitCv} disabled={!cvFile || uploadingCv}>
                    {uploadingCv ? "Upload en cours..." : "Deposser mon CV"}
                  </button>
                </>
              )}
            </AnimatedCard>
          </>
        )}
      </main>
    </div>
  );
}