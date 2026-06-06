import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin, BarChart3, Home, Sofa, Check,
  ChevronRight, ChevronLeft, Ruler, Layers,
  Hammer, Leaf, Star, Gem, Calculator, Zap,
} from "lucide-react";
import { AnimatedButton, AnimatedCard, AnimatedFade, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";
import "./HouseFeatures.css";

const COSTS = {
  économique:    600,
  standard:      900,
  "haut de gamme": 1400,
};

const STEPS = [
  { label: "Localisation", icon: MapPin    },
  { label: "Terrain",      icon: BarChart3 },
  { label: "Construction", icon: Home      },
  { label: "Ameublement",  icon: Sofa      },
];

const CONSTRUCTION_TYPES = [
  { value: "classique",    label: "Classique (béton armé)" },
  { value: "moderne",      label: "Moderne"                },
  { value: "traditionnel", label: "Traditionnel"           },
];

const FINITIONS = [
  { value: "économique",    label: "Économique",    key: "economique", icon: <Leaf size={20} /> },
  { value: "standard",      label: "Standard",      key: "standard",   icon: <Star size={20} /> },
  { value: "haut de gamme", label: "Haut de Gamme", key: "haut",       icon: <Gem  size={20} /> },
];

const CURRENT_STEP = 2;

export default function HouseFeatures() {
  const { state }  = useLocation();       // ✅ DANS le composant
  const navigate   = useNavigate();

  // ✅ useState DANS le composant — avec valeurs du wizard
  const [form, setForm] = useState({
    surface:          "",
    floors:           "1",
    constructionType: state?.answers?.[4] || "classique",
    finitionLevel:    state?.finitionLevel || "standard",
  });

  const estimated = form.surface
    ? Number(form.surface) * COSTS[form.finitionLevel] * parseInt(form.floors)
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/ameublement", {
      state: {
        ...state,
        construction: { ...form, totalConstructionCost: estimated },
      },
    });
  };

  return (
    <div className="step-page">
      <div className="step-container">
        <div className="stepper">
          <div className="stepper-track" />
          {STEPS.map((step, index) => {
            const Icon     = step.icon;
            const isDone   = index < CURRENT_STEP;
            const isActive = index === CURRENT_STEP;
            return (
              <div className="stepper-step" key={step.label}>
                <div className={`step-circle ${isDone ? "done" : isActive ? "active" : "pending"}`}>
                  {isDone ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`step-label ${!isDone && !isActive ? "pending" : ""}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="step-card">
          <div className="step-header">
            <div className="step-header-icon"><Hammer size={22} /></div>
            <div>
              <h2>Caractéristiques de la maison</h2>
              <p>Définissez les paramètres de construction</p>
            </div>
          </div>

          <form className="step-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><Ruler size={15} /> Surface habitable (m²)</label>
                <input
                  className="form-input"
                  type="number" min="30" placeholder="Ex: 150"
                  value={form.surface}
                  onChange={(e) => setForm({ ...form, surface: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label"><Layers size={15} /> Nombre d'étages</label>
                <select
                  className="form-select"
                  value={form.floors}
                  onChange={(e) => setForm({ ...form, floors: e.target.value })}
                >
                  <option value="1">1 étage (RDC)</option>
                  <option value="2">2 étages</option>
                  <option value="3">3 étages</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Hammer size={15} /> Type de construction</label>
              <div className="construction-grid">
                {CONSTRUCTION_TYPES.map((type) => (
                  <button
                    key={type.value} type="button"
                    className={`construction-btn ${form.constructionType === type.value ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, constructionType: type.value })}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Star size={15} /> Niveau de finition</label>
              <div className="finition-grid">
                {FINITIONS.map((f) => {
                  const isSelected = form.finitionLevel === f.value;
                  const colorKey   = isSelected ? f.key : "inactive";
                  return (
                    <button
                      key={f.value} type="button"
                      className={`finition-opt ${isSelected ? `selected-${f.key}` : ""}`}
                      onClick={() => setForm({ ...form, finitionLevel: f.value })}
                    >
                      {isSelected && (
                        <span className={`finition-check ${f.key}`}><Check size={10} /></span>
                      )}
                      <span className={`finition-icon ${colorKey}`}>{f.icon}</span>
                      <span className={`finition-name ${colorKey}`}>{f.label}</span>
                      <span className={`finition-price ${colorKey}`}>{COSTS[f.value]} DT/m²</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {form.surface && (
              <div className="estimate-preview">
                <div className="estimate-left">
                  <div className="estimate-icon"><Calculator size={18} /></div>
                  <div>
                    <p className="estimate-title">Estimation construction</p>
                    <p className="estimate-detail">
                      {form.surface} m² × {COSTS[form.finitionLevel]} DT × {form.floors} étage{parseInt(form.floors) > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <p className="estimate-amount">
                  {estimated.toLocaleString("fr-TN")}
                  <span className="estimate-currency"> DT</span>
                </p>
              </div>
            )}

            <div className="nav-actions">
              <button type="button" className="prev-btn" onClick={() => navigate("/terrain/estimation")}>
                <ChevronLeft size={18} /> Précédent
              </button>
              <button type="button" className="equipment-btn" onClick={() => navigate("/equipments/marketplace")}>
                <Zap size={16} /> Voir les équipements
              </button>
              <button type="submit" className="next-btn">
                Suivant : Ameublement <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}