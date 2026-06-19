import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { AnimatedButton, AnimatedCard, AnimatedFade } from "@/components/animate";
import { Printer, RotateCcw, ArrowLeft, MapPin } from "lucide-react";
import RainbowLines from "../components/RainbowLines";
import "./Quote.css";

const PRIX_M2 = {
  economique: 600,
  standard: 900,
  "haut de gamme": 1400,
};

const Fireworks = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#f59e0b", "#3b82f6", "#10b981", "#ec4899", "#8b5cf6", "#ef4444", "#22c55e"];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * -8 - 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.005,
        gravity: 0.1,
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fw-overlay">
      <canvas ref={canvasRef} className="fw-canvas" />
      <div className="fw-message">
        <h2>Felicitations</h2>
        <p>Votre devis a ete genere avec succes</p>
      </div>
    </div>
  );
};

export default function Quote() {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (!state?.construction) {
      navigate("/devis-wizard");
      return;
    }
    setLoading(false);
    setTimeout(() => setShowFireworks(true), 500);
    setTimeout(() => setShowFireworks(false), 4000);
  }, []);

  if (loading) return <div className="loading">Generation du devis...</div>;

  const { terrain, terrainInput, construction, furnishing, selectedProducts, materiauxConstruction, totalMateriaux, estimationId } = state || {};

  const terrainCost = terrain?.estimatedTotal || (terrainInput?.surface * terrain?.avgPricePerM2) || 0;
  const constructionCost = construction?.totalConstructionCost || 0;
  const furnishingCost = furnishing?.totalFurnishingCost || 0;
  const productsCost = selectedProducts?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;
  const materiauxCost = totalMateriaux || 0;
  const totalCost = terrainCost + constructionCost + furnishingCost + productsCost + materiauxCost;

  const handlePrint = () => window.print();
  const handleRestart = () => navigate("/devis-wizard");
  const handleFindEngineer = () => navigate("/choisir-ingenieur", {
    state: { totalCost, terrainInput, construction, furnishing }
  });
  const handlePostProject = () => {
    navigate("/deposer-projet", {
      state: {
        fromQuote: true,
        totalCost,
        estimationId,
        terrain,
        terrainInput,
        construction,
        furnishing,
        materiauxConstruction,
        totalMateriaux,
      }
    });
  };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      <RainbowLines variant="quote" />
      <Fireworks active={showFireworks} />
      <AnimatedFade direction="up">
        <div className="quote-page">
          <button className="quote-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Retour
          </button>

          <AnimatedCard className="quote-card" id="quote-print" whileHover={{ scale: 1.01 }}>
            <div className="quote-header">
              <div>
                <h1>SmartBuild</h1>
                <p>Devis de construction</p>
              </div>
              <div className="quote-meta">
                <p><strong>{user?.name || "Client"}</strong></p>
                <p>{new Date().toLocaleDateString("fr-TN")}</p>
              </div>
            </div>

            {terrain && (
              <div className="quote-section">
                <h3><MapPin size={16} /> Terrain - {terrainInput?.region || "Non spécifié"}</h3>
                <div className="quote-row">
                  <span>Surface</span>
                  <span>{terrainInput?.surface} m²</span>
                </div>
                {terrainInput?.address && (
                  <div className="quote-row">
                    <span>Adresse</span>
                    <span>{terrainInput.address}</span>
                  </div>
                )}
                {terrainInput?.lat && terrainInput?.lng && (
                  <div className="quote-row">
                    <span>Coordonnées</span>
                    <span>{Number(terrainInput.lat).toFixed(5)}, {Number(terrainInput.lng).toFixed(5)}</span>
                  </div>
                )}
                <div className="quote-row">
                  <span>Prix moyen / m²</span>
                  <span>{terrain?.avgPricePerM2?.toLocaleString()} DT</span>
                </div>
                <div className="quote-row total">
                  <span>Sous-total terrain</span>
                  <span>{terrainCost.toLocaleString()} DT</span>
                </div>
              </div>
            )}

            <div className="quote-section">
              <h3>Construction</h3>
              <div className="quote-row">
                <span>Surface habitable</span>
                <span>{construction?.surface} m2</span>
              </div>
              <div className="quote-row">
                <span>Nombre d'etages</span>
                <span>{construction?.floors}</span>
              </div>
              <div className="quote-row">
                <span>Type</span>
                <span>{construction?.constructionType}</span>
              </div>
              <div className="quote-row">
                <span>Finition</span>
                <span>{construction?.finitionLevel}</span>
              </div>
              <div className="quote-row">
                <span>Prix / m2</span>
                <span>{PRIX_M2[construction?.finitionLevel] || "—"} DT</span>
              </div>
              <div className="quote-row total">
                <span>Sous-total construction</span>
                <span>{constructionCost.toLocaleString()} DT</span>
              </div>
            </div>

            {materiauxConstruction && materiauxConstruction.length > 0 && (
              <div className="quote-section">
                <h3>🧱 Matériaux de construction</h3>
                {materiauxConstruction.map((m, i) => (
                  <div key={i} className="quote-row">
                    <span>{m.type} ({m.quantite} {m.unite})</span>
                    <span>{m.sousTotal?.toLocaleString()} DT</span>
                  </div>
                ))}
                <div className="quote-row total">
                  <span>Sous-total matériaux</span>
                  <span>{materiauxCost.toLocaleString()} DT</span>
                </div>
              </div>
            )}

            {furnishing && furnishing.rooms && furnishing.rooms.length > 0 && (
              <div className="quote-section">
                <h3>Ameublement</h3>
                {furnishing.rooms.map((r, i) => (
                  <div key={i} className="quote-row">
                    <span>{r.roomType} ({r.qualityLevel})</span>
                    <span>{r.cost?.toLocaleString()} DT</span>
                  </div>
                ))}
                <div className="quote-row total">
                  <span>Sous-total ameublement</span>
                  <span>{furnishingCost.toLocaleString()} DT</span>
                </div>
              </div>
            )}

            {selectedProducts?.length > 0 && (
              <div className="quote-section">
                <h3>Produits selectionnes</h3>
                {selectedProducts.map((p, i) => (
                  <div key={i} className="quote-row">
                    <span>{p.name} <span className="quote-category">({p.category})</span></span>
                    <span>{Number(p.price).toLocaleString()} DT</span>
                  </div>
                ))}
                <div className="quote-row total">
                  <span>Sous-total produits</span>
                  <span>{productsCost.toLocaleString()} DT</span>
                </div>
              </div>
            )}

            <div className="quote-grand-total">
              <span>Total general estime</span>
              <strong>{totalCost.toLocaleString()} DT</strong>
            </div>
          </AnimatedCard>

          <div className="quote-actions">
            <AnimatedButton className="print-btn" variant="primary" onClick={handlePrint}>
              <Printer size={18} />
              Imprimer / PDF
            </AnimatedButton>
            <AnimatedButton className="restart-btn" onClick={handleRestart}>
              <RotateCcw size={18} />
              Nouvelle estimation
            </AnimatedButton>
          </div>

          {user?.role === "user" && (
            <div className="quote-engineer-section">
              <h3>Besoin d'un ingenieur ?</h3>
              <p>Deposez votre projet ou choisissez un ingenieur.</p>
              <div className="quote-engineer-btns">
                <AnimatedButton className="btn-depose" variant="primary" onClick={handlePostProject}>
                  Deposer mon projet
                </AnimatedButton>
                <AnimatedButton className="btn-find-eng" onClick={handleFindEngineer}>
                  Choisir un ingenieur
                </AnimatedButton>
              </div>
            </div>
          )}

        </div>
      </AnimatedFade>
    </div>
  );
}