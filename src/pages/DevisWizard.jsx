import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AnimatedButton } from "@/components/animate";
import "./DevisWizard.css";

const STEPS = [
  {
    id: 1,
    label: "Etape 1",
    question: "Avez-vous déjà un terrain ?",
    subtitle: "Cela nous permet d'affiner votre estimation budgétaire",
    options: [
      { value: "oui",        label: "Oui, j'ai déjà un terrain",  icon: "✅", desc: "Je possède ou j'ai repéré un terrain" },
      { value: "non",        label: "Non, je dois en chercher un", icon: "🔍", desc: "Je dois trouver un terrain à acheter" },
      { value: "non_defini", label: "Pas encore décidé",           icon: "🤔", desc: "Je suis encore en phase de réflexion" },
    ],
  },
];



export default function DevisWizard() {
  const navigate               = useNavigate();
  const { user }               = useAuth();
  const [currentStep, setStep] = useState(0);
  const [answers, setAnswers]  = useState({});
  const [selected, setSelected]= useState(null);

  // Garde non connecté
  if (!user) { navigate("/login"); return null; }
  // Garde rôle non client
  if (user.role !== "user") { navigate("/"); return null; }

  const step     = STEPS[currentStep];
  const progress = 20; // Étape 1 sur 5 = 20%

  const handleSelect = (value) => setSelected(value);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [step.id]: selected };
    setAnswers(newAnswers);

    // Étape 1 : pas de terrain → TerrainLocation → DevisWizard2
    if (step.id === 1 && selected === "non") {
      navigate("/terrain/localisation", {
        state: { fromWizard: true, answers: newAnswers },
      });
      return;
    }

    // Étape 1 : avec terrain OU pas encore décidé → DirectDevisWizard2
    if (step.id === 1) {
      navigate("/devis-wz2", {
        state: { answers: newAnswers },
      });
      return;
    }
  };



  const handleBack = () => {
    if (currentStep === 0) { navigate(-1); return; }
    goToStep(currentStep - 1);
  };

  return (
    <div className="wiz-page">
      <header className="wiz-header">
        <div className="wiz-logo">🏠 SmartBuild</div>
        <div className="wiz-step-indicator">Étape 1 / 5</div>
      </header>

      <main className="wiz-main">
        <div className="wiz-card">
          <p className="wiz-label">{step.label}</p>
          <h2 className="wiz-question">{step.question}</h2>
          {step.subtitle && <p className="wiz-subtitle">{step.subtitle}</p>} 
                     <img 
  src="/images/Questions-rafiki.svg"
  alt="terrain estimation illustration"
  className="hero-image"
/>

          <div className={`wiz-options ${
            step.options.length >= 6 ? "grid-2" :
            step.options.length === 3 ? "grid-3" : "grid-2"
          }`}>
            {step.options.map((opt) => (
              <button
                key={opt.value}
                className={`wiz-option ${selected === opt.value ? "selected" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                <div className="wiz-opt-left">
                  <span className="wiz-opt-icon">{opt.icon}</span>
                  <div className="wiz-opt-text">
                    <span className="wiz-opt-label">{opt.label}</span>
                    {opt.desc && <span className="wiz-opt-desc">{opt.desc}</span>}
                  </div>
                </div>
                <div className={`wiz-opt-check ${selected === opt.value ? "checked" : ""}`}>
                  {selected === opt.value ? "✓" : "→"}
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <button className="wiz-btn-next" onClick={handleNext}>
              Continuer <span>→</span>
            </button>
          )}
        </div>
      </main>

      <footer className="wiz-footer">
        <div className="wiz-progress-section">
          <span className="wiz-progress-label">{progress}% achevé</span>
          <div className="wiz-progress-bar">
            <div className="wiz-progress-fill" style={{ width: `${progress}%` }} />
            <div className="wiz-progress-thumb" style={{ left: `calc(${progress}% - 10px)` }} />
          </div>
        </div>
        <button className="wiz-btn-back" onClick={handleBack}>
          Revenir <span className="wiz-back-arrow">↑</span>
        </button>
      </footer>
    </div>
  );
}
