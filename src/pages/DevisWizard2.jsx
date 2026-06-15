import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DevisWizard2.css";

const STEPS = [
  {
    id: 2,
    label: "Prestation",
    question: "Quelle est la prestation souhaitée ?",
    subtitle: "Sélectionnez le niveau de réalisation que vous souhaitez",
    options: [
      { value: "cle_en_main",  label: "Maison livrée clé en main",      icon: "🏠", desc: "Construction complète, prête à habiter" },
      { value: "hors_eau_air", label: "Maison livrée hors eau hors air", icon: "🧱", desc: "Structure + toiture + menuiseries" },
      { value: "gros_oeuvre",  label: "Gros œuvre uniquement",          icon: "🏗️", desc: "Fondations, murs porteurs et dalles" },
      { value: "autre",        label: "Autre",                          icon: "📋", desc: "Prestation personnalisée à définir" },
    ],
  },
  {
    id: 3,
    label: "Type maison",
    question: "Quel est le type de maison souhaité ?",
    subtitle: "Le type influence le coût de construction",
    options: [
      { value: "plain_pied", label: "Maison de plain-pied", icon: "🏡", desc: "Pas d'étage, plain-pied (RDC)" },
      { value: "avec_etage", label: "Maison avec étage(s)", icon: "🏢", desc: "R+1, R+2 ou plus" },
      { value: "non_defini", label: "Non défini",           icon: "❓", desc: "Je ne sais pas encore" },
    ],
  },
  {
    id: 4,
    label: "Construction",
    question: "Quel est le type de construction souhaité ?",
    subtitle: "Le matériau principal de construction",
    options: [
      { value: "traditionnelle", label: "Traditionnelle (parpaing)", icon: "🧱", desc: "Construction classique en parpaing" },
      { value: "brique",         label: "En brique",                 icon: "🔶", desc: "Construction en brique monomur" },
      { value: "non_defini",     label: "Non défini",                icon: "❓", desc: "À définir avec l'ingénieur" },
      { value: "autre",          label: "Autre",                     icon: "📋", desc: "Type de construction spécifique" },
    ],
  },
  {
    id: 5,
    label: "Finition",
    question: "Quel niveau de finition souhaitez-vous ?",
    subtitle: "Chaque niveau inclut les caractéristiques maison et équipements correspondants",
    options: [
      { value: "économique",    label: "Économique",    icon: "💚", desc: "Matériaux standards, budget maîtrisé — ~600 DT/m²" },
      { value: "standard",      label: "Standard",      icon: "💛", desc: "Bon rapport qualité/prix — ~900 DT/m²" },
      { value: "haut de gamme", label: "Haut de gamme", icon: "💎", desc: "Matériaux premium, finitions soignées — ~1400 DT/m²" },
    ],
  },
];

const FINITION_ROUTES = {
  "économique":    "/finition/economique",
  "standard":      "/finition/standard",
  "haut de gamme": "/finition/haut-de-gamme",
};

const STEP_PROGRESS = { 2: 40, 3: 55, 4: 70, 5: 85 };

export default function DevisWizard2() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState(location.state?.answers || {});

  const step = STEPS[currentStep];
  const progress = STEP_PROGRESS[step.id];

  const handleSelectOption = (value) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [step.id]: selected };
    setAnswers(newAnswers);
    if (step.id === 5) {
      const route = FINITION_ROUTES[selected] || "/finition/standard";
      navigate(route, {
        state: {
          fromWizard: true,
          answers: newAnswers,
          finitionLevel: selected,
          terrain: location.state?.terrain,
          terrainInput: location.state?.terrainInput,
        },
      });
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelected(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelected(answers[STEPS[currentStep - 1]?.id] || null);
    } else {
      navigate("/devis-wz");
    }
  };

  return (
    <div className="ca-wrapper">
      <div className="ribbon-wrap">
        <svg
          viewBox="0 0 1000 640"
          xmlns="http://www.w3.org/2000/svg"
          className="ca-ribbon-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c8f400" />
              <stop offset="40%" stopColor="#ff6a00" />
              <stop offset="100%" stopColor="#ff2d8b" />
            </linearGradient>
          </defs>
          <path
            d="M -50 -20 C 100 -20, 180 120, 250 60 C 320 0, 280 200, 220 180 C 160 160, 200 60, 280 60 C 360 60, 500 20, 700 100 C 850 170, 950 150, 1060 130"
            fill="none"
            stroke="url(#ribbonGrad)"
            strokeWidth="30"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="ca-content">
        <div className="ca-left">
          <div className="dw-step-badge">{step.label}</div>
          <h1 className="ca-title">{step.question}</h1>
          <p className="ca-subtitle">{step.subtitle}</p>

          <div className="dw-progress-wrap">
            <span className="dw-progress-label">{progress}% achevé</span>
            <div className="dw-progress-track">
              <div className="dw-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="dw-rail">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`dw-rail-step ${i <= currentStep ? "done" : ""} ${i === currentStep ? "active" : ""}`}>
                <span className="dw-rail-num">{i <= currentStep ? "✓" : i + 1}</span>
                <span className="dw-rail-name">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ca-right">
          <div className="dw-options">
            {step.options.map((option) => (
              <button
                key={option.value}
                className={`dw-option ${selected === option.value ? "selected" : ""}`}
                onClick={() => handleSelectOption(option.value)}
              >
                <span className="dw-opt-icon">{option.icon}</span>
                <div className="dw-opt-body">
                  <strong>{option.label}</strong>
                  <span className="dw-opt-desc">{option.desc}</span>
                </div>
                <span className={`dw-opt-dot ${selected === option.value ? "checked" : ""}`} />
              </button>
            ))}
          </div>

          <div className="dw-nav">
            <button className="dw-btn-ghost" onClick={handleBack}>
              ← Revenir
            </button>
            {selected && (
              <button className="ca-btn" onClick={handleNext}>
                {step.id === 5 ? "Choisir la finition" : "Continuer"} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
