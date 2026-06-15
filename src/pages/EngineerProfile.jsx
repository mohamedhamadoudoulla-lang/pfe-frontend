import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEngineer } from "../services/api";
import { FALLBACK_ENGINEERS } from "../data/fallbackEngineers";
import { ArrowLeft, MapPin, Star, FileText, Download, Mail, Phone } from "lucide-react";
import RainbowLines from "../components/RainbowLines";
import "./EngineerProfile.css";

export default function EngineerProfile() {
  const { id } = useParams();
  const [engineer, setEngineer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEngineer(id)
      .then((res) => setEngineer(res.data))
      .catch(() => {
        const fb = FALLBACK_ENGINEERS.find((e) => e._id === id);
        if (fb) setEngineer(fb);
        else navigate("/ingenieurs");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="ep-loading">
        <div className="ep-loading-spinner" />
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (!engineer) return null;

  const name = engineer.user?.name || engineer.name || "Ingénieur";
  const specialty = engineer.specialty || engineer.speciality || "Spécialité non spécifiée";
  const city = engineer.city || engineer.region || "Non spécifié";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="ep-page">
      <RainbowLines variant="engineerProfile" />
      <div className="ep-back-bar">
        <button className="ep-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Retour
        </button>
      </div>

      <div className="ep-layout">
        {/* Left: Profile card */}
        <div className="ep-card">
          <div className="ep-hero">
            <div className="ep-avatar">
              {engineer.image ? (
                <img src={engineer.image} alt={name} />
              ) : (
                <span className="ep-avatar-initials">{initials}</span>
              )}
            </div>
            <div className="ep-hero-info">
              <h1 className="ep-name">{name}</h1>
              <p className="ep-specialty">{specialty}</p>
              <div className="ep-hero-tags">
                <span className="ep-tag-location"><MapPin size={12} /> {city}</span>
              </div>
            </div>
          </div>

          <div className="ep-rating-row">
            <div className="ep-rating-stars">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <span className="ep-rating-val">{engineer.rating}</span>
              <span className="ep-rating-max">/ 5</span>
            </div>
            <span className="ep-rating-label">
              {engineer.projectsCount || 0} projets réalisés
            </span>
          </div>

          {engineer.description && (
            <div className="ep-section">
              <h3>À propos</h3>
              <p>{engineer.description}</p>
            </div>
          )}

          <div className="ep-section">
            <h3>Contact</h3>
            <div className="ep-contact-list">
              <div className="ep-contact-item">
                <Mail size={15} />
                <span>{engineer.user?.email || engineer.email || "Non renseigné"}</span>
              </div>
              <div className="ep-contact-item">
                <Phone size={15} />
                <span>{engineer.user?.phone || engineer.phone || "Non renseigné"}</span>
              </div>
            </div>
          </div>

          {engineer.cv && (
            <div className="ep-cv-section">
              <h3 className="ep-cv-title">
                <FileText size={18} /> Curriculum Vitae
              </h3>
              <a
                href={engineer.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="ep-cv-btn"
              >
                <Download size={18} /> Télécharger le CV
              </a>
            </div>
          )}
        </div>

        {/* Right: Side panel */}
        <div className="ep-side">
          <div className="ep-side-card">
            <img src="/images/Construction costs-pana.svg" alt="Construction" className="ep-side-img" />
            <p className="ep-side-label">Votre partenaire de construction</p>
          </div>
          <div className="ep-side-cta">
            <h3>Intéressé par ce profil ?</h3>
            <p>Contactez cet ingénieur pour discuter de votre projet.</p>
            <button
              className="ep-side-btn"
              onClick={() => navigate(`/messages/${engineer.user?._id || engineer._id}`)}
            >
              Envoyer un message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
