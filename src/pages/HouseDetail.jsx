import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Home,
  Ruler,
  Building2,
  BedDouble,
  Palette,
  ArrowLeft,
  Calculator,
  LogIn,
  Leaf,
  Star,
  Gem,
  ChevronRight,
} from "lucide-react";
import { getHouse } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { AnimatedButton, AnimatedCard, AnimatedFade } from "@/components/animate";
import "./HouseDetail.css";

const finitionConfig = {
  économique: {
    label: "Économique",
    className: "economique",
    icon: <Leaf size={14} />,
  },
  standard: {
    label: "Standard",
    className: "standard",
    icon: <Star size={14} />,
  },
  "haut de gamme": {
    label: "Haut de Gamme",
    className: "haut-de-gamme",
    icon: <Gem size={14} />,
  },
};

export default function HouseDetail() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getHouse(id)
      .then((res) => setHouse(res.data))
      .catch(() => navigate("/catalogue"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <div className="loading-spinner" />
          <p className="loading-text">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!house) return null;

  const finition = finitionConfig[house.finitionLevel?.toLowerCase()] ?? null;

  const specs = [
    { icon: <Ruler size={20} />, label: "Surface", value: `${house.surface} m²` },
    { icon: <Building2 size={20} />, label: "Étages", value: house.floors },
    { icon: <BedDouble size={20} />, label: "Pièces", value: house.rooms },
    { icon: <Palette size={20} />, label: "Style", value: house.style || "Moderne" },
  ];

  return (
    <div className="detail-page">
      <div className="detail-wrapper">
        <AnimatedButton className="back-btn" variant="ghost" onClick={() => navigate("/catalogue")}>
          <ArrowLeft size={16} />
          Retour au catalogue
        </AnimatedButton>

        <AnimatedFade direction="up">
          <div className="detail-hero">
            <div className="hero-icon">
              <Home size={32} />
            </div>
            <div className="hero-title-row">
              <h1 className="hero-title">{house.title}</h1>
              {finition && (
                <span className={`finition-badge ${finition.className}`}>
                  {finition.icon}
                  {finition.label}
                </span>
              )}
            </div>
            <p className="hero-desc">{house.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-main">
              <AnimatedCard className="section-card">
                <h2 className="section-title">Caractéristiques</h2>
                <div className="specs-grid">
                  {specs.map((spec) => (
                    <AnimatedCard key={spec.label} className="spec-item" whileHover={{ scale: 1.02 }}>
                      <div className="spec-icon-box">{spec.icon}</div>
                      <div>
                        <p className="spec-label">{spec.label}</p>
                        <p className="spec-value">{spec.value}</p>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </AnimatedCard>

              <AnimatedCard className="section-card">
                <h2 className="section-title">Description</h2>
                <p className="detail-desc">{house.description}</p>
              </AnimatedCard>
            </div>

            <div className="detail-sidebar">
              <AnimatedCard className="price-card" whileHover={{ scale: 1.02 }}>
                <div className="price-header">
                  <p className="price-label">Prix estimé</p>
                  <p className="price-value">
                    {house.estimatedPrice?.toLocaleString("fr-TN")}
                    <span className="price-currency">DT</span>
                  </p>
                </div>
                <div className="price-body">
                  <AnimatedButton
                    className="estimate-btn"
                    variant="primary"
                    onClick={() =>
                      user ? navigate("/terrain/localisation") : navigate("/login")
                    }
                  >
                    {user ? (
                      <>
                        <Calculator size={18} />
                        Estimer mon projet
                        <ChevronRight size={16} className="arrow" />
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Se connecter pour estimer
                      </>
                    )}
                  </AnimatedButton>
                  <p className="price-note">Estimation personnalisée gratuite</p>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </AnimatedFade>
      </div>
    </div>
  );
}