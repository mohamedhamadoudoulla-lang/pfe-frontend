import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DevisWizard.css";

const STEPS = [
  {
    id: 1,
    label: "Terrain",
    question: "Avez-vous déjà un terrain ?",
    subtitle: "Cela nous permet d'affiner votre estimation budgétaire",
    options: [
      { value: "oui",        label: "Oui, j'ai déjà un terrain",  icon: "✅", desc: "Je possède ou j'ai repéré un terrain" },
      { value: "non",        label: "Non, je dois en chercher un", icon: "🔍", desc: "Je dois trouver un terrain à acheter" },
      { value: "non_defini", label: "Pas encore décidé",           icon: "🤔", desc: "Je suis encore en phase de réflexion" },
    ],
  },
  {
    id: 101,
    label: "Type",
    question: "Type de construction ?",
    subtitle: "Quel type de bâtiment souhaitez-vous construire ?",
    options: [
      { value: "residentielle", label: "Résidentielle", icon: "🏠", desc: "Maison individuelle, villa, appartement" },
      { value: "commerciale",   label: "Commerciale",   icon: "🏢", desc: "Bureau, local commercial, magasin" },
      { value: "mixte",         label: "Mixte",          icon: "🏘️", desc: "Résidentiel + commercial" },
    ],
  },
  {
    id: 102,
    label: "Statut",
    question: "Statut administratif ?",
    subtitle: "Où en êtes-vous sur le plan administratif ?",
    options: [
      { value: "pret",       label: "Prêt à construire",  icon: "📋", desc: "Permis de construire obtenu, terrain prêt" },
      { value: "en_cours",   label: "En cours",           icon: "⏳", desc: "Permis en instruction, études en cours" },
      { value: "aucun",      label: "Pas encore entamé",  icon: "📝", desc: "Rien n'a été fait pour le moment" },
    ],
  },
  {
    id: 103,
    label: "Projet",
    question: "Nouvelle construction ou rénovation ?",
    subtitle: "Précisez la nature de votre projet",
    options: [
      { value: "nouvelle",      label: "Nouvelle construction", icon: "🏗️", desc: "Construire depuis les fondations" },
      { value: "renovation",    label: "Rénovation",            icon: "🔨", desc: "Rénover ou réhabiliter un existant" },
      { value: "extension",     label: "Extension / Surélévation", icon: "📐", desc: "Agrandir ou surélever un bâtiment" },
    ],
  },
];

export default function DevisWizard() {
  const navigate               = useNavigate();
  const { user }               = useAuth();
  const [currentStep, setStep] = useState(0);
  const [answers, setAnswers]  = useState({});
  const [selected, setSelected]= useState(null);

  if (!user) { navigate("/login"); return null; }
  if (user.role !== "user") { navigate("/"); return null; }

  const step     = STEPS[currentStep];
  const progress = Math.round(((currentStep + 1) / (STEPS.length + 1)) * 100);

  const handleSelect = (value) => {
    setSelected(value);
    if (step.id === 1 && value === "non") {
      const newAnswers = { ...answers, [step.id]: value };
      navigate("/terrain/localisation", {
        state: { fromWizard: true, answers: newAnswers },
      });
    }
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [step.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (currentStep === STEPS.length - 1) {
      navigate("/devis-wz2", {
        state: { answers: newAnswers },
      });
      return;
    }
    setStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) { navigate(-1); return; }
    setSelected(answers[STEPS[currentStep - 1].id] || null);
    setStep(currentStep - 1);
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
          <div className="dw-step-badge">Étape {currentStep + 1} / {STEPS.length}</div>
          <h1 className="ca-title">{step.question}</h1>
          <p className="ca-subtitle">{step.subtitle}</p>

          <div className="dw-progress-wrap">
            <span className="dw-progress-label">{progress}% achevé</span>
            <div className="dw-progress-track">
              <div className="dw-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="ca-right">
          <div className="dw-options">
            {step.options.map((opt) => (
              <button
                key={opt.value}
                className={`dw-option ${selected === opt.value ? "selected" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span className="dw-opt-icon">{opt.icon}</span>
                <div className="dw-opt-body">
                  <strong>{opt.label}</strong>
                  <span className="dw-opt-desc">{opt.desc}</span>
                </div>
                <span className={`dw-opt-dot ${selected === opt.value ? "checked" : ""}`} />
              </button>
            ))}
          </div>

          <div className="dw-nav">
            <button className="dw-btn-ghost" onClick={handleBack}>
              ← Revenir
            </button>
            {selected && (
              <button className="ca-btn" onClick={handleNext}>
                {currentStep === STEPS.length - 1 ? "Voir l'estimation" : "Continuer"} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
