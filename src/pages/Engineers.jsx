import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEngineers } from "../services/api";
import { FALLBACK_ENGINEERS } from "../data/fallbackEngineers";
import { MapPin, Star, Briefcase, GraduationCap, ChevronRight, Search, Building2, ArrowLeft } from "lucide-react";
import "./Engineers.css";

export default function Engineers() {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getEngineers()
      .then((res) => setEngineers(res.data.length > 0 ? res.data : FALLBACK_ENGINEERS))
      .catch(() => setEngineers(FALLBACK_ENGINEERS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = engineers.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.specialty?.toLowerCase().includes(search.toLowerCase()) ||
    e.speciality?.toLowerCase().includes(search.toLowerCase()) ||
    e.city?.toLowerCase().includes(search.toLowerCase()) ||
    e.region?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="eng-loading-screen">
        <div className="eng-loading-spinner" />
        <p>Chargement des ingénieurs...</p>
      </div>
    );
  }

  return (
    <div className="eng-page">
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "fixed", top: "90px", left: "24px", zIndex: 1000,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
          border: "1.5px solid #e2e8f0", borderRadius: "50%",
          width: "42px", height: "42px", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", color: "#334155",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#3b82f6"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.color = "#334155"; }}
      >
        <ArrowLeft size={20} />
      </button>

      <section className="eng-hero">
        <div className="eng-hero-bg" />
        <div className="eng-hero-content">
          <h1 className="eng-hero-title">Nos ingénieurs & experts</h1>
          <p className="eng-hero-sub">
            Des professionnels qualifiés pour accompagner votre projet de construction
          </p>
          <div className="eng-search-wrap">
            <Search size={18} className="eng-search-icon" />
            <input
              type="text"
              className="eng-search-input"
              placeholder="Rechercher par nom, spécialité ou ville..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="eng-stats">
        <div className="eng-stat">
          <strong>{engineers.length}</strong>
          <span>Ingénieurs disponibles</span>
        </div>
        <div className="eng-stat">
          <strong>{engineers.reduce((s, e) => s + (e.projectsCount || 0), 0)}+</strong>
          <span>Projets réalisés</span>
        </div>
        <div className="eng-stat">
          <strong>
            {engineers.length > 0
              ? (Math.round(engineers.reduce((s, e) => s + (e.rating || 0), 0) / engineers.length * 10) / 10)
              : "—"}
          </strong>
          <span>Note moyenne</span>
        </div>
      </section>

      <section className="eng-section">
        <div className="eng-container">
          {filtered.length === 0 ? (
            <div className="eng-empty">
              <Building2 size={48} />
              <h3>Aucun ingénieur trouvé</h3>
              <p>Essayez de modifier votre recherche.</p>
            </div>
          ) : (
            <div className="eng-grid">
              {filtered.map((eng) => (
                <div
                  key={eng._id}
                  className="eng-card"
                  onClick={() => navigate(`/ingenieur/${eng._id}`)}
                >
                  <div className="eng-card-header">
                    <div className="eng-avatar">
                      {eng.image ? (
                        <img src={eng.image} alt={eng.name} />
                      ) : (
                        <span className="eng-avatar-initials">
                          {(eng.user?.name || eng.name || "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="eng-rating-badge">
                      <Star size={12} />
                      {eng.rating}
                    </div>
                  </div>
                  <h3 className="eng-card-name">{eng.user?.name || eng.name}</h3>
                  <p className="eng-card-specialty">{eng.specialty || eng.speciality}</p>
                  <div className="eng-card-meta">
                    <span><MapPin size={13} /> {eng.city || eng.region}</span>
                    <span><Briefcase size={13} /> {eng.experience} ans</span>
                    <span><GraduationCap size={13} /> {eng.projectsCount || 0} projets</span>
                  </div>
                  <p className="eng-card-desc">{eng.description}</p>
                  <div className="eng-cert-list">
                    {(eng.certifications || []).slice(0, 2).map((cert, i) => (
                      <span key={i} className="eng-cert-tag">{cert}</span>
                    ))}
                  </div>
                  <div className="eng-card-cta">
                    <span>Voir le profil</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
